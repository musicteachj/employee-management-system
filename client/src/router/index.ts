import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import TableWrapper from "../views/TableWrapper.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/new-hires",
    name: "New Hires",
    component: TableWrapper,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
