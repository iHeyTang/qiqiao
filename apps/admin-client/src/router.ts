import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";
import ArticleList from "@/pages/article/list.vue";
import ArticleEdit from "@/pages/article/edit.vue";
import Login from "@/pages/login/login.vue";

type RouteConfig = RouteRecordRaw & {
  meta?: {
    hideInMenu?: boolean;
    title?: string;
  };
};

export const routes: RouteConfig[] = [
  {
    path: "/",
    redirect: "/article/list",
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/login",
    component: Login,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/article/list",
    component: ArticleList,
    meta: {
      title: "Articles",
    },
  },
  {
    path: "/article/edit/:id",
    component: ArticleEdit,
    meta: {
      hideInMenu: true,
      title: "Edit Article",
    },
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
