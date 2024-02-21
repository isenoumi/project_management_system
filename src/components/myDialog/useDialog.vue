<template>
  <el-button @click="openDemoDialog">打开弹窗</el-button>
  <demoDialog ref="demoDialogRef" @submit="handleSubmit"></demoDialog>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import demoDialog from "@/components/myDialog/dialog.vue";

let demoDialogRef = ref();

const openDemoDialog = () => {
  demoDialogRef.value.show();
};
const handleSubmit = (data) => {
  console.log(data);
};
</script>
