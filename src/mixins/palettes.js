export const palettesMixin = {
  methods: {
    getColorFromPalette(palette, value) {
      switch (palette) {
        case "green":
          return this.getGreen(value);
        case "purple":
          return this.getPurple(value);
        default:
          return this.getRed(value);
      }
    },
    getPurple(d) {
      return d > 10000
        ? "#4d004b"
        : d > 5000
        ? "#810f7c"
        : d > 1000
        ? "#88419d"
        : d > 500
        ? "#8c6bb1"
        : d > 100
        ? "#8c96c6"
        : d > 50
        ? "#9ebcda"
        : d > 25
        ? "#bfd3e6"
        : "#e0ecf4";
    },

    getRed(d) {
      return d > 8
        ? "#67000d"
        : d > 4
        ? "#a50f15"
        : d > 2
        ? "#cb181d"
        : d > 1
        ? "#ef3b2c"
        : d > 0.8
        ? "#fb6a4a"
        : d > 0.4
        ? "#fc9272"
        : d > 0.2
        ? "#fcbba1"
        : "#fee0d2";
    },

    getGreen(d) {
      return d > 8
        ? "#005a32"
        : d > 4
        ? "#238b45"
        : d > 2
        ? "#41ab5d"
        : d > 1
        ? "#74c476"
        : d > 0.8
        ? "#a1d99b"
        : d > 0.4
        ? "#c7e9c0"
        : d > 0.2
        ? "#c8e8be"
        : "#e5f5e0";
    }
  }
};
