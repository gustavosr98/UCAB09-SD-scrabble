const initialState = () => {
  return {
    backgroundDark: false,
  };
};

// State object
const state = initialState();

// Mutations
const mutations = {
  setBackgroundDark(state, payload) {
    state.backgroundDark = payload.value;
  },
  reset(state) {
    const newState = initialState();
    Object.keys(newState).forEach(key => {
      state[key] = newState[key];
    });
  },
};

//Actions
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
};
