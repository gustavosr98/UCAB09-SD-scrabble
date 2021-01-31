import "material-design-icons-iconfont/dist/material-design-icons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import minifyTheme from "minify-css-string";
import es from "vuetify/es5/locale/es";

export default new Vuetify({
  lang: {
    locales: { es },
    current: "es",
  },
  theme: {
    options: {
      customProperties: true,
      minifyTheme,
      themeCache: {
        get: key => localStorage.getItem(key),
        set: (key, value) => localStorage.setItem(key, value),
      },
    },
    icons: {
      iconfont: "md" || "fa" || "mdi",
    },
    themes: {
      light: {
        primary: "#106836",
        secondary: "#E11E30",
        // accent: "#82B1FF",
        // error: "#FF5252",
        // info: "#2196F3",
        // success: "#4CAF50",
        // warning: "#FFC107",
      },
    },
  },
});
Vue.use(Vuetify);
