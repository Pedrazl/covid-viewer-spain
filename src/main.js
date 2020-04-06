import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import store from "./store";
import Buefy from "buefy";
import "buefy/dist/buefy.css";

Vue.config.productionTip = false;

Vue.use(Buefy);

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
