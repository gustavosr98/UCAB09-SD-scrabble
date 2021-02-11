import zkClient from "@/connections/zookeeper/zk-client";
import GamesRepository from "@/connections/server/repositories/games.repository.js";
import UsersRepository from "@/connections/server/repositories/users.repository.js";

import { ROOM_STATUS, MOVE_TYPE } from "@/config/constants";

const gamesRepository = new GamesRepository();
const usersRepository = new UsersRepository();

const TURN_TIMER_INITIAL = 300;
const KICK_OUT_TIMER_INITIAL = 60;

// Initial State object
const initialState = () => {
  return {
    // LOCAL
    timer: {
      timer: null,
      time: TURN_TIMER_INITIAL,
      isRunning: false,
    },
    kickOutInterval: null,
    kickOutTimers: {},
    // base
    roomId: null,
    playerId: null,
    userGame: null,
    // ui
    error: {
      minor: null,
      major: null,
    },
    // SHARED
    validatedCells: [],
    players: [],
    status: null,
    lettersDeck: [],
    movesHistory: [
      {
        alias: "P1",
        words: "hola",
        points: 12,
      },
    ],
    board: [],
    actualRound: null,
    turn: {
      playerId: null,
    },
  };
};

const toKV = (key, value) => ({ key, value });

// State object
const state = initialState();

const getPlayer = (state, id) => {
  return state.players.find(p => p?.id === id);
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
    if (state.timer.timer) clearInterval(state.timer.timer);
    state.timer.isRunning = false;
    state.timer.timer = null;
    state.timer.time = TURN_TIMER_INITIAL;
  },
};

