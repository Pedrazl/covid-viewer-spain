const path = require("path");

module.exports = {
  chainWebpack(config) {
    config.resolve.alias.set("@", path.join(__dirname, "./src"));
  },
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: [path.resolve(__dirname, "src/core/")],
          indentedSyntax: false
        },
        prependData: '@import "@/styles/variables.scss";'
      }
    }
  }
};
