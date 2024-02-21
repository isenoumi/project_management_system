<template>
  <el-dialog
    title="详情"
    width="1700px"
    :destroy-on-close="true"
    :append-to-body="true"
  >
    <div>
      <div class="infoBox">
        <div class="title">项目名称: {{ projectForm.projectName }}</div>
        <div class="title">
          项目资金来源: {{ projectForm.projectSourceFunds }}
        </div>
        <div class="title">所属公司: {{ projectForm.company }}</div>
        <div class="title">
          伏泰总部项目编号: {{ projectForm.headquartersProjectId }}
        </div>
        <div class="title" style="width: 300px">
          所属区域: {{ projectForm.area }}
        </div>
        <!-- <div class="title">客户名称: {{ projectForm.customerName }}</div> -->
        <!-- <div class="title">客户联系人: {{ projectForm.customerContacts }}</div> -->
        <div class="title">
          预合同金额（万）: {{ projectForm.prepareContractAmount }}
        </div>
        <div class="title">项目类型: {{ projectForm.projectType }}</div>
        <div class="title">销售人员: {{ projectForm.salesperson }}</div>
        <div class="title">项目优先级: {{ projectForm.projectFirstLevel }}</div>
        <div class="title">所属部门: {{ projectForm.department }}</div>
        <div class="title">所属业务线: {{ projectForm.lineOfBusiness }}</div>

        <div class="title">
          项目机会: {{ projectForm.projectOpportunities }}
        </div>

        <div class="title">渠道: {{ projectForm.channel }}</div>

        <div class="title">
          所处阶段: {{ projectForm.theStageToWhichItBelongs }}
        </div>
        <div class="title">项目进展: {{ projectForm.projectProgress }}</div>
        <div
          class="radio"
          style="
            width: 600px;
            display: flex;
            justify-content: left;
            align-items: center;
          "
        >
          <div>三板斧完成情况: &nbsp;</div>
          <el-checkbox-group v-model="projectForm.threePlateAxeState">
            <el-checkbox disabled value="1" label="约参观" />
            <el-checkbox disabled value="2" label="约交流" />
            <el-checkbox disabled value="3" label="约高层拜访" />
          </el-checkbox-group>
        </div>
        <div class="title">资金情况: {{ projectForm.fundingSituation }}</div>
        <div class="title">
          决策链分析: {{ projectForm.decisionChainAnalysis }}
        </div>
        <div class="title">
          预计成交时间: {{ projectForm.estimatedClosingTime }}
        </div>
        <div class="title">竞争对手: {{ projectForm.competitor }}</div>
        <div class="customerSubBoxType2">
          <div class="customerSubBox">
            <div
              v-for="(item, index) in decisionList"
              :key="index"
              class="customer"
            >
              <div class="customerTitle">客户决策人: {{ item.linkman }}</div>
              <div class="customerTitle">
                决策人职务: {{ item.contactPosition }}
              </div>
              <div class="customerTitle">
                决策人联系方式: {{ item.contactWay }}
              </div>
            </div>
          </div>
          <div class="customerSubBox">
            <div
              v-for="(item, index) in operatorList"
              :key="index"
              class="customer"
            >
              <div class="customerTitle">客户经办人: {{ item.linkman }}</div>
              <div class="customerTitle">
                经办人职务: {{ item.contactPosition }}
              </div>
              <div class="customerTitle">
                经办人联系方式: {{ item.contactWay }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="tabs">
      <!-- 客户档案控制 -->
      <!-- v-hasPerm="['CLIENT_VISIT_IS_DETAIL']" -->
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="tabClick">
        <el-tab-pane label="客户跟进记录" name="first">
          <div class="table" style="width: 100%">
            <el-table border :data="visitLogTableData">
              <el-table-column
                align="center"
                label="序号"
                type="index"
                width="60"
              />

              <el-table-column
                v-for="(item, index) in visitLogTableList"
                :key="index"
                align="center"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
              >
                <template #default="scope">
                  <!-- <div v-if="item.prop == 'visitor'">
                    <div
                      v-for="(
                        scopeItem, scopeIndex
                      ) in options.salespersonOptions"
                      :key="scopeIndex"
                    >
                      <div v-if="scopeItem.value == scope.row.createBy">
                        {{ scopeItem.label }}
                      </div>
                    </div>
                  </div> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- <div
            style="display: flex; justify-content: flex-end; margin-top: 20px"
            class="page"
            v-if="props.type == 1 && total > 0"
          >
            <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div> -->
        </el-tab-pane>
        <el-tab-pane label="支持记录" name="second">
          <supportRecord :id="props.id"></supportRecord>
        </el-tab-pane>
      </el-tabs>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('reset')">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onUpdated, onMounted, watch } from "vue";
