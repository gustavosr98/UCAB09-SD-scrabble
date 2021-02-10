import httpClient from "@/connections/server/http-client";
import jwt from "@/connections/server/jwt.service";
import UsersRepository from "@/connections/server/repositories/users.respository";
const usersRepository = new UsersRepository();

const initialState = () => {
  return {
    user: "",
    users: [],
    ranking: [],
    countRanking: 0,
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
  updateToken({ commit }) {
    try {
      httpClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${jwt.getToken()}`;
    } catch (e) {
      commit("set", { key: "error", value: e.response });
    }
  },
  async authorize({ commit }, user) {
    try {
      const response = await usersRepository.authorize(user);
      jwt.saveToken(response.access_token);
      commit("set", { key: "error", value: "" });
      commit("set", { key: "user", value: response.user });
    } catch (e) {
      commit("set", { key: "error", value: e.response });
    }
  },
  async register({ commit }, user) {
    try {
      const response = await usersRepository.register(user);
      jwt.saveToken(response.access_token);
      commit("set", { key: "error", value: "" });
    } catch (e) {
      commit("set", { key: "error", value: e.response });
    }
  },
  async getRanking({ commit }, { limit, page, username }) {
    try {
      const response = await usersRepository.getRanking(limit, page, username);
      commit("set", { key: "error", value: "" });
      commit("set", { key: "ranking", value: response.ranking });
      commit("set", { key: "countRanking", value: response.count });
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
