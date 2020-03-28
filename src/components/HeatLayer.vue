<template>
  <div></div>
</template>
<script>
import HeatmapOverlay from "leaflet-heatmap";

export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      mapObj: this.$parent.map
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.loadLayer();
    },
    loadLayer() {
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
      heatmapLayer.setData(this.data);
      heatmapLayer.addTo(this.mapObj);
    }
  }
};
</script>
<style lang="scss" scoped></style>
