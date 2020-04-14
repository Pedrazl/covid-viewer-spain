<template>
  <div class="map-container" id="map"></div>
</template>
<script>
import L from "leaflet";
import { SPANISH_REGIONS_GEOJSON } from "@/data/comunidades-autonomas-espanolas.js";
import {
  getCasesByRegion,
  getDeathsByRegion,
  getRecoveredByRegion
} from "@/api/datadista.js";
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
        this.update();
        return this._div;
      };
      this.infoControl.update = function(props) {
        if (!props) {
          this._div.innerHTML = `<h4>COVID-19 en España</h4>Pase el ratón sobre una región`;
        } else {
          var trendCases = calculateTrend(
            props.cases.today,
            props.cases.yesterday
          );
          var trendRecovered = calculateTrend(
            props.recovered.today,
            props.recovered.yesterday
          );
          var trendDeaths = calculateTrend(
            props.deaths.today,
            props.deaths.yesterday
          );

          this._div.innerHTML = `<h4>COVID-19 en España</h4><b>${
            props.comunidade_autonoma
          }</b> (ult.24h)<div class="info__label blue"><label>${
            props.cases.today
          } total casos</label></div><div class="info__label green"><label>${
            props.recovered.today
          } total altas </label></div><div class="info__label red"><label>${
            props.deaths.today
          } total fallecidos </label></div>
          <div style="display:flex">
          <div class="info__sum blue"><label>${trendCases}%</label>

          <div> <i class="material-icons" style="font-size:28px">${
            trendCases > 0 ? "trending_up" : "trending_down"
          }</i></div></div>
            
          <div class="info__sum green"><label>${trendRecovered}%</label><div> <i class="material-icons" style="font-size:28px">${
            trendRecovered > 0 ? "trending_up" : "trending_down"
          }</i></div></div>

          <div class="info__sum red"><label>${trendDeaths}%</label><div><i class="material-icons" style="font-size:28px">${
            trendDeaths > 0 ? "trending_up" : "trending_down"
          }</i></div></div></div>`;
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
    },
    addLegend() {
      let self = this;
      var legend = L.control({ position: "bottomright" });

      legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
          grades = [0, 1, 1.5, 2.5, 3.5, 4.5, 5.5, 10];

        // loop through our density intervals and generate a label with a colored square for each interval
        div.innerHTML = "<h5 class='legend-title'>% Casos (24h)</h5>";
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
            '<i style="background:' +
            self.getColor(grades[i] + 1) +
            '"></i> ' +
            grades[i] +
            (grades[i + 1] ? " &ndash; " + grades[i + 1] + "<br>" : "+");
        }

        return div;
      };

      legend.addTo(this.map);
    },
    onEachFeature(feature, layer) {
      layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight,
        click: this.clickFeature
      });
    },
    clickFeature(e) {
      this.resetHighlight(e);
      this.highlightFeature(e);
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
      let trend = calculateTrend(
        feature.properties.cases.today,
        feature.properties.cases.yesterday
      );
      return {
        fillColor: this.getColor(trend),
        weight: 1,
        opacity: 1,
        color: "white",
        dashArray: "1",
        fillOpacity: 0.7
      };
    },
    getColor(d) {
      return d > 10
        ? "#990000"
        : d > 5.5
        ? "#d7301f"
        : d > 4.5
        ? "#ef6548"
        : d > 3.5
        ? "#fc8d59"
        : d > 2.5
        ? "#fdbb84"
        : d > 1.5
        ? "#fdd49e"
        : d > 1
        ? "#fee8c8"
        : "#fff7ec";
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
