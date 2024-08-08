import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";
import ArticleList from "@/pages/article/list.vue";
import ArticleEdit from "@/pages/article/edit.vue";
import ArticleNew from "@/pages/article/new.vue";

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
    path: "/article/list",
    component: ArticleList,
    meta: {
      title: "Articles",
    },
  },
  {
    path: "/article/new",
    component: ArticleNew,
    meta: {
      hideInMenu: true,
      title: "New Article",
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
