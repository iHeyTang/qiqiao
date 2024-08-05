<template>
  <div class="markdown-body" style="min-height: 256px" v-html="content"></div>
  <UDivider style="height: 92px">End</UDivider>
  <div class="text-slate-400 text-sm">
    <div>创建时间: {{ createdAt }}</div>
    <div>最近修改时间: {{ latestModifiedAt }}</div>
  </div>
</template>

<script setup lang="ts">
import md from "markdown-it";

definePageMeta({
  layout: "posts",
});

const route = useRoute();

const { data } = await useFetch(
  `/api/post_content?doc_path=${(route.params.doc_path as string[]).join("/")}`
);

useHead({
  title: `${data?.value?.title || ""} | iHeyTang`,
});

const content = computed(() => {
  return md({ html: true }).render(data.value?.content || "");
});

const createdAt = computed(() => {
  if (!data.value?.createdAt) return "";
  return new Date(data.value.createdAt).toLocaleString();
});

const latestModifiedAt = computed(() => {
  if (!data.value?.latestModifiedAt) return "";
  return new Date(data.value.latestModifiedAt).toLocaleString();
});
</script>

<style>
@import url("~/assets/css/github-markdown.css");
</style>
