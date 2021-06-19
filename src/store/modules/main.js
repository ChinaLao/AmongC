export default {
  namespaced: true,
  state: {
    error: [], //for list of errors
  },
  getters: {
    ERROR: (state) => state.error,
  },
  mutations: {
    SET_ERROR(state, error) {
      state.error.push(error);
    },
    CLEAR_ERRORS(state){
      state.error = [];
    },
  },
  actions: {
    async CLEAR_OUTPUTS({ dispatch, commit }){
      await dispatch("lexical/CLEAR", null, { root: true });
      commit("CLEAR_ERRORS");
    }
  },
};