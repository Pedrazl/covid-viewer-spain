<template>
  <div class="map-container" id="map">
    <geojson-layer v-if="layerDataReady" :geojson="geoJsonData"></geojson-layer>
  </div>
</template>
<script>
import L from "leaflet";
import { SPANISH_REGIONS_GEOJSON } from "@/data/comunidades-autonomas-espanolas.js";
import GeojsonLayer from "@/components/GeojsonLayer";
import { getColor } from "@/util.js";
import { mapState } from 'vuex';

export default {
  components: {
    GeojsonLayer
  },
  data() {
    return {
      map: {},
      geoJsonData: { type: "FeatureCollection", features: [] },
      covidCasesLayer: {},
      infoControl: {}
    };
  },
  computed: {
    ...mapState({
      regionalData: state => state.regionalData      
    }),
    today: function() {
      return new Date().toLocaleDateString();
    },
    layerDataReady: function() {
      return this.geoJsonData.features.length > 0;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.map = L.map("map").setView([37.505, -3.09], 5);
      this.addBaseMap();
      this.addInfoControl();
      this.addFeatures(this.regionalData.cases, this.regionalData.recovered, this.regionalData.deaths);
      this.addLegend();
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
    addInfoControl() {
      this.infoControl = L.control();

      this.infoControl.onAdd = function() {
        this._div = L.DomUtil.create("div", "info");
        return this._div;
      };
      this.infoControl.addTo(this.map);
    },
    addLegend() {
      var legend = L.control({ position: "bottomright" });

      legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
          grades = [0, 1, 1.5, 2.5, 3.5, 4.5, 5.5, 10];

        div.innerHTML = "<h5 class='legend-title'>% Casos (24h)</h5>";
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
            '<i style="background:' +
            getColor(grades[i] + 1) +
            '"></i> ' +
            grades[i] +
            (grades[i + 1] ? " &ndash; " + grades[i + 1] + "<br>" : "+");
        }
        return div;
      };
      legend.addTo(this.map);
    },    
    addFeatures(casesData, recoveredData, deathsData) {
      let self = this;
      for (let region of SPANISH_REGIONS_GEOJSON.features) {
        var regionCasesRow = casesData.data.find(
          row => row.cod_ine === region.properties.codigo
        );
        var regionDeathsRow = deathsData.data.find(
          row => row.cod_ine === region.properties.codigo
        );
        var regionRecoveredRow = recoveredData.data.find(
          row => row.cod_ine === region.properties.codigo
        );

        region.properties.cases = {
          today:
            regionCasesRow[
              Object.keys(regionCasesRow)[
                Object.keys(regionCasesRow).length - 1
              ]
            ],
          yesterday:
            regionCasesRow[
              Object.keys(regionCasesRow)[
                Object.keys(regionCasesRow).length - 2
              ]
            ]
        };
        region.properties.recovered = {
          today:
            regionRecoveredRow[
              Object.keys(regionRecoveredRow)[
                Object.keys(regionRecoveredRow).length - 1
              ]
            ],
          yesterday:
            regionRecoveredRow[
              Object.keys(regionRecoveredRow)[
                Object.keys(regionRecoveredRow).length - 2
              ]
            ]
        };
        region.properties.deaths = {
          today:
            regionDeathsRow[
              Object.keys(regionDeathsRow)[
                Object.keys(regionDeathsRow).length - 1
              ]
            ],
          yesterday:
            regionDeathsRow[
              Object.keys(regionDeathsRow)[
                Object.keys(regionDeathsRow).length - 2
              ]
            ]
        };
        self.geoJsonData.features.push(region);
      }
    }
  }
};
</script>

<style lang="scss">
.map-container {
  height: calc(100vh - 140px);
  width: 100%;
}

.info {
  padding: 6px 8px;
  font: 1.1rem Arial, Helvetica, sans-serif;
  background: white;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  &__label {
    margin-top: 0.4rem;
    padding: 0.3rem;
    font-size: 1rem;
  }
  &__sum {
    margin-top: 0.4rem;
    padding: 0.3rem;
    margin-right: 0.5rem;
    font-size: 1rem;
  }
}

.info h4 {
  margin: 0 0 5px;
  color: #777;
}

.red {
  color: rgb(190, 7, 7);
}
.green {
  color: rgb(10, 121, 10);
}

.blue {
  color: rgb(15, 80, 202);
}

.legend {
  // line-height: 18px;
  color: #555;
  &__label {
    font-size: 1rem;
  }
}
.legend i {
  width: 18px;
  height: 18px;
  float: left;
  margin-right: 8px;
  opacity: 0.7;
}

.legend-title {
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
}

@media only screen and (min-width: $breakpoint-tabletToDesktop) {
  .map-container {
    height: calc(100vh - 170px);
    width: 100%;
  }
}
</style>
