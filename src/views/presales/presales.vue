<template>
    <div>
        <el-card>
            <Details></Details>
            <div class="tabs-top">
                <el-tabs v-model="carefulName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="新增支持" name="新增支持">
                    <addsupport></addsupport>
                </el-tab-pane>
                <el-tab-pane label="支持记录" name="支持记录">
                    <record></record>
                </el-tab-pane>
            </el-tabs>
            </div>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
import Details from "./components/details.vue";
import addsupport from "./components/addsupport.vue"
import record from "./components/record.vue"
import Bus from "../projectbudget/js/Bus";
import type { TabsPaneContext } from 'element-plus'
import { useRoute } from "vue-router";
const route = useRoute();
//头部选项卡默认选中
const carefulName = ref<any>('新增支持')
const handleClick = (tab: TabsPaneContext, event: Event) => {
    if(tab.index==='1'){
        Bus.emit("getpresales", tab.index)
    }
}
//切换新增
Bus.on("oncemoreSmit", (row: any) => {
    if (row.id) {
        carefulName.value='新增支持'
        Bus.emit('editPro',row)
    }

});
//切换支持记录
Bus.on("promore", (row: any) => {
    if (row) {
        carefulName.value='支持记录'
    }

});
onMounted(() => {
    if (route.query.id) {
        // console.log(route.query.id,'售前支持id')
    }
})
</script>
<style lang="scss" scoped>
@import "./css/details.scss";
</style>