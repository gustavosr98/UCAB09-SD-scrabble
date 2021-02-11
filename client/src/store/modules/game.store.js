import zkClient from "@/connections/zookeeper/zk-client";
import Logger from "@/utils/logger";
import GamesRepository from "@/connections/server/repositories/games.repository.js";
import UsersRepository from "@/connections/server/repositories/users.repository.js";

import { ROOM_STATUS, MOVE_TYPE } from "@/config/constants";

const gamesRepository = new GamesRepository();
const usersRepository = new UsersRepository();

const TURN_TIMER_INITIAL = 300;

// Initial State object
const initialState = () => {
  return {
    timer: {
      timer: null,
      time: TURN_TIMER_INITIAL,
      isRunning: false,
    },
    // base
    roomId: null,
    playerId: null,
    userGame: null,
    // shard inside room-{id}
    players: [],
    status: null,
    lettersDeck: [],
    movesHistory: [],
    board: [],
    actualRound: null,
    turn: {
      playerId: null,
    },
    // ui
    error: {
      minor: null,
      major: null,
    },
  };
};

const toKV = (key, value) => ({ key, value });

// State object
const state = initialState();

const getPlayer = (state, id) => {
  return state.players.find(p => p?.info.id === id);
};

// Getter functions
const getters = {
  // BASE
  get: state => key => {
    return state[key];
  },
  // GAME
  getPlayer,
};

// Mutations
const mutations = {
  // BASE
  set(state, { key, value }) {
    state[key] = value;
  },
  reset(state) {
    const newState = initialState();
    Object.keys(newState).forEach(key => {
      state[key] = newState[key];
    });
  },
  // GAME
  setRoom(state, room) {
    Object.keys(room).forEach(key => {
      state[key] = room[key];
    });
  },
  error(state, errorMessage, level = "major") {
    state.error[level] = errorMessage;
    throw new Error("[ERROR] [GameStore]: " + errorMessage);
  },
  // TIMER
  resetTimer(state) {
    clearInterval(state.timer.timer);
    state.timer.isRunning = false;
    state.timer.timer = null;
    state.timer.time = TURN_TIMER_INITIAL;
  },
};

