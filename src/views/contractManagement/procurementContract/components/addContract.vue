<template>
  <el-dialog
    :title="props.id ? '变更合同' : '新建合同'"
    width="90%"
    :destroy-on-close="true"
  >
    <div v-if="props.id">
      <div>
        <div class="headInfo">
          <div class="title">合同信息</div>
          <div class="item">
            <div>合同名称: {{ contractInfo.name }}</div>
            <div>
              合同类型:
              <span
                v-for="(type, index) in options.contractTypeEnums"
                :key="index"
              >
                <span v-if="type.value == contractInfo.type">
                  {{ type.label }}
                </span>
              </span>
            </div>

            <div style="width: 500px">
              所属项目: {{ contractInfo.projectName }}
            </div>
            <div>合同总金额（元）: {{ contractInfo.contractAmount }}</div>
            <div>合同签署日期: {{ contractInfo.contractDate }}</div>
          </div>
        </div>
        <div class="headInfo">
          <div class="title">甲方信息</div>
          <div class="item">
            <div>合同签署甲方: {{ contractInfo.contractFirstParty }}</div>
            <div>甲方联系人: {{ contractInfo.firstPartyContacts }}</div>
            <div>甲方联系方式: {{ contractInfo.firstPartyPhone }}</div>
          </div>
        </div>
        <div class="headInfo">
          <div class="title">乙方信息</div>
          <div class="item">
            <div>供应商: {{ contractInfo.supplierNeme }}</div>
            <div>供应商联系人: {{ contractInfo.supplierContacts }}</div>
            <div>供应商联系方式: {{ contractInfo.supplierPhone }}</div>
            <div>收款人(单位)全称: {{ contractInfo.payeeName }}</div>
            <div>开户银行: {{ contractInfo.bankOfDeposit }}</div>
            <div>银行账户: {{ contractInfo.bankAccount }}</div>
          </div>
        </div>
        <div class="headInfo">
          <div class="title">关联预算项目</div>
          <div
            v-for="(budget, index) in contractInfo.contractBudget"
            :key="index"
            class="item"
            style="margin-top: 8px"
          >
            <div style="width: 540px">
              {{ `${budget[0]}, ${budget[1]}, ${budget[2]}` }}
            </div>
            <div>预算金额（元）: {{ budget[3] }}</div>
            <div>合同金额（元）: {{ budget[4] }}</div>
          </div>
        </div>
        <div class="headInfo">
          <div class="title" style="display: flex; align-items: center">
            附件:
            <div
              v-if="annexList && annexList.length > 0"
              class="fileList"
              style="
                margin-left: 10px;
                display: flex;
                width: 100px;
                align-items: center;
              "
            >
              <div
                v-for="(file, index) in annexList"
                :key="index"
                style="width: 100px"
                class="item"
              >
                <div style="width: 100px" @click="clickDownloadFile(file)">
                  {{ `附件(${index + 1})` }}
                  <el-button type="primary" link>下载</el-button>
                </div>
              </div>
            </div>
            <span v-else>暂无附件</span>
          </div>
        </div>
        <div class="headInfo">
          <div class="title">
            备注: <span>{{ contractInfo.description }}</span>
          </div>
        </div>
      </div>

      <!-- <el-divider /> -->
      <div>
        <el-tabs
          v-model="activeName"
          class="demo-tabs"
          @tab-click="handleTabClick"
        >
          <el-tab-pane
            v-for="item in contractList"
            :key="item.contract.id"
            :label="item.contract.name"
            :name="item.contract.id"
          >
            <div>
              <div class="headInfo">
                <div class="title">合同信息</div>
                <div class="item">
                  <div>合同名称: {{ item.contract.name }}</div>
                  <div>
                    合同类型:
                    <span
                      v-for="(type, index) in options.contractTypeEnums"
                      :key="index"
                    >
                      <span v-if="type.value == item.contract.type">
                        {{ type.label }}
                      </span>
                    </span>
                  </div>

                  <div style="width: 500px">
                    所属项目: {{ item.contract.projectName }}
                  </div>
                  <div>
                    合同总金额（元）: {{ item.contract.contractAmount }}
                  </div>
                  <div>合同签署日期: {{ item.contract.contractDate }}</div>
                </div>
              </div>
              <div class="headInfo">
                <div class="title">甲方信息</div>
                <div class="item">
                  <div>
                    合同签署甲方: {{ item.contract.contractFirstParty }}
                  </div>
                  <div>甲方联系人: {{ item.contract.firstPartyContacts }}</div>
                  <div>甲方联系方式: {{ item.contract.firstPartyPhone }}</div>
                </div>
              </div>
              <div class="headInfo">
                <div class="title">乙方信息</div>
                <div class="item">
                  <div>供应商: {{ item.contract.supplierNeme }}</div>
                  <div>供应商联系人: {{ item.contract.supplierContacts }}</div>
                  <div>供应商联系方式: {{ item.contract.supplierPhone }}</div>
                  <div>收款人(单位)全称: {{ item.contract.payeeName }}</div>
                  <div>开户银行: {{ item.contract.bankOfDeposit }}</div>
                  <div>银行账户: {{ item.contract.bankAccount }}</div>
                </div>
              </div>
              <div class="headInfo">
                <div class="title">关联预算项目</div>
                <div
                  v-for="(budget, index) in item.list"
                  :key="index"
                  class="item"
                  style="margin-top: 8px"
                >
                  <div style="width: 540px">
                    {{ `${budget[0]}, ${budget[1]}, ${budget[2]}` }}
                  </div>
                  <div>剩余预算金额（元）: {{ budget[3] }}</div>
                  <div>合同金额（元）: {{ budget[4] }}</div>
                </div>
              </div>
              <div class="headInfo">
                <div class="title" style="display: flex">
                  附件:
                  <div
                    v-if="
                      item.contract.annexList &&
                      item.contract.annexList.length > 0
                    "
                    class="fileList"
                    style="margin-left: 10px"
                  >
                    <div
                      v-for="(file, index) in item.contract.annexList"
                      :key="index"
                      class="item"
                    >
                      <div @click="clickDownloadFile(file)">
                        {{ `附件(${index + 1})` }}
                        <el-button type="primary" link>下载</el-button>
                      </div>
                    </div>
                  </div>
                  <span v-else>暂无附件</span>
                </div>
              </div>
              <div class="headInfo">
                <div class="title">
                  备注: <span>{{ item.contract.description }}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="新增变更合同" name="addContract">
            <contractForm id="1" ref="contractFormRef"> </contractForm>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <div v-else>
      <contractForm ref="contractFormRef"> </contractForm>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('reset')">取消</el-button>
        <el-button type="primary" @click="addContract">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const emit = defineEmits(["reset"]);
