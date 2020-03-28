<template>
  <div class="map-container" id="map"></div>
</template>
<script>
import L from "leaflet";
import HeatmapOverlay from "leaflet-heatmap";
export default {
  data() {
    return {
      map: {}
    };
  },
  mounted() {
    this.init();
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
      //this.loadHeatLayer();
      this.loadCovidLayers();
    },
    loadCovidLayers(){
      L.circle([39.5, -3.4], {radius: 100000}).addTo(this.map);
    },
    loadHeatLayer() {
      var testData = {
        max: 8,
        data: [
          { lat: 24.6408, lng: 46.7728, count: 3 },
          { lat: 50.75, lng: -1.55, count: 1 }
        ]
      };

      var cfg = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        // if scaleRadius is false it will be the constant radius used in pixels
        radius: 2,
        maxOpacity: 0.8,
        // scales the radius based on map zoom
        scaleRadius: true,
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries
        //   (there will always be a red spot with useLocalExtremas true)
        useLocalExtrema: true,
        // which field name in your data represents the latitude - default "lat"
        latField: "lat",
        // which field name in your data represents the longitude - default "lng"
        lngField: "lng",
        // which field name in your data represents the data value - default "value"
        valueField: "count"
      };

      var heatmapLayer = new HeatmapOverlay(cfg);
      heatmapLayer.setData(testData);
      heatmapLayer.addTo(this.map);
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
