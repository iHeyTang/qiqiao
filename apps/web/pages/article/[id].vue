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
  layout: "article",
});

const route = useRoute();

const { data } = await useFetch(
  `/api/article/detail?id=${route.params.id as string}`
);

useHead({
  title: `${data?.value?.title || ""} | iHeyTang`,
});

const content = computed(() => {
  return md({ html: true }).render(data.value?.content || "");
});

const createdAt = computed(() => {
  if (!data.value?.created_at) return "";
  return new Date(data.value.created_at).toLocaleString();
});

const latestModifiedAt = computed(() => {
  if (!data.value?.updated_at) return "";
  return new Date(data.value.updated_at).toLocaleString();
});
</script>

<style>
@import url("~/assets/css/github-markdown.css");
</style>
