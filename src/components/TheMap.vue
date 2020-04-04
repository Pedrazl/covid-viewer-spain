<template>
  <div class="map-container" id="map"></div>
</template>
<script>
import L from "leaflet";
import Papa from "papaparse";
import { SPANISH_REGIONS_GEOJSON } from "@/data/comunidades-autonomas-espanolas.js";
import { getCases } from "@/api/datadista.js";

export default {
  data() {
    return {
      map: {},
      geoJsonData: { type: "FeatureCollection", features: [] },
      covidCasesLayer: {},
      infoControl: {},
    };
  },
  computed: {
    today: function() {
      return new Date().toLocaleDateString();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.map = L.map("map").setView([40.505, -3.09], 6);
      this.addBaseMap();
      this.addInfoControl();
      this.loadCovidDataOnLayer();
    },
    addBaseMap() {
      var CartoDB_DarkMatter = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      );
      CartoDB_DarkMatter.addTo(this.map);
    },
    addInfoControl() {
      this.infoControl = L.control();

      this.infoControl.onAdd = function() {
        this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
        this.update();
        return this._div;
      };
      this.infoControl.update = function(props) {
        this._div.innerHTML =
          "<h4>COVID-19 en España</h4>" +
          (props
            ? "<b>" +
              props.comunidade_autonoma +
              "</b><br />" +
              props.cases.today +
              " contagios hoy" +
              "</b><br />" +
              props.cases.yesterday +
              " contagios ayer"
            : "Pase el ratón sobre una región");
      };

      this.infoControl.addTo(this.map);
    },
    loadGeojsonLayer(geojsonData) {
      this.covidCasesLayer = L.geoJson(geojsonData, {
        style: this.style,
        onEachFeature: this.onEachFeature,
      }).addTo(this.map);
    },
    async loadCovidDataOnLayer() {
      try {
        var rawData = await getCases();
        var parsedData = Papa.parse(rawData, { header: true });
        this.addCasesData(parsedData);
        this.loadGeojsonLayer(this.geoJsonData);
      } catch (err) {
        console.log(err);
      }
    },
    addCasesData(parsedData) {
      let self = this;
      for (let csvRow of parsedData.data) {
        const foundRegion = SPANISH_REGIONS_GEOJSON.features.find(
          (element) => element.properties.codigo === csvRow.cod_ine
        );
        if (foundRegion) {
          var yesterdayCases =
            csvRow[Object.keys(csvRow)[Object.keys(csvRow).length - 2]];
          var todayCases =
            csvRow[Object.keys(csvRow)[Object.keys(csvRow).length - 1]];

          foundRegion.properties.cases = {
            today: todayCases,
            yesterday: yesterdayCases,
          };
          self.geoJsonData.features.push(foundRegion);
        }
      }
    },
    onEachFeature(feature, layer) {
      layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight,
      });
    },
    highlightFeature(e) {
      var layer = e.target;

      layer.setStyle({
        weight: 2,
        color: "#333",
        dashArray: "",
        fillOpacity: 1,
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
      this.infoControl.update(layer.feature.properties);
    },
    resetHighlight(e) {
      this.covidCasesLayer.resetStyle(e.target);
      this.infoControl.update();
    },
    style(feature) {
      return {
        fillColor: this.getColor(feature.properties.cases.today),
        weight: 1,
        opacity: 1,
        color: "white",
        dashArray: "1",
        fillOpacity: 0.7,
      };
    },
    getColor(d) {
      return d > 20000
        ? "#990000"
        : d > 15000
        ? "#d7301f"
        : d > 10000
        ? "#ef6548"
        : d > 5000
        ? "#fc8d59"
        : d > 2500
        ? "#fdbb84"
        : d > 1000
        ? "#fdd49e"
        : d > 500
        ? "#fee8c8"
        : "#fff7ec";
    },
  },
};
</script>

<style >
.map-container {
  height: 100vh;
  width: 100%;
}

.info {
  padding: 6px 8px;
  font: 14px/16px Arial, Helvetica, sans-serif;
  background: white;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}

.info h4 {
  margin: 0 0 5px;
  color: #777;
}
</style>
