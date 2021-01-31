// Initial State object
const initialState = () => {
  return {
    lastError: null,
  };
};

// State object
const state = initialState();

// Getter functions
const getters = {
  getError(state) {
    return state.lastError;
  },
};

// Mutations
const mutations = {
  setNewError(state, newError) {
    state.lastError = newError;
  },
  clearLastError(state) {
    state.lastError = null;
  },
  reset(state) {
    const newState = initialState();
    Object.keys(newState).forEach(key => {
      state[key] = newState[key];
    });
  },
};

// Actions
const actions = {
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
