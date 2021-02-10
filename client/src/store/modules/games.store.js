import GamesRepository from "@/connections/server/repositories/games.repository.js";
const gamesRepository = new GamesRepository();

const initialState = () => {
  return {
    games: [],
    error: "",
  };
};

const state = initialState();

const getters = {
  get: (state) => (key) => {
    return state[key];
  },
};

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
};

const actions = {
  async getMany({ commit }, { limit, page }) {
    try {
      const response = await gamesRepository.getGames(limit, page);
      commit("set", { key: "error", value: "" });
      commit("set", { key: "games", value: response });
    } catch (e) {
      commit("set", { key: "error", value: e.response });
    }
  },
  async create({ commit }, game) {
    try {
      await gamesRepository.createGame(game);
      commit("set", { key: "error", value: "" });
    } catch (e) {
      commit("set", { key: "error", value: e.response });
    }
  },
  reset({ commit }) {
    commit("reset");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
