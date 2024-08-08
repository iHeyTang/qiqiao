<template>
  <el-form :model="form" :rules="rules" label-width="80px">
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" />
    </el-form-item>
    <el-form-item label="内容" prop="content">
      <el-input v-model="form.content" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit(id, form)">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { api } from "@/api";
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import { useRequest } from "vue-request";
import { ElMessage } from "element-plus";

const router = useRouter();
const id = ref(Number(router.currentRoute.value.params.id as string));
const form = reactive({
  title: "",
  content: "",
});

const rules = {
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  content: [{ required: true, message: "请输入内容", trigger: "blur" }],
};

useRequest(api.api.articleControllerDetail, {
  refreshDeps: [id],
  defaultParams: [id.value],
  onSuccess: (data) => {
    form.title = data.data.title;
    form.content = data.data.content;
  },
});

const { run: handleSubmit } = useRequest(api.api.articleControllerEdit, {
  manual: true,
  onSuccess: () => {
    ElMessage("编辑成功");
  },
});
</script>
