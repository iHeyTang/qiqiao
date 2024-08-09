<template>
  <header
    style="
      position: sticky;
      top: 0;
      background-color: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(4px);
      z-index: 10;
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
  </header>

  <NuxtPage style="min-height: calc(100vh - 128px); width: 100%" />

  <footer style="height: 64px">
    <UDivider />
    <Icp />
  </footer>
</template>
