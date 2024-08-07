<template>
  <div style="margin: auto">
    <ul style="overflow: hidden">
      <li v-for="article in articles" :key="article.id">
        <div class="w-auto border rounded m-4 p-4">
          <ULink :to="`/article/${article.id}`">
            <div class="text-lg">
              {{ article.title }}
            </div>
            <div class="text-xs">
              创建于: {{ article.created_at }} 最后编辑:
              {{ article.updated_at }}
            </div>
          </ULink>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "base",
});

const { data: articles } = await useFetch(`/api/article/list`);
</script>

<style scoped>
/* Add your custom styles here */
</style>