const props = defineProps(["id", "formData"]);
import {
  getContractInfo,
  createChangeContract,
  createContractPost,
  getChangeContract,
} from "@/api/contract/index";
import { ref, reactive, onMounted, onUpdated, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import contractForm from "./contractForm.vue";
import { downloadFile } from "@/api/plan/feishu";
import { contractTypeEnums } from "@/api/enum";
import getFileType from "@/utils/getFileType";
// 新增弹框
const addVisible = ref(false);
// 变更合同tab
const contractList = ref([]);
// 当前显示的变更合同tab
const activeName = ref("addContract");
// 变更合同tab点击
const handleTabClick = (tab, event) => {
  console.log(tab, event);
};
// 新建合同Ref
const contractFormRef = ref(null);
// select下拉以及枚举
const options = ref({
  contractTypeEnums: [{ value: "", label: "" }], // 合同类型
});
// 附件链接
const annexList = ref([]);
// 合同信息
const contractInfo = ref([]);

// 点击文件名下载
const clickDownloadFile = (url) => {
  const formData = new FormData();
  formData.append("fileUrl", url);
  downloadFile(formData).then((res) => {
    const blob = new Blob([res.data], {
      type: getFileType(url),
    });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "附件";
    a.href = objectUrl;
    document.body.appendChild(a);
    a.click();
    document.bodyNaNpxoveChild(a);
  });
};
// 新增合同
const addContract = async () => {
  if (!contractFormRef.value.form) {
    return;
  }
  try {
    await contractFormRef.value.formDataAdd.validate();
    addVisible.value = false;
    if (!props.id) {
      // 合同新增
      const records = {
        contract: { ...contractFormRef.value.form },
        contractBudget: contractFormRef.value.form.contractBudget,
      };
      createContractPost(records).then(({ code, msg }) => {
        if (code == 200) {
          ElMessage({
            type: "success",
            message: msg,
          });
          emit("reset");
        } else {
          ElMessage({
            type: "fail",
            message: msg,
          });
        }
      });
    } else {
      // 新增变更合同
      const records = {
        contract: { ...contractFormRef.value.form },
        contractBudget: contractFormRef.value.form.contractBudget,
        id: props.id,
      };
      createChangeContract(records).then(({ code, msg }) => {
        if (code == 200) {
          ElMessage({
            type: "success",
            message: msg,
          });
          emit("reset");
        } else {
          ElMessage({
            type: "fail",
            message: msg,
          });
        }
      });
    }
  } catch (err) {}
};
// props变化
watch(
  props,
  (newValue, oldValue) => {
    activeName.value = "addContract";
    // 获取主合同信息
    if (props.id)
      getContractInfo(props.id).then(({ data }) => {
        contractInfo.value = data.contract;
        if (data.contract.contractFile)
          annexList.value = data.contract.contractFile
            .split(",")
            .filter((item) => item);
        else annexList.value = [];
        Object.assign(contractInfo.value, { contractBudget: data.list });
      });
    //  获取变更合同
    if (props.id)
      getChangeContract({ id: props.id }).then(({ data }) => {
        data.list.forEach((item) => {
          if (item.contract.contractFile)
            item.contract.annexList = item.contract.contractFile
              .split(",")
              .filter((item) => item);
          // Object.assign(item, { contractBudget: item.list });
        });
        contractList.value = data.list;
      });
  },
  {
    deep: true,
    immediate: true,
  }
);

// 获取枚举
onMounted(() => {
  contractTypeEnums().then(({ data }) => {
    options.value.contractTypeEnums = data;
  });
});
</script>

<style scoped lang="scss">
@import "../css/addContract.scss";
</style>
