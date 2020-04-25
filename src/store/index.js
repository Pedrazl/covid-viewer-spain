import Vue from "vue";
import Vuex from "vuex";
import * as types from "./types";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    regionalData: {
      cases: [],
      deaths: [],
      recovered: []
    },
    nationalData: {
      today: {},
      yesterday: {}
    }
  },
  mutations: {
    [types.SET_NATIONAL_DATA](state, data) {
      state.nationalData.today = data.today;
      state.nationalData.yesterday = data.yesterday;
    },
    [types.SET_REGIONAL_DATA](state, data) {
      state.regionalData.cases = data.cases;
      state.regionalData.recovered = data.recovered;
      state.regionalData.deaths = data.deaths;
    }
  },
  actions: {
    setNationalData(context, data) {
      context.commit(types.SET_NATIONAL_DATA, data);
    },
    setRegionalData(context, data) {
      context.commit(types.SET_REGIONAL_DATA, data);
    }
  },
  modules: {}
});
