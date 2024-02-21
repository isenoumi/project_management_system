<template>
  <el-dialog
    :title="props.type == 1 ? '客户拜访' : '客户跟进'"
    width="1750px"
    :destroy-on-close="true"
    :append-to-body="true"
  >
    <div>
      <div v-if="props.type == 1" class="infoBox">
        <div class="title">客户名称: {{ visitFormInfo.clientName }}</div>
        <div class="title" style="white-space: nowarp">
          所属区域:
          {{
            visitFormInfo.address
              ? visitFormInfo.address.replace(/[^\u4E00-\u9FA5]/g, "")
              : ""
          }}
        </div>
        <div class="title">销售人员: {{ visitFormInfo.salesPersonnel }}</div>
        <div class="customerSubBoxType1">
          <div class="customerBox">
            <div class="customerSubBox" style="width: 800px">
              <div
                v-for="(item, index) in contactsList"
                :key="index"
                class="customer"
              >
                <div class="customerTitle">客户联系人: {{ item.linkman }}</div>
                <div class="customerTitle">
                  联系人职务: {{ item.contactPosition }}
                </div>
                <div class="customerTitle">
                  联系人联系方式: {{ item.contactWay }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="infoBox">
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
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane
          :label="props.type == 1 ? '新增客户拜访' : '新增客户跟进'"
          name="first"
        >
          <el-form
            ref="formDataAdd"
            :model="visitForm"
            :rules="rules"
            label-width="140px"
          >
            <el-form-item label="拜访时间: " prop="visitTime">
              <el-date-picker
                v-model="visitForm.visitTime"
                type="datetime"
                placeholder="请选择日期"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>

            <el-form-item label="拜访/跟进记录: " prop="visitLog">
              <el-input
                v-model="visitForm.visitLog"
                class="input"
                autocomplete="off"
                required="required"
                type="textarea"
                :rows="5"
                style="width: 300px"
              ></el-input>
            </el-form-item>
            <el-form-item label="备注信息: " prop="description">
              <el-input
                v-model="visitForm.description"
                class="input"
                autocomplete="off"
                required="required"
                type="textarea"
                :rows="5"
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          :label="props.type == 1 ? '拜访记录' : '跟进记录'"
          name="second"
        >
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
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <!-- 客户档案控制      v-hasPerm="['CLIENT_VISIT_IS_DETAIL']" -->
        <el-button type="primary" @click="saveVisit"> 提交 </el-button>
        <el-button @click="$emit('reset')">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onUpdated, onMounted, watch } from "vue";
import {
  visitInfoGet,
  visitRecordsPost,
  customerVisitIdGet,
  getClientDetailsApi,
  getLinkManApi,
} from "@/api/visit/index";
import { myDict } from "@/utils/myDict.ts";
const emits = defineEmits(["reset"]);
const props = defineProps([
  "id",
  "time",
  "type",
  "projectFormData",
  "clientVisitId",
]);
// 总数
const total = ref(1);
// select下拉
const options = ref({});
// 项目form
const projectForm = ref({});
// form表单Ref
const formDataAdd = ref(null);
// 客户拜访信息form
const visitFormInfo = ref({
  projectName: "",
  projectType: "",
  moneyInvolved: "",
  address: "",
  clientName: "",
  projectOpportunity: "",
  projectSourceFunds: "",
  salesPersonnel: "",
  channel: "",
});
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
const visitForm = ref({
  visitLog: "",
  visitTime: "",
  description: "",
});
// 联系人
const contactsList = ref([]);
// 经办人
const operatorList = ref([]);
// 决策人
const decisionList = ref([]);
const activeName = ref("first");
// form验证规则
const rules = reactive({
  visitTime: [{ required: true, message: "请选择拜访时间" }],
  visitLog: [{ required: true, message: "请输入拜访记录" }],
});
// 新增拜访记录
const saveVisit = async () => {
  if (!visitForm.value) {
    return;
  }
  try {
    await formDataAdd.value.validate();
    Object.assign(visitForm.value, {
      clientVisitId: props.clientVisitId,
      projectId: props.id,
      visitType: props.type,
      visitor: JSON.parse(localStorage.getItem("users")).name,
    });
    visitRecordsPost(visitForm.value).then(({ code, msg }) => {
      if (code == 200) {
        ElMessage({
          type: "success",
          message: msg,
        });
        visitForm.value = {
          visitLog: "",
          visitTime: "",
          description: "",
        };
        emits("reset");
      } else {
        ElMessage({
          type: "fail",
          message: msg,
        });
      }
    });
  } catch (err) {}
};
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

onMounted(() => {
  options.value.typeOptions = JSON.parse(localStorage.getItem("typeOptions"));
  options.value.priorityOptions = JSON.parse(
    localStorage.getItem("priorityOptions")
  );
  options.value.salespersonOptions = JSON.parse(
    localStorage.getItem("salespersonOptions")
  );

  visitForm.value = {
    visitLog: "",
    visitTime: "",
    description: "",
  };
  // 获取拜访记录
  if (props.clientVisitId && props.type == 1) {
    visitInfoGet({
      clientVisitId: props.clientVisitId,
      visitType: props.type,
      pageSize: 999,
    }).then(({ data }) => {
      visitLogTableData.value = data.records;
      total.value = data.total;
    });
    customerVisitIdGet({ id: props.clientVisitId, visitType: props.type }).then(
      ({ data }) => {
        visitFormInfo.value = data.ClientVisit;
        if (data.Visitors) {
          contactsList.value = data.Visitors.filter(
            (item) => item.type == "CUSTOMER_CONTACTS"
          );
          operatorList.value = data.Visitors.filter(
            (item) => item.type == "CUSTOMER_MANAGER"
          );
          decisionList.value = data.Visitors.filter(
            (item) => item.type == "CUSTOMER_DECISION_MAKERS"
          );
        }
        myDict(visitFormInfo.value);
      }
    );
  }
  // 获取跟进记录
  if (props.type == 2 && props.id) {
    if (props.clientVisitId)
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
      operatorList.value = data.filter(
        (item) => item.type == "CUSTOMER_MANAGER"
      );
    });

    projectForm.value = JSON.parse(JSON.stringify(props.projectFormData));
    myDict(projectForm.value);
  }
});
</script>

<style scoped lang="scss">
@import "../css/infoproject.scss";
</style>
