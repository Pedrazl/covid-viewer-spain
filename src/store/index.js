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
    },
    activeLayer: "cases"
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
    },
    [types.SET_ACTIVE_LAYER](state, layerName) {
      state.activeLayer = layerName;
    }
  },
  actions: {
    setNationalData(context, data) {
      context.commit(types.SET_NATIONAL_DATA, data);
    },
    setRegionalData(context, data) {
      context.commit(types.SET_REGIONAL_DATA, data);
    },
    setActiveLayer(context, layerName) {
      context.commit(types.SET_ACTIVE_LAYER, layerName);
    }
  },
  modules: {}
});
