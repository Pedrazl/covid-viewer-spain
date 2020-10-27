<template>
  <div></div>
</template>
<script>
import L from "leaflet";
import { getDailyStats } from "@/util.js";
import { palettesMixin } from "@/mixins/palettes.js";
export default {
  props: {
    geojson: {
      type: Object,
      required: true
    },
    layerName: {
      type: String,
      required: true
    }
  },
  mixins: [palettesMixin],
  data() {
    return {
      geojsonLayer: {},
      mapObj: this.$parent.map,
      layerInfoControl: this.$parent.infoControl,
      legend: {}
    };
  },
  computed: {
    activePalette() {
      return this.layerName === "hospitalized"
        ? "green"
        : this.layerName === "deaths"
        ? "red"
        : "purple";
    },
    activeLegendTitle() {
      return this.layerName === "hospitalized"
        ? "hospitalizados"
        : this.layerName === "deaths"
        ? "muertes"
        : "casos";
    }
  },
  beforeMount() {
    this.setupInfoWindow();
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.loadGeojsonLayer();
      this.addLegend();
      this.layerInfoControl.update();
    },

    loadGeojsonLayer() {
      this.geojsonLayer = L.geoJson(this.geojson, {
        style: this.style,
        onEachFeature: this.onEachFeature
      }).addTo(this.mapObj);
    },
    onEachFeature(feature, layer) {
      layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight,
        click: this.clickFeature
      });
    },
    clickFeature(e) {
      var layer = e.target;
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
      this.layerInfoControl.update(layer.feature.properties);
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
      this.layerInfoControl.update(layer.feature.properties);
    },
    resetHighlight(e) {
      this.geojsonLayer.resetStyle(e.target);
      this.layerInfoControl.update();
    },
    style(feature) {     
      return {
        fillColor: this.getColorFromPalette(this.activePalette, feature.properties[this.layerName].today),
        weight: 1,
        opacity: 1,
        color: "grey",
        dashArray: "1",
        fillOpacity: 1
      };
    },
    setupInfoWindow() {
      this.layerInfoControl.update = function(props) {
        if (!props) {
          this._div.innerHTML = `<h4>COVID-19 en España</h4>Pase el ratón sobre una región`;
        } else {
          var casesDailyStats = getDailyStats(
            props.cases.today,
            props.cases.yesterday
          );         

          this._div.innerHTML = `<h4>COVID-19 en España</h4><b>${
            props.comunidade_autonoma
          }</b> (<label class="label-small">${
            props.cases.date
          }</label>)<div class="info__label blue"><label>${
            props.cases.today
          } casos (pcr) (${
            casesDailyStats.diff
          })</label></div>
          <div style="display:flex">
          <div class="info__sum blue"><label>${casesDailyStats.trend}%</label>

          <div> <i class="material-icons" style="font-size:28px">${
            casesDailyStats.trend > 0 ? "trending_up" : "trending_down"
          }</i></div></div></div>`;
        }
      };
    },
    addLegend() {
      this.legend = L.control({ position: "bottomright" });
      let self = this;

      this.legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
          grades = [0, 25, 50, 100, 500, 1000, 5000, 10000];

        div.innerHTML = `<h5 class='legend-title'>Δ ${self.activeLegendTitle} (ult.semana)</h5>`;
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
            '<i style="background:' +
            self.getColorFromPalette(self.activePalette, grades[i] + 1) +
            '"></i> ' +
            grades[i] +
            (grades[i + 1] ? " &ndash; " + grades[i + 1] + "<br>" : "+");
        }
        return div;
      };
      this.legend.addTo(this.mapObj);
    }
  },
  beforeDestroy() {
    this.mapObj.removeControl(this.legend);
  }
};
</script>
<style lang="scss">
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
.red {
  color: #cb181d;
}
.green {
  color: #41ab5d;
}

.blue {
  color: #518bc3;
}
.label-small {
  font-size: 0.8rem;
}
</style>
