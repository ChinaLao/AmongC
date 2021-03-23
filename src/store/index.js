import Vue from "vue";
import Vuex from "vuex";

import lexicalAnalyzer from "./modules/lexicalAnalyzer";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    lexicalAnalyzer,
  },
});
