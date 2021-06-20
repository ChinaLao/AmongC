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
    CLEAR(state){
      state.error = [];
    },
  },
};