import httpClient from "@/connections/server/http-client";
import jwt from "@/connections/server/jwt.service";
import UsersRepository from "@/connections/server/repositories/users.respository";
const usersRepository = new UsersRepository();

const initialState = () => {
  return {
    user: "",
    users: [],
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
      console.log('response', response);
      jwt.saveToken(response.access_token);
      commit("set", { key: "error", value: "" });
      commit("set", { key: "user", value: response.user });
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
