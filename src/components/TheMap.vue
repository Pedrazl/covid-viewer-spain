<template>
  <div class="map-container" id="map"></div>
</template>
<script>
import L from "leaflet";
import { SPANISH_REGIONS_GEOJSON } from "@/data/comunidades-autonomas-espanolas.js";
import { getCasesByRegion, getDeathsByRegion, getRecoveredByRegion } from "@/api/datadista.js";
import { calculateTrend } from "@/util.js";

export default {
  data() {
    return {
      map: {},
      geoJsonData: { type: "FeatureCollection", features: [] },
      covidCasesLayer: {},
      infoControl: {}
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
      this.addInfoControl();
      this.loadCovidDataOnLayer();
    },
    addBaseMap() {
      var CartoDB_DarkMatter = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19
      });
      CartoDB_DarkMatter.addTo(this.map);
    },
    addInfoControl() {
      this.infoControl = L.control();

      this.infoControl.onAdd = function() {
        this._div = L.DomUtil.create("div", "info");
        this.update();
        return this._div;
      };
      this.infoControl.update = function(props) {
        if (!props) {
          this._div.innerHTML = `<h4>COVID-19 en España</h4>Pase el ratón sobre una región`;
        } else {
          var trendCases = calculateTrend(props.cases.today, props.cases.yesterday);
          var trendRecovered = calculateTrend(props.recovered.today, props.cases.recovered.yesterday);
          var trendDeaths = calculateTrend(props.deaths.today, props.cases.deaths.yesterday);

          this._div.innerHTML = `<h4>COVID-19 en España</h4><b>${
            props.comunidade_autonoma
          }</b><br/><div class="info__label blue"><label>${
            props.cases.today
          } total contagios</label></div><div class="info__label green"><label>${
            props.recovered.today
          } total altas </label></div><div class="info__label red"><label>${
            props.deaths.today
          } total fallecidos </label></div><div class="info__label blue"><label>${trendCases}%</label><div> <i class="material-icons" style="font-size:28px">${
            trendCases > 0 ? "trending_up" : "trending_down"
          }</i></div><div class="info__label blue"><label>${trendRecovered}%</label><div> <i class="material-icons" style="font-size:28px">${
            trendRecovered > 0 ? "trending_up" : "trending_down"
          }</i></div>
          <div class="info__label blue"><label>${trendDeaths}%</label><div> <i class="material-icons" style="font-size:28px">${
            trendDeaths > 0 ? "trending_up" : "trending_down"
          }</i></div></div>`;
        }
      };

      this.infoControl.addTo(this.map);
    },
    loadGeojsonLayer(geojsonData) {
      this.covidCasesLayer = L.geoJson(geojsonData, {
        style: this.style,
        onEachFeature: this.onEachFeature
      }).addTo(this.map);
    },
    async loadCovidDataOnLayer() {
      try {
        var casesData = await getCasesByRegion();
        var deathsData = await getDeathsByRegion();
        var recoveredData = await getRecoveredByRegion();

        this.addData(casesData, recoveredData, deathsData);
        this.loadGeojsonLayer(this.geoJsonData);
      } catch (err) {
        console.log(err);
      }
    },
    addData(casesData, recoveredData, deathsData) {
      let self = this;
      for (let region of SPANISH_REGIONS_GEOJSON.features) {
        var regionCasesRow = casesData.data.find(row => row.cod_ine === region.properties.codigo);
        var regionDeathsRow = deathsData.data.find(row => row.cod_ine === region.properties.codigo);
        var regionRecoveredRow = recoveredData.data.find(row => row.cod_ine === region.properties.codigo);

        region.properties.cases = {
          today: regionCasesRow[Object.keys(regionCasesRow)[Object.keys(regionCasesRow).length - 1]],
          yesterday: regionCasesRow[Object.keys(regionCasesRow)[Object.keys(regionCasesRow).length - 2]]
        };
        region.properties.recovered = {
          today: regionRecoveredRow[Object.keys(regionRecoveredRow)[Object.keys(regionRecoveredRow).length - 1]],
          yesterday: regionRecoveredRow[Object.keys(regionRecoveredRow)[Object.keys(regionRecoveredRow).length - 2]]
        };
        region.properties.deaths = {
          today: regionDeathsRow[Object.keys(regionDeathsRow)[Object.keys(regionDeathsRow).length - 1]],
          yesterday: regionDeathsRow[Object.keys(regionDeathsRow)[Object.keys(regionDeathsRow).length - 2]]
        };
        self.geoJsonData.features.push(region);
      }
    },
    onEachFeature(feature, layer) {
      layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight
      });
    },
    highlightFeature(e) {
      var layer = e.target;

      layer.setStyle({
        weight: 2,
        color: "#333",
        dashArray: "",
        fillOpacity: 1
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
        fillOpacity: 0.7
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
    }
  }
};
</script>

<style lang="scss">
.map-container {
  height: 100vh;
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
    padding: 0.3rem;
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
</style>