import { getClientDetailsApi, getLinkManApi } from "@/api/visit/index";
import { myDict } from "@/utils/myDict.ts";
import supportRecord from "@/views/presales/components/record.vue";
const emits = defineEmits(["reset"]);
const props = defineProps([
  "id",
  "time",
  "type",
  "projectFormData",
  "clientVisitId",
]);
// select下拉
const options = ref({});
// 项目form
const projectForm = ref({});
// 总数
const total = ref(10);
// 拜访记录表
const visitLogTableList = ref([
  {
    label: "拜访人",
    prop: "visitor",
  },
  {
    label: "拜访时间",
    prop: "visitTime",
  },
  {
    label: "拜访/跟进记录",
    prop: "visitLog",
    width: 600,
  },
  {
    label: "备注信息",
    prop: "description",
  },
  {
    label: "上传时间",
    prop: "createTime",
  },
]);
// 操作记录表格
const visitLogTableData = ref([]);
// 新增拜访form
const form = ref({
  visitLog: "",
  visitTime: "",
  description: "",
});
// 分页
const handleCurrentChange = (val) => {
  if (props.clientVisitId && props.type == 1)
    visitInfoGet({
      clientVisitId: props.clientVisitId,
      visitType: props.type,
      pageNo: val,
    }).then(({ data }) => {
      visitLogTableData.value = data.records;
      total.value = data.total;
    });
  else visitLogTableData.value = [];
  if (props.type == 2 && props.id && props.clientVisitId)
    getClientDetailsApi({
      id: props.clientVisitId,
      projectId: props.id,
      visitType: 2,
      pageNo: val,
    }).then((res) => {
      visitLogTableData.value = res.data.VisitLog;
    });
  else visitLogTableData.value = [];
};
// 经办人
const operatorList = ref([]);
// 决策人
const decisionList = ref([]);
// 当前tab
const activeName = ref("first");
// 点击tab
const tabClick = (e) => {
  if (e.props.name == "first") {
    getClientDetails();
  }
};
// 获取详情
const getClientDetails = () => {
  if (props.id && props.clientVisitId)
    getClientDetailsApi({
      id: props.clientVisitId,
      projectId: props.id,
      visitType: 2,
    }).then((res) => {
      visitLogTableData.value = res.data.VisitLog;
    });
};
// 首次请求详情
onMounted(() => {
  options.value.typeOptions = JSON.parse(localStorage.getItem("typeOptions"));
  options.value.priorityOptions = JSON.parse(
    localStorage.getItem("priorityOptions")
  );
  options.value.salespersonOptions = JSON.parse(
    localStorage.getItem("salespersonOptions")
  );
  form.value = {
    visitLog: "",
    visitTime: "",
    description: "",
  };
  getClientDetails();
  activeName.value = "first";
  projectForm.value = JSON.parse(JSON.stringify(props.projectFormData));
  if (props.id && props.clientVisitId)
    getClientDetailsApi({
      id: props.clientVisitId,
      projectId: props.id,
      visitType: 2,
    }).then((res) => {
      visitLogTableData.value = res.data.VisitLog;
    });
  else visitLogTableData.value = [];
  getLinkManApi({ id: props.id }).then(({ data }) => {
    decisionList.value = data.filter(
      (item) => item.type == "CUSTOMER_DECISION_MAKERS"
    );
    operatorList.value = data.filter((item) => item.type == "CUSTOMER_MANAGER");
  });
  myDict(projectForm.value);
});
</script>

<style scoped lang="scss">
@import "../css/infoproject.scss";
</style>