// Actions
const actions = {
  // SETTER
  async set({ dispatch, commit }, { key, value }) {
    commit("set", { key, value });
    dispatch("updateRoom");
  },
  // CONNECTION
  async connect({ dispatch, commit, state }) {
    try {
      await zkClient.connect();
      await dispatch("startPlayersConnectivityPooling");
    } catch {
      commit(
        "error",
        "Hubo un error al entrar a la sala. Probablemente tengas problemas de conexión. Intenta entrar de nuevo."
      );
    }
  },
  async loadNode({ dispatch, commit, state }) {
    if (!(await zkClient.exists(`/room-${state.roomId}`))) {
      commit("error", "La sala no existe o ya ha sido cerrada");
    } else {
      await dispatch("getData");
      await dispatch("createEphemeral");
    }
  },
  async getData({ dispatch, commit }) {
    const room = await zkClient.getData(`/room-${state.roomId}`, event => {
      dispatch("getData");
    });

    commit("setRoom", room);

    dispatch("checkGameover");

    if (
      state.timer.time === TURN_TIMER_INITIAL &&
      state.turn.playerId === state.playerId &&
      state.status === ROOM_STATUS.IN_PROGRESS
    )
      dispatch("startTurnTimer");
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
            ...user,
            idGame: `P${state.players.length + 1}`,
            isActive: true,
            wasKickedOut: false,
            hand: [],
            score: 0,
            turn: state.turn.playerId === user.id,
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
        validatedCells: [],
      });
    }

    await dispatch("enterRoom", { roomId, user });
  },
  async enterRoom({ dispatch, commit, state }, { roomId, user }) {
    commit("set", toKV("roomId", roomId));
    commit("set", toKV("playerId", user.id));
    if (!state.userGame.isHost) await dispatch("connect");
    await dispatch("loadNode");

    const player = getPlayer(state, user.id);
    if (!player) {
      commit(
        "set",
        toKV("players", [
          ...state.players,
          {
            ...user,
            idGame: `P${state.players.length + 1}`,
            isActive: true,
            wasKickedOut: false,
            hand: [],
            score: 0,
            turn: state.turn.playerId === user.id,
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
    await gamesRepository.updateGameStatus(state.userGame.game.id, 2);
    commit("set", toKV("status", ROOM_STATUS.IN_PROGRESS));
    dispatch("updateRoom");
    await dispatch("startTurnTimer");
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
      validatedCells: state.validatedCells,
    });
  },
  async exitRoom({ dispatch, state }, playerId) {
    if (state.status === ROOM_STATUS.IN_PROGRESS) {
      await dispatch("kickOutOfRoomForcely", playerId);
    } else {
      await dispatch("kickOutOfRoomGently", playerId);
    }

    await zkClient.close();

    if (playerId === state.playerId) {
      clearInterval(state.kickOutInterval);
    }
  },
  async kickOutOfRoomForcely({ dispatch, state }, playerId) {
    state.players.map(p => {
      if (p?.id === playerId) {
        p.wasKickedOut = true;
      }
    });

    await dispatch("updateRoom");

    const playerUserGame = await usersRepository.getUserGame(
      playerId,
      state.roomId
    );
    await gamesRepository.updateUserGame(playerUserGame.id, {
      totalPoints: 0,
      isHost: playerUserGame.isHost,
      wasKickedOut: true,
    });
  },
  async kickOutOfRoomGently({ dispatch, commit, state }, playerId) {
    commit(
      "set",
      toKV(
        "players",
        state.players.filter(p => p?.id !== playerId)
      )
    );
    await dispatch("updateRoom");

    const playerUserGame = await usersRepository.getUserGame(
      playerId,
      state.roomId
    );
    await gamesRepository.deleteUserGame(playerUserGame.id);
    if (playerUserGame.isHost) {
      await gamesRepository.delete(state.roomId);
    }
  },
  // TURN ACTIONS
  async tellNextPlayerToPlay({ dispatch, commit, state }, playingPlayerId) {
    const playingPlayerIndex = state.players.findIndex(
      p => p?.id === playingPlayerId
    );

    let nextPlayer = null;
    if (playingPlayerIndex + 1 === state.players.length) {
      nextPlayer = state.players.find(
        p => !p?.wasKickedOut && p?.id !== playingPlayerId
      );
      console.log("a");
      console.log(nextPlayer);
    } else {
      nextPlayer = state.players.find(
        (p, index) =>
          !p?.wasKickedOut &&
          p?.id !== playingPlayerId &&
          index > playingPlayerIndex
      );
      console.log(nextPlayer);
    }

    if (nextPlayer) {
      commit(
        "set",
        toKV("turn", {
          ...state.turn,
          playerId: nextPlayer.id,
        })
      );
      await dispatch("updateRoom");
      await dispatch("startTurnTimer");
    } else {
      await dispatch("reportScore", state.player);
    }
  },
  // TURN ACTIONS / PLAY
  async sendMove(
    { dispatch, commit, state },
    { words, points, validatedCells }
  ) {
    const myPlayer = state.players.find(p => p?.id === state.playerId);

    commit("set", toKV("validatedCells", validatedCells));
    state.movesHistory = [
      ...state.movesHistory,
      {
        alias: myPlayer?.idGame,
        words: words.reduce((total, w) => `${w}, ${total}`, ""),
        points,
      },
    ];
    dispatch("updateUserPlayer", {
      ...myPlayer,
      score: myPlayer.score + points,
    });
    dispatch("fillHands");
    await dispatch("tellNextPlayerToPlay", state.playerId);
  },
  // TURN ACTIONS / PASS
  async pass({ dispatch, state }) {
    state.movesHistory = [
      ...state.movesHistory,
      {
        alias: state.players.find(p => p?.id === state.playerId)?.idGame,
        words: "",
        points: 0,
      },
    ];

    await dispatch("tellNextPlayerToPlay", state.playerId);
  },
  // TURN ACTIONS / CHANGE_TOKENS
  async changeTokens({ dispatch }, tokens /*Token[]*/) {
    await dispatch("tellNextPlayerToPlay", state.playerId);
  },
  // ENDGAME
  async checkGameover({ dispatch }) {
    // allPlayersPassed

    const totalPlayers = state.players.filter(player => !player?.wasKickedOut);
    let allPlayersPassed = true;
    for (let player of totalPlayers) {
      let playerRoundsPassing = 0;
      let i = state.movesHistory.length - 1;
      let playerMove;
      while (playerRoundsPassing < 2 && allPlayersPassed && i >= 0) {
        playerMove = state.movesHistory[i];
        if (playerMove.alias === player.idGame) {
          if (playerMove.words === "") {
            playerRoundsPassing++;
          } else {
            allPlayersPassed = false;
          }
        }
        i--;
      }

      if (!allPlayersPassed) {
        break;
      }
    }

    const playerWinner = state.players.sort((a, b) => b.score - a.score)[0];
    const imWinner = playerWinner.id === state.playerId;

    console.log(allPlayersPassed);
    console.log(playerWinner);
    console.log(imWinner);
    // if (allPlayersPassed && imWinner) {
    //   await dispatch("reportScore");
    // }
  },
  async reportScore({ dispatch, commit, state }) {
    console.log(state.userGame);
    commit("set", toKV("status", ROOM_STATUS.FINISHED));
    dispatch("updateRoom");
    await gamesRepository.updateGameStatus(state.userGame.game.id, 3);
    await gamesRepository.updateUserGame(state.userGame.id, {
      totalPoints:
        state.players.find(p => p?.id === state.playerId)?.score || 0,
      isHost: state.userGame.isHost,
      wasKickedOut: false,
    });
    await zkClient.removeRecursive(`/room-${state.roomId}`);
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
            if (state.turn.playerId !== state.playerId) {
              commit("resetTimer");
            } else if (state.timer.time > 0) {
              state.timer.time--;
            } else {
              await dispatch("pass");
              commit("resetTimer");
            }
          }, 1000),
        })
      );
    }
  },
  async startPlayersConnectivityPooling({ dispatch, commit, state }) {
    if (!state.kickOutInterval) {
      commit(
        "set",
        toKV(
          "kickOutInterval",
          setInterval(async () => {
            state.players.map(async p => {
              let playerId = p?.id;
              if (playerId && playerId !== state.playerId) {
                const isActive = await zkClient.exists(
                  `/room-${state.roomId}/${playerId}`
                );

                const timeLeft = state.kickOutTimers[String.toString(playerId)];
                if (isActive) {
                  state.kickOutTimers[
                    String.toString(playerId)
                  ] = KICK_OUT_TIMER_INITIAL;
                } else {
                  if (timeLeft > 0) {
                    state.kickOutTimers[String.toString(playerId)] -= 10;
                  } else if (
                    !state.players.map(p => p?.id === state.playerId)
                      .wasKickedOut
                  ) {
                    await dispatch("exitRoom", playerId);
                  }
                }
              }
            });
          }, 10000)
        )
      );
    }
  },
  async resetKickOutTimer({ dispatch, commit, state }) {
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
  // USER
  updateUserPlayer({ commit, state }, userPlayer) {
    commit(
      "set",
      toKV(
        "players",
        state.players.map(p => {
          if (p?.id === state.playerId) return userPlayer;
          else return p;
        })
      )
    );
  },
  // OTHERS
  reset({ commit }) {
    commit("reset");
  },
  // JUEGO
  fillHands({ dispatch, state }) {
    state.players.map(player => {
      while (player.hand.length < 7) player.hand.push(state.lettersDeck.pop());
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
