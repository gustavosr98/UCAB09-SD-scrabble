import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";

// Plugins
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueTheMask from "vue-the-mask";
import VueApexCharts from "vue-apexcharts";

import httpClient from "@/http/http-client";

Vue.config.productionTip = false;
Vue.prototype.$http = httpClient;
Vue.use(VueTheMask);
Vue.use(VueApexCharts);

Vue.component("apexchart", VueApexCharts);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
