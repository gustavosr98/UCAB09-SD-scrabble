import GamesRepository from "@/connections/server/repositories/games.repository.js";
const gamesRepository = new GamesRepository();

const initialState = () => {
  return {
    game: "",
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
  async getMany({ commit }, { limit, page, search }) {
    try {
      const response = await gamesRepository.getGames(limit, page, search);
      commit("set", { key: "error", value: "" });
      commit("set", { key: "games", value: response });
    } catch (e) {
      commit("set", { key: "error", value: e.response });
    }
  },
  async create({ commit }, game) {
    try {
      const response = await gamesRepository.createGame(game);
      commit("set", { key: "game", value: response });
      commit("set", { key: "error", value: "" });
    } catch (e) {
      commit("set", { key: "error", value: e.response });
    }
  },
  async getOne({ commit }, id) {
    try {
      const response = await gamesRepository.getGame(id);
      console.log(response)
    } catch (e) {
      commit("set", { key: "error", value: e.response });
    }
  },
  setGame({ commit }, game) {
    commit("set", { key: "game", value: game });
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
