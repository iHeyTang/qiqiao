<template>
  <div style="text-align: center; padding: 20px 0" class="text-sm">
    <span>© 2024 iHeyTang</span> |
    <a
      target="_blank"
      rel="noreferrer"
      style="color: #69db7c"
      href="http://beian.miit.gov.cn/"
    >
      {{ icpNo }}
    </a>
  </div>
</template>

<script setup lang="ts">
const icpNo = process.env.PUBLIC_WEB_ICP_NO;
</script>
