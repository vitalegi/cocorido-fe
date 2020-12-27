import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/game",
    name: "PlayGame",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/PlayGame.vue"),
    props: route => {
      const playerId = Number.parseInt(route.params.playerId, 10);
      const tableId = Number.parseInt(route.params.tableId, 10);
      return { tableId: tableId, playerId: playerId };
    }
  },
  {
    path: "/black-card-manager",
    name: "BlackCardManager",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/BlackCardManagerView.vue"
      )
  },
  {
    path: "/white-card-manager",
    name: "WhiteCardManager",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/WhiteCardManagerView.vue"
      )
  }
];

const router = new VueRouter({
  routes
});

export default router;
