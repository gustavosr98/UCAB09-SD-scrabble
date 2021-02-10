import zkClient from "@/connections/zookeeper/zk-client";
import { ROOM_STATUS, MOVE_TYPE } from "@/config/constants";

import Logger from "@/utils/logger";

// Initial State object
const initialState = () => {
  return {
    // base
    roomId: null,
    playerId: null,
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
      const room = await zkClient.getData(`/room-${state.roomId}`, event => {
        if (zkClient.Event.NODE_DATA_CHANGED === event.getType()) {
          console.log("CAMBIE");
        }
      });
      commit("setRoom", room);
      await dispatch("createEphemeral");
    }
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
    try {
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
    } catch {
      commit("error", "Hubo un problema creando la sala.");
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
  async closeDoorAndStartGame({ dispatch, commit, state }) {},
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
    if (state.ROOM_STATUS.IN_PROGRESS) {
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
          if (p?.user.id === playerId) {
            p.user.wasKickedOut = true;
          } else return p;
        })
      )
    );
    dispatch("updateRoom");
  },
  async kickOutOfRoomGently({ dispatch, commit, state }, playerId) {
    commit("set");
    dispatch("updateRoom");
  },
  async closeRoom({ state }) {
    await zkClient.removeRecursive(`/room-${state.roomId}`);
  },
  // TURN ACTIONS
  async tellNextPlayerToPlay({ dispatch, commit, state }) {
    const myPlayerIndex = state.players.findIndex(
      p => p?.user.id === state.playerId
    );
    let nextPlayerId = null;
    if (myPlayerIndex + 1 === state.players.length) {
      nextPlayerId = state.players.find(
        p => !p?.wasKickedOut && p?.user.id !== state.playerId
      );
    } else {
      nextPlayerId = state.players.find(
        (p, index) =>
          !p?.wasKickedOut &&
          p?.user.id !== state.playerId &&
          index > myPlayerIndex
      );
    }

    commit(
      "set",
      toKV("turn", {
        ...state.turn,
        playerId: nextPlayerId,
      })
    );

    dispatch("updateRoom");
  },
  // TURN ACTIONS / PLAY
  async sendMove(tokens /*Token[]*/) {},
  // TURN ACTIONS / PASS
  async pass() {},
  // TURN ACTIONS / CHANGE_TOKENS
  async changeTokens(tokens /*Token[]*/) {},
  // ENDGAME
  async reportScore({ dispatch }) {
    // gameRepository.update(....)
    await dispatch("closeRoom");
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
