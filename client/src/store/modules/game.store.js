import zkClient from "@/connections/zookeeper/zk-client";
import { ROOM_STATUS, MOVE_TYPE } from "@/config/constants";
import { EVENT } from "@/connections/zookeeper/constants";

// Initial State object
const initialState = () => {
  return {
    // base
    roomId: null,
    playerId: null,
    // player
    players: [],
    // room-{id}
    status: null,
    lettersDeck: [],
    movesHistory: [],
    board: [],
    actualRound: null,
    turn: {
      timeLeftToPlay: null,
      player: null,
    },
    error: {
      minor: null,
      major: null,
    },
  };
};

const toKV = (key, value) => ({ key, value });

// State object
const state = initialState();

// Getter functions
const getters = {
  get: state => key => {
    return state[key];
  },
};

// Mutations
const mutations = {
  set(state, { key, value }) {
    state[key] = value;
  },
  reset(state) {
    const newState = initialState();
    Object.keys(newState).forEach(key => {
      state[key] = newState[key];
    });
  },
  setRoom(state, room) {
    Object.keys(room).forEach(key => {
      state[key] = room[key];
    });
  },
  setError(state, errorMessage, level = "major") {
    state.error[level] = errorMessage;
  },
};

// Actions
const actions = {
  async connect({ commit }) {
    try {
      await zkClient.connect();
    } catch {
      commit(
        "setError",
        "Hubo un error al entrar a la sala. Probablemente tengas problemas de conexión. Intenta entrar de nuevo."
      );
    }
  },
  async createRoom({ dispatch, commit, state }, { roomId, playerId }) {},
  async enterRoom({ dispatch, commit, state }, { roomId, playerId }) {
    commit("set", toKV("roomId", roomId));
    commit("set", toKV("playerId", playerId));
    dispatch("loadRoom");
  },
  async loadRoom({ dispatch, commit, state }) {
    if (!(await zkClient.exists(`/room-${state.roomId}`)))
      commit("setError", "La sala no existe o ya ha sido cerrada");
    const room = await zkClient.getData(`/room-${state.roomId}`, () => {});
    commit("setRoom", room);
  },
  async exitRoom({ dispatch, commit, state }) {
    await zkClient.close();
  },

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
