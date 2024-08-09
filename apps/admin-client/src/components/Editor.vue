<template>
  <div id="vditor" style="width: 100%; height: 400px"></div>
</template>

<script lang="ts" setup>
import CryptoJS from "crypto-js";
import { oss } from "@/api";
import Vditor from "vditor";
import "vditor/dist/index.css";
import { onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: String },
});
const emit = defineEmits(["update:modelValue"]);

const vditor = ref<Vditor | null>(null);

onMounted(() => {
  vditor.value = new Vditor("vditor", {
    width: "100%",
    minHeight: 400,
    after: () => {
      vditor.value!.setValue(props.modelValue || "", true);
      watch(props, () => {
        vditor.value!.setValue(props.modelValue || "", true);
      });
    },
    input: (value) => {
      emit("update:modelValue", value);
    },
    outline: {
      enable: true,
      position: "right",
    },
    upload: {
      accept: "image/*",
      handler: async (files) => {
        for (const file of files) {
          const arrayBuffer = await file.arrayBuffer();
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
          const hash = CryptoJS.MD5(wordArray).toString();
          const filename = `images/${hash}.${file.name.split(".").pop()}`;

          const ossClient = await oss();
          const res = await ossClient.put(filename, file);
          vditor.value?.insertValue(
            `![${res.name}](${res.url}?x-oss-process=image/resize,h_100,limit_0)`
          );
        }
        return null;
      },
    },
  });
});

onUnmounted(() => {
  vditor.value?.destroy();
});
</script>
