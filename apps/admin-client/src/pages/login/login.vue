<template>
  <div class="login-page">
    <div class="login">
      <h1 style="margin-bottom: 30px">起巧</h1>
      <div style="margin-bottom: 20px">Nodejs全栈内容管理系统</div>
      <el-form :model="form" class="login-form">
        <el-form-item>
          <el-input v-model="form.username" placeholder="账号" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.password"
            placeholder="密码"
            type="password"
          />
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { api } from "@/api";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  username: "",
  password: "",
});

const handleLogin = async () => {
  const res = await api.api.authControllerLogin({
    username: form.username,
    password: form.password,
  });

  if (res.data.access_token) {
    localStorage.setItem("token", res.data.access_token);
    router.replace("/");
  }
};
</script>

<style>
.login-page {
  width: 100%;
  height: 100%;
  display: flex;
  margin: 0;
  padding: 0;
  background: linear-gradient(to bottom, #69ff9740, #00e4ff30);
}

.login-page .login {
  margin: auto;
  background-color: white;
  width: 400px;
  display: flex;
  flex-direction: column;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
  border-radius: 8px;
}

.login-page .login input:autofill {
  box-shadow: 0 0 0 30px white inset !important;
}
</style>
