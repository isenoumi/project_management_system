<template>
    <div class="head">
        <div class="details-title">售前支持</div>
        <div class="details-item">
            <div>项目名称：{{ details.projectName }}</div>
            <div>项目资金来源：<span v-for="item, index in options.projectSourceFundsOptions" :key="index"><span
                        v-if="item.value === details.projectSourceFunds">{{ item.label }}</span></span></div>
            <div>所属区域：<span v-for="item, index in details.area" :key="index"><span>{{ item + ',' }}</span></span></div>
            <div>客户名称：{{ details.customerName }}</div>
            <div>预合同金额（万）：{{ details.prepareContractAmount }}万</div>
            <div>销售人员：{{ details.salesperson }}</div>
            <div>项目优先级：<span v-for="item, index in options.priorityOptions" :key="index"><span
                        v-if="item.value === details.projectFirstLevel">{{ item.label }}</span></span></div>
            <div>项目机会：{{ details.projectOpportunities }}</div>
        </div>
        <div class="details-item">
            <div v-for="item, index in handlingList" :key="index" style="display: flex;">
                <div>客户经办人：{{ item.linkman }}</div>
                <div>经办人职务：{{ item.contactPosition }}</div>
                <div>经办人联系方式：{{ item.contactWay }}</div>
            </div>
        </div>
        <div class="details-item">
            <div v-for="item, index in decisionmaking" :key="index" style="display: flex;">
                <div>客户决策人：{{ item.linkman }}</div>
                <div>决策人职务：{{ item.contactPosition }}</div>
                <div>决策人联系方式：{{ item.contactWay }}</div>
            </div>
        </div>
        <div class="details-item">
            <div>渠道：{{ details.channel }}</div>
            <div>项目进展：{{ details.projectProgress }}</div>
            <div>三板斧完成情况：
                <span v-for="item, index in details.threePlateAxeState" :key="index">{{ item + ',' }}</span>
            </div>
            <div>资金情况：{{ details.fundingSituation }}</div>
            <div>决策链分析：{{ details.decisionChainAnalysis }}</div>
            <div>预计成交时间：{{ details.estimatedClosingTime }}</div>
            <div>竞争对手：{{ details.competitor }}</div>

        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { getclientDetailsAbove, requestHandler } from "@/api/presales/index"
import { useRoute } from "vue-router";
//路由
const route = useRoute();
//售前支持id
const proId = ref<any>("")
//详情对象
const details = ref<any>({})
//客户经办人
const handlingList = ref<any>([])
//客户决策人
const decisionmaking = ref<any>([])
//获取详情数据
const getDetails = () => {
    let data = {
        id: proId.value
    }
    getclientDetailsAbove(data).then((res: any) => {
        details.value = res.data
    })
    requestHandler(data).then((res: any) => {
        if (res.code === 200) {

            res.data.map((v: any) => {
                if (v.type === 'CUSTOMER_MANAGER') {
                    handlingList.value.push(v)
                }
                if (v.type == 'CUSTOMER_DECISION_MAKERS') {
                    decisionmaking.value.push(v)
                }
            })
        }
    })
}
//枚举匹配
const options = ref({
    projectSourceFundsOptions: [{ value: "", label: "" }],
    priorityOptions: [{ value: "", label: "" }],
});
onMounted(() => {
    if (route.query.id) {
        proId.value = route.query.id
    }
    //获取优先级
    options.value.priorityOptions = JSON.parse(localStorage.getItem("priorityOptions") || "");
    //获取项目资金来源
    options.value.projectSourceFundsOptions = JSON.parse(localStorage.getItem("projectSourceFundsOptions") || "");
    //获取详情数据
    getDetails()
})
</script>
<style lang="scss" scoped>
@import '../css/details.scss';
</style>