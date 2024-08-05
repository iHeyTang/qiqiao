<template>
  <div
    style="
      position: sticky;
      top: 0;
      background-color: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(4px);
      z-index: 100;
      height: 64px;
      border-bottom: 1px solid #eaeaea;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    "
  >
    <ULink
      to="/"
      class="px-10 py-4"
      style="display: flex; align-items: center; gap: 24px; width: fit-content"
    >
      <UAvatar src="/avatar.png" class="w-auto h-6" />
      <div>iHeyTang</div>
    </ULink>
  </div>

  <div style="display: flex; align-items: start; position: relative">
    <div
      class="px-10 py-4"
      style="
        min-width: 400px;
        max-width: 400px;
        height: calc(100vh - 64px);
        overflow: scroll;
        position: sticky;
        top: 64px;
      "
    >
      <NavigationTree :links="navigationTree" default-open :multiple="false" />
    </div>
    <div class="px-10 py-4" style="width: 100%">
      <div style="min-height: calc(100vh - 256px)">
        <NuxtPage />
      </div>
      <UDivider style="height: 92px" />
      <footer><Icp /></footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationTreeLink } from "~/components/NavigationTree/index.vue";
import type { TreeNode } from "~/server/api/post_list";

const { data: postList } = await useFetch(`/api/post_list`);
const navigationTree = traversePostList(postList.value || []);

/**
 * 遍历postList，需要下钻
 * @param postList
 */
function traversePostList(postList: TreeNode[]) {
  const result: NavigationTreeLink[] = [];

  for (const post of postList) {
    const node: NavigationTreeLink = {
      label: post.name,
      replace: true,
      to: `/posts${post.path}`.replace(/\.md$/, ""),
    };
    result.push(node);
    if (post.children) {
      node.children = traversePostList(post.children);
    }
  }
  return result;
}
</script>
