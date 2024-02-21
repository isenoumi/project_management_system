<script setup lang="ts">
import { ElConfigProvider } from "element-plus";
import { useAppStore } from "@/store/modules/app";
const appStore = useAppStore();
// 从网址获取token
let x = window.location.search.substring(1)
// 如果token存在就说明是从A系统跳转过来的
if (x) {
  // 取“=”之后的token
  let y = x.indexOf('=')
  let z = x.substring(y + 1)
  console.log(z,'token')
  // 把token存进B系统
  localStorage.setItem('accessToken', z)
}
</script>

<template>
  <el-config-provider :locale="appStore.locale" :size="appStore.size">
    <router-view />
  </el-config-provider>
</template>

<style>
html {
  height: 100%;
  min-width: 1800px;
}
</style>
