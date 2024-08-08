<template>
  <el-form :model="form" :rules="rules" label-width="80px">
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" />
    </el-form-item>
    <el-form-item label="内容" prop="content">
      <el-input v-model="form.content" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit(form)">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { api } from "@/api";
import { ElMessage } from "element-plus";
import { reactive } from "vue";
import { useRequest } from "vue-request";

const form = reactive({
  title: "",
  content: "",
});

const rules = {
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  content: [{ required: true, message: "请输入内容", trigger: "blur" }],
};

const { run: handleSubmit } = useRequest(api.api.articleControllerCreate, {
  manual: true,
  onSuccess: () => {
    ElMessage("创建成功");
  },
});
</script>