// Actions
const actions = {
  // CONNECTION
  async connect({ commit }) {
    try {
      await zkClient.connect();
    } catch {
      commit(
        "error",
        "Hubo un error al entrar a la sala. Probablemente tengas problemas de conexión. Intenta entrar de nuevo."
      );
    }
  },
  async loadNode({ dispatch, commit, state }) {
    await dispatch("connect");
    if (!(await zkClient.exists(`/room-${state.roomId}`))) {
      commit("error", "La sala no existe o ya ha sido cerrada");
    } else {
      await dispatch("getData");
      await dispatch("createEphemeral");
    }
  },
  async getData({ dispatch, commit }) {
    const room = await zkClient.getData(`/room-${state.roomId}`, event => {
      if (zkClient.Event.NODE_DATA_CHANGED === event.getType()) {
        console.log("CAMBIE");
        dispatch("getData");
      }
    });
    commit("setRoom", room);
  },
  async createEphemeral({ commit, state }) {
    try {
      zkClient.createEphemeral(`/room-${state.roomId}/${state.playerId}`);
    } catch {
      commit("error", "Ya estas conectado en esta sala desde otro computador.");
    }
  },
  // ROOM
  async createRoom({ dispatch, commit }, { roomId, user }) {
    commit("set", toKV("playerId", user.id));
    await dispatch("connect");

    if (!(await zkClient.exists(`/room-${roomId}`))) {
      await zkClient.create(`/room-${roomId}`);
      await zkClient.setData(`/room-${roomId}`, {
        players: [
          {
            info: user,
            isActive: true,
            timeLeftToCickOut: 300,
            wasKickedOut: false,
            tokens: [],
          },
        ],
        status: ROOM_STATUS.CREATED,
        lettersDeck: [],
        movesHistory: [],
        board: [],
        actualRound: 1,
        turn: {
          playerId: user.id,
        },
      });
    }

    await dispatch("enterRoom", { roomId, user });
  },
  async enterRoom({ dispatch, commit, state }, { roomId, user }) {
    commit("set", toKV("roomId", roomId));
    commit("set", toKV("playerId", user.id));
    await dispatch("loadNode");

    const player = getPlayer(state, user.id);
    if (!player) {
      commit(
        "set",
        toKV("players", [
          ...state.players,
          {
            info: user,
            isActive: true,
            timeLeftToCickOut: 300,
            wasKickedOut: false,
            tokens: [],
          },
        ])
      );
      await dispatch("updateRoom");
    } else if (player.wasKickedOut) {
      commit(
        "error",
        "Fuiste expulsado de la partida por problemas de conexión."
      );
    }
  },
  async closeDoorAndStartGame({ dispatch, commit, state }) {
    dispatch("startTurnTimer");
  },
  async updateRoom({ state }) {
    await zkClient.setData(`/room-${state.roomId}`, {
      players: state.players,
      status: state.status,
      lettersDeck: state.lettersDeck,
      movesHistory: state.movesHistory,
      board: state.board,
      actualRound: state.actualRound,
      turn: state.turn,
    });
  },
  async exitRoom({ dispatch, state }) {
    if (ROOM_STATUS.IN_PROGRESS) {
      await dispatch("kickOutOfRoomForcely", state.playerId);
    } else {
      await dispatch("kickOutOfRoomGently", state.playerId);
    }
    await zkClient.close();
  },
  async kickOutOfRoomForcely({ dispatch, commit, state }, playerId) {
    commit(
      "set",
      toKV(
        "players",
        state.players.map(p => {
          if (p?.info.id === playerId) {
            p.info.wasKickedOut = true;
          } else return p;
        })
      )
    );

    const playerUserGame = await usersRepository.getUserGame(
      playerId,
      state.roomId
    );
    await gamesRepository.updateUserGame(playerUserGame.id, {
      totalPoints: 0,
      isHost: playerUserGame.isHost,
      wasKickedOut: true,
    });

    dispatch("updateRoom");
  },
  async kickOutOfRoomGently({ dispatch, commit, state }, playerId) {
    commit(
      "set",
      toKV(
        "players",
        state.players.map(p => {
          if (p?.info.id !== playerId) return p;
        })
      )
    );

    const playerUserGame = await usersRepository.getUserGame(
      playerId,
      state.roomId
    );
    await gamesRepository.deleteUserGame(playerUserGame.id);
    if (playerUserGame.isHost) {
      await gamesRepository.delete(state.roomId);
    }
    dispatch("updateRoom");
  },
  async closeRoom({ state }) {
    await zkClient.removeRecursive(`/room-${state.roomId}`);
  },
  // TURN ACTIONS
  async tellNextPlayerToPlay({ dispatch, commit, state }, playingPlayerId) {
    const playingPlayerIndex = state.players.findIndex(
      p => p?.user.id === playingPlayerId
    );
    let nextPlayerId = null;
    if (playingPlayerIndex + 1 === state.players.length) {
      nextPlayerId = state.players.find(
        p => !p?.wasKickedOut && p?.user.id !== playingPlayerId
      );
    } else {
      nextPlayerId = state.players.find(
        (p, index) =>
          !p?.wasKickedOut &&
          p?.user.id !== playingPlayerId &&
          index > playingPlayerIndex
      );
    }

    if (nextPlayerId) {
      commit(
        "set",
        toKV("turn", {
          ...state.turn,
          playerId: nextPlayerId,
        })
      );
      dispatch("updateRoom");
    } else {
      dispatch("reportScore", state.player);
    }
  },
  // TURN ACTIONS / PLAY
  async sendMove(tokens /*Token[]*/) {},
  // TURN ACTIONS / PASS
  async pass({ dispatch, state }) {
    // make move
    dispatch("tellNextPlayerToPlay", state.playerId);
  },
  // TURN ACTIONS / CHANGE_TOKENS
  async changeTokens(tokens /*Token[]*/) {},
  // ENDGAME
  async reportScore({ dispatch }) {
    // gameRepository.update(....)
    await dispatch("closeRoom");
  },
  // TIMER
  async startTurnTimer({ dispatch, commit, state }) {
    commit("resetTimer");
    commit("set", toKV("timer", { ...state.timer, isRunning: true }));

    if (!state.timer.timer) {
      commit(
        "set",
        toKV("timer", {
          ...state.timer,
          timer: setInterval(async () => {
            if (state.timer.time > 0) {
              state.timer.time--;
            } else if (state.turn.playerId === state.playerId) {
              await dispatch("pass");
              commit("resetTimer");
            }
          }, 1000),
        })
      );
    }
  },

  // OTHERS
  reset({ commit }) {
    commit("reset");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
