<template>
  <div class="map-container" id="map"></div>
</template>
<script>
import L from "leaflet";
import axios from "axios";
import { CCAA_DATA } from "@/config/ccaa.js";
export default {
  
  data() {
    return { map: {} };
  },
  mounted() {
    this.init();
    this.loadCovidLayers();
  },
  methods: {
    init() {
      this.map = L.map("map").setView([40.505, -3.09], 6);
      var CartoDB_DarkMatter = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19
        }
      );
      CartoDB_DarkMatter.addTo(this.map);
      this.loadCovidLayers();
    },
    loadCovidLayers() {
      this.getLatestData();
      CCAA_DATA.forEach(ccaa => {
        L.circle([ccaa.coords.lon, ccaa.coords.lat], { radius: 100000 }).addTo(
          this.map
        );
      });
    },
    getLatestData() {
      const _basicHeaders = {
        "Content-Type": "text/csv",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS"
      };
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      const url = "https://covid19.isciii.es/resources/ccaa.csv";

      axios
        .get(proxyurl + url, {
          headers: _basicHeaders
        })
        .then(response => {
          console.log(response);
        });
    }
  }
};
</script>

<style scoped>
.map-container {
  height: 100vh;
  width: 100%;
}
</style>
