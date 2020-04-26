<template>
  <div></div>
</template>
<script>
import L from "leaflet";
import { calculateTrend } from "@/util.js";
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
      return this.layerName === "recovered"
        ? "green"
        : this.layerName === "deaths"
        ? "red"
        : "purple";
    },    
    activeLegendTitle() {
      return this.layerName === "recovered"
        ? "altas"
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
      let trend = calculateTrend(
        feature.properties[this.layerName].today,
        feature.properties[this.layerName].yesterday
      );
      return {
        fillColor: this.getColorFromPalette(this.activePalette, trend),
        weight: 1,
        opacity: 1,
        color: "white",
        dashArray: "1",
        fillOpacity: 0.7
      };
    },
    setupInfoWindow() {
      this.layerInfoControl.update = function(props) {
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
    },
    addLegend() {
      this.legend = L.control({ position: "bottomright" });
      let self = this;

      this.legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
          grades = [0, 1, 1.5, 2.5, 3.5, 4.5, 5.5, 10];

        div.innerHTML = `<h5 class='legend-title'>% ${self.activeLegendTitle} (24h)</h5>`;
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
  color:#518bc3;
}
</style>