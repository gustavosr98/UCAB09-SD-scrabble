import httpClient from "@/connections/server/http-client";
import jwt from "@/connections/server/jwt.service";
import UsersRepository from "@/connections/server/repositories/users.repository";
const usersRepository = new UsersRepository();

const initialState = () => {
  return {
    user: "",
    users: [],
    ranking: [],
    countRanking: 0,
    error: "",
    gameStatistics: {},
  };
};

const state = initialState();

const getters = {
  get: state => key => {
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
  async getUserGameStatistics({ commit }, userId) {
    try {
      const response = await usersRepository.getUserGameStatistics(userId);
      commit("set", { key: "error", value: "" });
      commit("set", { key: "gameStatistics", value: response });
    } catch (e) {
      commit("set", { key: "error", value: e.response });
    }
  },
  async getUserGame({ commit }, { idUser, idGame }) {
    try {
      const response = await usersRepository.getUserGame(idUser, idGame);
      commit("set", { key: "error", value: "" });
      return response;
    } catch (e) {
      commit("set", { key: "error", value: e.response });
    }
  },
  async updateProfile({ commit }, user) {
    try {
      const response = await usersRepository.updateUserProfile(user);
      commit("set", { key: "error", value: "" });
      commit("set", { key: "user", value: response });
    } catch (e) {
      commit("set", { key: "error", value: e.response });
    }
  },
  async deleteAccount({ commit }, userId) {
    try {
      await usersRepository.deleteAccount(userId);
      commit("set", { key: "error", value: "" });
    } catch (e) {
      commit("set", { key: "error", value: e.response });
    }
  },
  async getGamesByUser({ commit }, { id }) {
    try {
      const response = await usersRepository.getGamesByUser(id);
      commit("set", { key: "error", value: "" });
      return response;
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
