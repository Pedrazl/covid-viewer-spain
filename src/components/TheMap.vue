<template>
  <div class="map-container" id="map"></div>
</template>
<script>
import L from "leaflet";
import Papa from "papaparse";
import { CCAA_DATA } from "@/config/ccaa.js";
import { getCases } from "@/api/datadista.js";

export default {
  data() {
    return {
      map: {},
      cases: [],
      ccaaMarkers: []
    };
  },
  computed: {
    today: function() {
      return new Date().toLocaleDateString();
    }
  },
  mounted() {
    this.init();
    this.loadCovidLayers();
  },
  methods: {
    init() {
      this.map = L.map("map").setView([40.505, -3.09], 6);
      this.addBaseMap();
      this.loadCovidLayers();
    },
    addBaseMap(){
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
    },
    async loadCovidLayers() {
      /* Cases layer */
      var rawData = await getCases();
      this.extractData(rawData);

      this.ccaaMarkers.forEach(ccaa => {
        L.circle([ccaa.coords.lon, ccaa.coords.lat], {
          radius: ccaa.cases.today * 5
        }).addTo(this.map);
      });      

      /* Deaths Layer */ 

    },
    extractData(rawData) {
      var parsedData = Papa.parse(rawData, { header: true });
      for (let csvRow of parsedData.data) {
        this.ccaaMarkers.push(this.createMarker(csvRow));
      }
    },
    createMarker(csvRow) {
      const ccaa = CCAA_DATA.find(
        element => element.cod_ine === csvRow.cod_ine
      );
      if (ccaa) {
        var yesterdayCases =
          csvRow[Object.keys(csvRow)[Object.keys(csvRow).length - 2]];
        var todayCases =
          csvRow[Object.keys(csvRow)[Object.keys(csvRow).length - 1]];
        return {
          ...ccaa,
          cases: {
            today: parseInt(todayCases),
            yesterday: parseInt(yesterdayCases)
          }
        };
      }
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
