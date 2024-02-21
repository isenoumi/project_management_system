<template>
  <el-card>
    <div class="searchBox">
      <div class="headerSelect">
        <div class="inputBox">
          <div class="title">审批状态:</div>
          <el-select
            v-model="searchForm.examineStatus"
            class="input"
            clearable
            placeholder="请选择审批状态"
          >
            <el-option
              v-for="item in options.examineStatusEnums"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="inputBox">
          <div class="title">上传人:</div>
          <el-input
            v-model="searchForm.username"
            class="input"
            clearable
            placeholder="请输入上传人"
          >
          </el-input>
        </div>
      </div>
      <div class="btnList">
        <el-button type="primary" @click="queryList">搜索</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </div>
    </div>
    <proTable
      v-loading="loading"
      :tableHeader="tableHeaderData"
      :isMoreSelect="false"
      :isShowIndex="true"
      :tableData="tableList"
      :currentChange="handleCurrentChange"
      :sizeChange="handleSizeChange"
      :pageSize="pageSizes"
      :currentPage="currentPages"
      :totalNum="total"
    >
      <template v-slot:default="{ rows, cols }">
        <!-- 过滤一些内容-->
        <div v-if="cols.props == 'controls' && rows.examineStatus == 0">
          <el-button type="primary" @click="editWorkshopFn(rows)" text>
            审批
          </el-button>
        </div>
        <div v-else-if="cols.props == 'subject'">
          兼职/设计/临时劳务-活动执行及劳务费-宣教费用
        </div>
        <div v-else-if="cols.props == 'file'">
          <el-button
            v-if="rows.file"
            type="primary"
            @click="clickDownloadFile(rows.file)"
            link
          >
            下载
          </el-button>
          <div v-else>暂无附件</div>
        </div>
        <!-- 显示其他内容 -->
        <span v-else>
          {{ rows[cols.props] }}
        </span>
      </template>
    </proTable>
    <div v-if="approvalVisible">
      <addApproval
        v-model="approvalVisible"
        @reset="reset"
        :table-data="tableRow"
        :userEnums="userEnums"
      ></addApproval>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import proTable from "@/components/myTable/table.vue";
import { getBudgetExamine } from "./api/index";
import addApproval from "./components/addApproval.vue";
import { downloadFile } from "@/api/plan/feishu";
import { download } from "@/utils/getFileType";
import { getUserPage } from "@/api/user";
// 搜索参数
const searchForm = ref({
  examineStatus: "",
  username: "",
});
// 加载
const loading = ref(false);
// 重置
const reset = () => {
  approvalVisible.value = false;
  searchForm.value = {
    examineStatus: "",
    username: "",
  };
  currentPages.value = 1;
  queryList();
};

// 枚举下拉
const options = ref({
  examineStatusEnums: [
    { value: 0, label: "待审批" },
    { value: 1, label: "审批通过" },
    { value: 2, label: "未通过" },
    { value: 9, label: "结束付款申请" },
  ],
});
// 新增弹框
const approvalVisible = ref(false);
// table数据
const tableList = ref([]);
// table的行数据
const tableRow = ref({});
// 用户枚举
const userEnums = ref([]);
// Table表头
const tableHeaderData = ref([
  {
    label: "上传人",
    props: "createByUsername",
    enums: {
      enums: userEnums.value,
      value: "username",
      label: "name",
    },
  },
  { label: "审批类型", props: "excamineType" },
  { label: "所属科目", props: "subject" },
  { label: "申请时间", props: "paymentDate" },
  { label: "付款金额", props: "payAmount" },
  { label: "所属月份", props: "getMonth" },
  { label: "附件", props: "file" },
  { label: "付款事由", props: "applicationNotes", hover: { length: 10 } },
  { label: "审批时间", props: "examineTime" },
  { label: "审批备注", props: "examineRemake", hover: { length: 10 } },
  {
    label: "审核状态",
    props: "examineStatus",
    enums: { enums: options.value.examineStatusEnums },
  },
  { label: "操作", props: "controls" },
]);
// 总数
const total = ref(10);
// 当前页
const currentPages = ref(1);
// 页数size
const pageSizes = ref(10);
// 下载
const clickDownloadFile = (url) => {
  loading.value = true;
  const formData = new FormData();
  formData.append("fileUrl", url);
  downloadFile(formData).then((res) => {
    loading.value = false;
    download(res, url);
  });
};

// 编辑按钮
const editWorkshopFn = async (row) => {
  approvalVisible.value = true;
  tableRow.value = row;
  Object.assign(tableRow.value, {
    subject: "兼职/设计/临时劳务-活动执行及劳务费-宣教费用",
  });
};

//分页方法
const queryList = () => {
  loading.value = true;
  //调接口拿数据
  getBudgetExamine({
    pageNo: currentPages.value,
    pageSize: pageSizes.value,
    ...searchForm.value,
  }).then(({ data }) => {
    loading.value = false;
    total.value = data.total;
    tableList.value = data.records;
  });
};

//分页相关按钮
const handleSizeChange = (page) => {
  pageSizes.value = page;
  queryList();
};
const handleCurrentChange = (page) => {
  console.log(page);
  currentPages.value = page;
  queryList();
};
onMounted(() => {
  //初始化
  getUserPage({ pageSize: 999, pageNo: 1 }).then(({ data }) => {
    userEnums.value = data.records;
    tableHeaderData.value[0].enums.enums = data.records;
  });
  queryList();
});
</script>
<style lang="scss" scoped>
@import "./css/index.scss";
</style>
