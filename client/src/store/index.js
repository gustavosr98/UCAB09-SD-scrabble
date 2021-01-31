import Vue from "vue";
import Vuex from "vuex";

import modules from "./modules";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";

const ls = new SecureLS({
  isCompression: false,
  encryptionSecret: process.env.VUE_APP_ENCRYPTION_SECRET,
});

Vue.use(Vuex);

export default new Vuex.Store({
  modules, // All modules are automatically imported
  state: {},
  mutations: {},
  actions: {
    reset({ commit }) {
      // Resets state of all modules
      Object.keys(modules).forEach(moduleName => {
        commit(`${moduleName}/reset`);
      });
    },
  },
  getters: {},
  // Persistent data about user encrypted
  plugins: [
    createPersistedState({
      paths: ["users.user"],
      storage: {
        getItem: key => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: key => ls.remove(key),
      },
    }),
  ],
});
