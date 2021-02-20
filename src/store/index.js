import Vue from "vue";
import Vuex from "vuex";

import lexical from "./modules/lexical";
import syntax from "./modules/syntax";
import analysis from "./modules/analysis";
import lexicalAnalyzer from "./modules/lexicalAnalyzer";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    lexical,
    syntax,
    analysis,
    lexicalAnalyzer,
  },
});
