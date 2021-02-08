import Vue from "vue";
import VueRouter from "vue-router";

import { routesArray } from "@/router/routes";

Vue.use(VueRouter);

const routes = [...routesArray, { path: "*", redirect: "/" }];

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
