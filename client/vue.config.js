module.exports = {
  transpileDependencies: ["vuetify"],
  pwa: {
    name: "Scrabble",
    themeColor: "#106836",
    msTileColor: "#106836",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    manifestOptions: {
      version: "0.0.1",
      description: "Scrabble",
    },
    iconPaths: {
      favicon32: "img/icons/favicon-32x32.png",
      favicon16: "img/icons/favicon-16x16.png",
      appleTouchIcon: "img/icons/apple-touch-icon.png",
      maskIcon: "img/icons/favicon-32x32.png",
      msTileImage: "img/icons/mstile-150x150.png",
    },
  },
};
