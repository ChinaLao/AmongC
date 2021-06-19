import Vue from "vue";
import Vuex from "vuex";

import lexical from "./modules/lexical";
import main from "./modules/main"
import syntax from "./modules/syntax"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    lexical,
    main,
    syntax,
  },
});
