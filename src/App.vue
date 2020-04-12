<template>
  <div id="app" class="wrapper">
    <the-header></the-header>
    <the-map />
  </div>
</template>

<script>
import TheHeader from "./components/TheHeader.vue";
import TheMap from "./components/TheMap.vue";

export default {
  name: "App",
  components: {
    TheMap,
    TheHeader
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
