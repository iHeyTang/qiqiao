<template>
  <div id="vditor" style="width: 100%; height: 400px"></div>
</template>

<script lang="ts" setup>
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
  });
});

onUnmounted(() => {
  vditor.value?.destroy();
});
</script>
