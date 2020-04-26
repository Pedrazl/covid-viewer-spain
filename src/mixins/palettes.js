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
      return d > 10
        ? "#4d004b"
        : d > 5.5
        ? "#810f7c"
        : d > 4.5
        ? "#88419d"
        : d > 3.5
        ? "#8c6bb1"
        : d > 2.5
        ? "#8c96c6"
        : d > 1.5
        ? "#9ebcda"
        : d > 1
        ? "#bfd3e6"
        : "#e0ecf4";
    },

    getRed(d) {
      return d > 10
        ? "#67000d"
        : d > 5.5
        ? "#a50f15"
        : d > 4.5
        ? "#cb181d"
        : d > 3.5
        ? "#ef3b2c"
        : d > 2.5
        ? "#fb6a4a"
        : d > 1.5
        ? "#fc9272"
        : d > 1
        ? "#fcbba1"
        : "#fee0d2";
    },

    getGreen(d) {
      return d > 10
        ? "#005a32"
        : d > 5.5
        ? "#238b45"
        : d > 4.5
        ? "#41ab5d"
        : d > 3.5
        ? "#74c476"
        : d > 2.5
        ? "#a1d99b"
        : d > 1.5
        ? "#c7e9c0"
        : d > 1
        ? "#e5f5e0"
        : "#f7fcf5";
    }
  }
};
