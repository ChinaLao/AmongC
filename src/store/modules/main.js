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
      console.log(error)
      state.error.push(error);
      console.log("%cErrors: ", "color: cyan; font-size: 15px", state.error);
      console.log(state.error[0])
    },
    CLEAR_ERRORS(state){
      state.error = [];
    },
  },
  actions: {
    async ADD_ERRORS({ state, commit }, error){
      console.log(error)
      commit("SET_ERROR", error);
      console.log("%cErrors: ", "color: cyan; font-size: 15px", state.error);
      console.log(error)
    },
    async CLEAR_OUTPUTS({ dispatch, commit }){
      await dispatch("lexical/CLEAR", null, { root: true });
      commit("CLEAR_ERRORS");
    }
  },
};