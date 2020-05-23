<template>
  <div class="map-container" id="map">
    <geojson-layer
      v-if="layerDataReady"
      :key="activeLayer"
      :geojson="geoJsonData"
      :layerName="activeLayer"
    ></geojson-layer>
  </div>
</template>
<script>
import L from "leaflet";
import { SPANISH_REGIONS_GEOJSON } from "@/data/comunidades-autonomas-espanolas.js";
import GeojsonLayer from "@/components/GeojsonLayer";
import {format} from "date-fns";
import { mapState } from "vuex";

export default {
  components: {
    GeojsonLayer
  },
  data() {
    return {
      map: {},
      geoJsonData: { type: "FeatureCollection", features: [] },
      infoControl: {}
    };
  },
  computed: {
    ...mapState({
      activeLayer: state => state.activeLayer,
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
      this.addFeatures(
        this.regionalData.cases,
        this.regionalData.hospitalized,
        this.regionalData.deaths
      );
    },
    addBaseMap() {
      var CartoDB_DarkMatter = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>| Data from <a href="https://datadista.com/">Datadista</a>',
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
    addFeatures(casesData, hospitalizedData, deathsData) {
      let self = this;
      for (let region of SPANISH_REGIONS_GEOJSON.features) {
        var regionCasesRow = casesData.data.find(
          row => row.cod_ine === region.properties.codigo
        );
        var regionDeathsRow = deathsData.data.find(
          row => row.cod_ine === region.properties.codigo
        );
        var regionHospitalizedRow = hospitalizedData.data.find(
          row => row.cod_ine === region.properties.codigo
        );

        var dates = Object.keys(regionCasesRow);
        region.properties.cases = {
          date: format(new Date(dates[Object.keys(regionCasesRow).length-1]),"d/M/Y"),
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
        region.properties.hospitalized = {
          today:
            regionHospitalizedRow[
              Object.keys(regionHospitalizedRow)[
                Object.keys(regionHospitalizedRow).length - 1
              ]
            ],
          yesterday:
            regionHospitalizedRow[
              Object.keys(regionHospitalizedRow)[
                Object.keys(regionHospitalizedRow).length - 2
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

@media only screen and (min-width: $breakpoint-tabletToDesktop) {
  .map-container {
    height: calc(100vh - 170px);
    width: 100%;
  }
}
</style>
