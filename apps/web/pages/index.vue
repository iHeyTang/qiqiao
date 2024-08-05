<template>
  <div class="home">
    <main>
      <NuxtRouteAnnouncer />
      <div
        style="
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding-top: 15vh;
          gap: 20px;
        "
      >
        <UAvatar src="/avatar.png" size="3xl" class="avatar-hover" />
        <div style="text-align: center">
          <div style="margin-bottom: 12px">
            Hi, There! I'm <span class="name">iHeyTang</span>
          </div>
          <div>You have discovered a treasure.</div>
        </div>
        <div>
          <UButton
            to="https://www.github.com/iHeyTang"
            target="_blank"
            :padded="false"
            variant="link"
          >
            <UIcon
              name="i-mdi-github"
              style="height: 32px; width: 32px; color: black"
            />
          </UButton>
        </div>
        <div style="display: flex">
          <UButton variant="link" to="/posts/projects">个人作品</UButton>
          <UButton variant="link" to="/posts/notes">黑糖笔记</UButton>
        </div>
      </div>
    </main>
    <footer>
      <Icp />
    </footer>
  </div>
</template>

<style>
.home {
  height: 100vh;
  background: linear-gradient(to bottom, #69ff9740, #00e4ff30);
}
main {
  height: calc(100vh - 60px);
}
footer {
  height: 60px;
}

.name {
  padding: 6px 10px;
  background: #ff8787;
  color: white;
  border-radius: 6px;
  transition: all 0.3s ease; /* 应用于所有属性变化 */
  box-shadow: 0 0 0px 0px #ff8787; /* 阴影 */
}
.name:hover {
  transition: all 0.3s ease; /* 应用于所有属性变化 */
  box-shadow: 0 0 10px 0px #ff8787; /* 阴影 */
}

.avatar-hover {
  transition: all 0.3s ease; /* 应用于所有属性变化 */
}
.avatar-hover:hover {
  transform: scale(1.1); /* 放大头像 */
}

.github-icon:hover {
  cursor: pointer;
}
</style>

<script setup lang="ts">
useHead({
  title: "iHeyTang",
});
</script>
