const path = require("path");

module.exports = {
  chainWebpack(config) {
    config.resolve.alias.set("@", path.join(__dirname, "./src"));
    config.plugin("define").tap((definitions) => {
      definitions[0]["process.env"]["VERSION"] = JSON.stringify(require("./package.json").version);
      return definitions;
    });
  },
  publicPath: "/covid-viewer-spain/",
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: [path.resolve(__dirname, "src/core/")],
          indentedSyntax: false,
        },
        prependData: '@import "@/styles/variables.scss";',
      },
    },
  },
};
