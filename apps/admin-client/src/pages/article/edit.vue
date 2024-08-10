<template>
  <div style="margin-bottom: 4px">
    <div style="display: flex; gap: 20px; align-items: center">
      <el-input
        v-model="form.title"
        placeholder="请输入标题"
        size="large"
        style="font-size: 20px; font-weight: bold"
      />
      <el-button @click="handleUpdateSubmit(id, form)">保存</el-button>
      <el-button @click="handlePublishSubmit(id)">发布</el-button>
    </div>
    <div style="font-size: 12px">
      <div v-if="updateLoading">自动保存中...</div>
      <div v-else>
        最近更新:
        {{
          updateResult?.data.updated_at &&
          dayjs(updateResult?.data.updated_at).format("YYYY-MM-DD HH:mm:ss")
        }}
      </div>
    </div>
  </div>
  <Editor v-model="form.content" />
</template>

<script lang="ts" setup>
import { api } from "@/api";
import { useRouter } from "vue-router";
import Editor from "@/components/Editor.vue";
import { reactive, ref, watch } from "vue";
import { useRequest } from "vue-request";
import { dayjs, ElMessage } from "element-plus";

const router = useRouter();
const id = ref(Number(router.currentRoute.value.params.id as string));
const form = reactive({
  title: "",
  content: "",
});

useRequest(api.api.articleControllerDetail, {
  refreshDeps: [id],
  defaultParams: [id.value],
  onSuccess: (data) => {
    form.title = data.data.title;
    form.content = data.data.content;
  },
});

const {
  data: updateResult,
  run: handleUpdateSubmit,
  loading: updateLoading,
} = useRequest(api.api.articleControllerEdit, { manual: true });

const { run: handlePublishSubmit } = useRequest(
  api.api.articleControllerPublish,
  {
    manual: true,
    onSuccess: () => {
      ElMessage("发布成功");
    },
  }
);

watch(
  form,
  () => {
    handleUpdateSubmit(id.value, form);
  },
  { deep: true }
);
</script>
