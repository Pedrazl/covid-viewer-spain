<template>
  <div id="app" class="wrapper">
    <header>
      <the-header></the-header>
    </header>
    <main>
      <the-map v-if="dataReady" />
      <app-data-loader
      @statusLoading="setLoading"
      @data-load-ready="onDataLoad"
      @data-load-error="onDataLoadError"
    />
    </main>        
    <b-loading
      :is-full-page="isFullPage"
      :active.sync="isLoading"
      :can-cancel="true"
    ></b-loading>
  </div>
</template>

<script>
import TheHeader from "./components/TheHeader.vue";
import TheMap from "./components/TheMap.vue";
import { loadingSpinnerMixin } from "@/mixins/loadingSpinner.js";
import AppDataLoader from "@/components/renderless/AppDataLoader"

export default {
  name: "App",
  components: {
    TheMap,
    TheHeader,
    AppDataLoader
  },
  data() {
    return {
      dataReady: false
    };
  },
  mixins: [loadingSpinnerMixin],
  methods: {
    onDataLoad() {
      this.dataReady = true;
    },
    onDataLoadError() {
      let error =
        "No ha sido posible cargar la fuente de datos. Inténtelo de nuevo.";
      this.$buefy.toast.open({
        message: error,
        type: "is-danger"
      });
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Montserrat";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.wrapper {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 140px 1fr;
}

@media only screen and (min-width: $breakpoint-tabletToDesktop) {
  .wrapper {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 170px 1fr;
  }
}
</style>
