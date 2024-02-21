<template>
    <el-tabs v-model="carefulName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="全部" name="全部"></el-tab-pane>
        <el-tab-pane label="售前" name="售前"></el-tab-pane>
        <el-tab-pane label="财务" name="财务"></el-tab-pane>
    </el-tabs>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue"
import type { TabsPaneContext } from 'element-plus'
//头部选项卡默认选中
const carefulName = ref<any>('售前')
const handleClick = (tab: TabsPaneContext, event: Event) => {}
onMounted(() => {

})
</script>
<style lang="scss" scoped>
  @import "../css/index.scss";
</style>