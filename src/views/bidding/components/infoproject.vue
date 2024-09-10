<template>
  <el-dialog title="" width="60%" :destroy-on-close="true">
    <div class="boxTitle">项目信息</div>
    <div class="infoBox">
      <div class="title">项目名称：{{ formInfo.projectName }}</div>
      <!-- <div class="title">项目类型：{{ formInfo.projectType }}</div> -->
      <div class="title">项目资金来源：{{ formInfo.projectSourceFunds }}</div>
      <div class="title" style="width: 300px">
        所属区域：{{ formInfo.area }}
      </div>
      <div class="title">客户名称：{{ formInfo.customerName }}</div>
      <!-- <div class="title">客户联系人：{{ formInfo.customerContacts }}</div> -->
      <div class="title">
        预合同金额（万）：{{ formInfo.prepareContractAmount }}
      </div>
      <div class="title">销售人员：{{ formInfo.salesperson }}</div>
      <div class="title">所属部门：{{ formInfo.department }}</div>
      <div class="title">所属业务线：{{ formInfo.lineOfBusiness }}</div>
      <div class="title">
        <!-- 预计成交时间：{{ formInfo.expectedTransactionTime }} -->
        预计成交时间：{{ formInfo.estimatedClosingTime }}
      </div>
    </div>
    <!-- <div class="boxTitle">招投标信息</div>
    <div class="infoBox" v-if="formInfo.biddingStatus == '未中标'">
      <div class="title">未中标原因：{{ formInfo.result }}</div>
      <div class="title">
        <div class="title">上传附件:&nbsp;&nbsp;</div>
        <el-button v-if="formInfo.annex" type="primary" text @click="download">
          下载
        </el-button>
        <div v-if="annexList.length > 0" class="fileList">
          <div v-for="(item, index) in annexList" :key="index" class="item">
            <div @click="clickDownloadFile(item.url)">{{ item.fileName }}</div>
          </div>
        </div>
        <span v-else>暂无附件</span>
      </div>
    </div>
    <div class="infoBox" v-else>
      <div class="title">项目类型：{{ formInfo.projectType }}</div>
      <div class="title">项目资金来源：{{ formInfo.projectSourceFunds }}</div>
      <div class="title" style="width: 300px">
        所属区域：{{ formInfo.area }}
      </div>
      <div class="title">客户名称：{{ formInfo.customerName }}</div>
      <div class="title">客户联系人：{{ formInfo.customerContacts }}</div>
      <div class="title">合同金额（万）：{{ formInfo.contractAmount }}</div>
      <div class="title" style="width: 300px">
        合同签订时间：{{ formInfo.contractTime }}
      </div>
      <div class="title" style="width: 400px">
        工期：{{ formInfo.duration }}
      </div>
      <div class="title">执行负责人：{{ formInfo.executiveProjectLeader }}</div>
      <div class="title">项目成员：{{ formInfo.projectHuman }}</div>

      <div class="title">
        <span class="title">上传附件:&nbsp;&nbsp;</span>
        <el-button v-if="formInfo.annex" type="primary" text @click="download">
          下载
        </el-button>
        <div v-if="annexList.length > 0" class="fileList">
          <div v-for="(item, index) in annexList" :key="index" class="item">
            <div @click="clickDownloadFile(item.url)">{{ item.fileName }}</div>
          </div>
        </div>
        <span v-else>暂无附件</span>
      </div>
    </div> -->

    <div class="boxTitle">操作记录</div>
    <operationRecordsTable
      :table-data="operationRecordsTableData"
      @open-log="openLog"
    ></operationRecordsTable>
    <changeLog
      v-model="operationRecordsVisible"
      :form="operationRecords"
      @close-log="operationRecordsVisible = false"
    ></changeLog>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('reset')">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onUpdated } from "vue";
import operationRecordsTable from "@/components/table/operation-records-table.vue";
import changeLog from "./changeLog.vue";
import { biddingSelect } from "@/api/bidding/index";
import { downloadFile } from "@/api/plan/feishu";
import getFileType from "@/utils/getFileType";

import { myDict } from "@/utils/myDict.ts";

const emits = defineEmits(["reset"]);
const props = defineProps(["id"]);
// 操作记录弹框
const operationRecordsVisible = ref(false);
// 操作记录
const operationRecords = ref({});
// 操作记录表格
const operationRecordsTableData = ref([]);
// 项目信息
const formInfo = ref({});
// 附件链接
const annexList = ref([]);

// 查看详情
const openLog = (row) => {
  operationRecordsVisible.value = true;
  operationRecords.value = row;
};

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
    document.body.removeChild(a);
  });
};

// 附件下载
const download = () => {
  if (formInfo.value.annex) {
    const urlArr = formInfo.value.annex.split(",");
    urlArr.forEach((item) => {
      if (item && item != "null" && item != "undefined") {
        const formData = new FormData();
        formData.append("fileUrl", item);
        downloadFile(formData).then((res) => {
          const blob = new Blob([res.data], {
            type: getFileType(item),
          });
          const objectUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.download = "附件";
          a.href = objectUrl;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
      }
    });
  }
};

onUpdated(() => {
  if (props.id) {
    biddingSelect(props.id).then(({ data }) => {
      operationRecordsTableData.value = data.modifyIPage.records;
      formInfo.value = data.project;
      annexList.value = [];
      if (formInfo.value.annex) {
        formInfo.value.annex.split(",").forEach((item, index) => {
          if (item != "null" && item != "undefined") {
            annexList.value.push({
              url: item,
              fileName: `附件(${index})`,
            });
          }
        });
      }
      formInfo.value.projectHuman = "";
      if (
        formInfo.value.projectMember &&
        formInfo.value.projectMember.length > 0
      ) {
        formInfo.value.projectMember.forEach((item) => {
          JSON.parse(
            localStorage.getItem("executiveProjectLeaderOptions")
          ).forEach((option) => {
            if (option.value == item) {
              formInfo.value.projectHuman += ` ${option.label} `;
            }
          });
        });
      }

      myDict(formInfo.value);
    });
  }
});
</script>

<style scoped lang="scss">
@import "../css/infoproject.scss";
</style>
