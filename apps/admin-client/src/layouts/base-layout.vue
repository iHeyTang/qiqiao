<template>
  <el-container class="base-layout">
    <el-aside>
      <div class="menu-head">
        <el-avatar size="default" style="margin-right: 20px" />
        Qiqiao
      </div>
      <el-menu router :default-active="activeRoute.fullPath">
        <template v-for="route in $router.getRoutes()" :key="route.path">
          <el-sub-menu
            v-if="route.children && route.children.length"
            :index="route.path"
          >
            <template #title>
              <span>{{ route.meta.title }}</span>
            </template>
            <el-menu-item v-for="child in route.children" :index="child.path">
              {{ child.meta?.title }}
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else-if="!route.meta.hideInMenu" :index="route.path">
            <template #title>{{ route.meta.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    <el-main><slot name="default"></slot></el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { watchEffect } from "vue";
import { useRoute } from "vue-router";

const activeRoute = useRoute();

watchEffect(() => {
  if (activeRoute.meta.title) {
    document.title = `Qiqiao - ${activeRoute.meta.title}`;
  }
});
</script>

<style>
.base-layout {
  height: 100%;
}

.menu-head {
  display: flex;
  align-items: center;
  padding: 20px;
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: white;
}
</style>
