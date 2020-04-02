<template>
  <div class="map-container" id="map"></div>
</template>
<script>
import L from "leaflet";
import Papa from "papaparse";
import { SPANISH_REGIONS_GEOJSON } from "@/data/comunidades-autonomas-espanolas.js";
import { CCAA_DATA } from "@/config/ccaa.js";
import { getCases } from "@/api/datadista.js";

export default {
  data() {
    return {
      map: {},
      geoJsonLayer: { type: "FeatureCollection", features: [] },
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
  },
  methods: {
    init() {
      this.map = L.map("map").setView([40.505, -3.09], 6);
      this.addBaseMap();
      this.loadCovidDataOnLayer();
    },
    addBaseMap() {
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
    loadGeojsonLayer(geojsonData) {
      L.geoJson(geojsonData, { style: this.style }).addTo(this.map);
    },
    async loadCovidDataOnLayer() {
      try {
        var rawData = await getCases();
        var parsedData = Papa.parse(rawData, { header: true });
        this.addCasesData(parsedData);
        this.loadGeojsonLayer(this.geoJsonLayer);
      } catch (err) {
        console.log(err);
      }
    },
    addCasesData(parsedData) {
      let self = this;
      for (let csvRow of parsedData.data) {
        const foundRegion = SPANISH_REGIONS_GEOJSON.features.find(
          element => element.properties.codigo === csvRow.cod_ine
        );
        if (foundRegion) {
          var yesterdayCases =
            csvRow[Object.keys(csvRow)[Object.keys(csvRow).length - 2]];
          var todayCases =
            csvRow[Object.keys(csvRow)[Object.keys(csvRow).length - 1]];

          foundRegion.properties.cases = {
            today: todayCases,
            yesterday: yesterdayCases
          };
          self.geoJsonLayer.features.push(foundRegion);
        }
      }
    },
    style(feature) {
      return {
        fillColor: this.getColor(feature.properties.cases.today),
        weight: 2,
        opacity: 1,
        color: "grey",
        dashArray: "3",
        fillOpacity: 0.7
      };
    },
    getColor(d) {
      return d > 20000
        ? "#800026"
        : d > 15000
        ? "#BD0026"
        : d > 10000
        ? "#E31A1C"
        : d > 5000
        ? "#FC4E2A"
        : d > 2500
        ? "#FD8D3C"
        : d > 1000
        ? "#FEB24C"
        : d > 500
        ? "#FED976"
        : "#FFEDA0";
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
