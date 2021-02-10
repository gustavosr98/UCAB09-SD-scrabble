import { APP_SECTIONS } from "../config/constants";

const routesRaw = Object.freeze({
  LOGIN: {
    path: "/",
    name: "Login",
    redirect: "/test/zk",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/Login/Login"),
    meta: {
      clientGuest: true,
      app_section: APP_SECTIONS.LOGIN,
    },
  },
  SIGN_UP: {
    path: "/",
    name: "SignUp",
    component: () =>
      import(/* webpackChunkName: "sign-up" */ "@/views/Login/SignUp"),
    meta: {
      clientGuest: true,
      app_section: APP_SECTIONS.LOGIN,
    },
  },
  TEST: {
    path: "/test/zk",
    name: "Zookeeper",
    component: () =>
      import(/* webpackChunkName: "zk" */ "@/views/Test/Zookeeper"),
    meta: {
      clientGuest: true,
    },
  },
  DASHBOARD: {
    path: "/client",
    name: "Layout",
    redirect: "/client/ranking",
    component: () =>
      import(
        /* webpackChunkName: "layout" */ "@/components/General/Navigation/Layout"
      ),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/client/ranking",
        name: "Ranking",
        component: () =>
          import(/* webpackChunkName: "ranking" */ "@/views/Ranking/Ranking"),
        meta: {
          app_section: APP_SECTIONS.RANKING,
        },
      },
      {
        path: "/client/play",
        name: "Play",
        component: () =>
          import(/* webpackChunkName: "play" */ "@/views/Play/Play"),
        meta: {
          app_section: APP_SECTIONS.PLAY,
        },
      },
      {
        path: "/client/play/game",
        name: "Game",
        component: () =>
          import(/* webpackChunkName: "play" */ "@/views/Play/Game"),
        meta: {
          app_section: APP_SECTIONS.PLAY,
        },
      },
      {
        path: "/client/profile",
        name: "Profile",
        component: () =>
          import(/* webpackChunkName: "profile" */ "@/views/Profile/Profile"),
        meta: {
          app_section: APP_SECTIONS.PROFILE,
        },
      },
    ],
  },
});

// To be used in Vue Router
const routesArray = Object.keys(routesRaw).map(cr => routesRaw[cr]);

// To be used inside componentes
let routes = {};
Object.keys(routesRaw).map(
  cr =>
    (routes[cr] = {
      ...routesRaw[cr],
      component: null,
    })
);

export { routes as default, routesArray };
