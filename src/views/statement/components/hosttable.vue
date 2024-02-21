<template>
  <div style="margin-top: 20px">
    <el-table
      :data="datalist"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '50px' }"
      :border="true"
      style="width: 100%"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        'text-align': 'center',
      }"
    >
      <el-table-column
        type="index"
        label="序号"
        width="60"
        :index="(e) => e + 1 + (queryParams.pageNo - 1) * queryParams.pageSize"
      />
      <el-table-column prop="projectId" label="项目编号" />
      <el-table-column prop="department" label="所属公司" />
      <el-table-column prop="projectName" label="项目名称">
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="scope.row.projectName"
            placement="top-start"
          >
            {{
              scope.row.projectName && scope.row.projectName.length > 12
                ? scope.row.projectName.substring(0, 12) + "..."
                : scope.row.projectName
            }}
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="projectSourceFunds" label="项目资金来源" />
      <el-table-column prop="area" label="所属区域">
        <template #default="scope">
          <span>
            {{
              scope.row.area
                ? scope.row.area.replace(/[^\u4e00-\u9fa5]/gi, "")
                : ""
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称">
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="scope.row.customerName"
            placement="top-start"
          >
            {{
              scope.row.customerName && scope.row.customerName.length > 12
                ? scope.row.customerName.substring(0, 12) + "..."
                : scope.row.customerName
            }}
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="customerContacts" label="客户联系人" />
      <el-table-column prop="prepareContractAmount" label="预合同金额（万）" />
      <el-table-column prop="salesperson" label="销售人员" />
      <el-table-column prop="projectStatus" label="项目状态" />
      <el-table-column prop="mergedRemarks" label="项目交付内容">
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="scope.row.mergedRemarks"
            placement="top-start"
          >
            {{
              scope.row.mergedRemarks && scope.row.mergedRemarks.length > 12
                ? scope.row.mergedRemarks.substring(0, 12) + "..."
                : scope.row.mergedRemarks
            }}
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="replyFileName" label="项目交付备注">
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="scope.row.replyFileName"
            placement="top-start"
          >
            {{
              scope.row.replyFileName && scope.row.replyFileName.length > 12
                ? scope.row.replyFileName.substring(0, 12) + "..."
                : scope.row.replyFileName
            }}
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="yeshu">
      <pagination
        v-if="queryParams.total > 0"
        v-model:total="queryParams.total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getpayList"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getprjectList } from "@/api/presales/index";
import Bus from "../js/Bus";
const datalist = ref([]);
//传递过来的数据
const props = defineProps({
  headerdata: {
    type: Object,
    default: {},
  },
  carefulList: {
    type: Object,
    default: {},
  },
});
//搜索表格
const queryParams = ref({
  total: 0,
  pageNo: 1,
  pageSize: 10,
  projectName: "",
  projectId: "",
  area: "",
  salesperson: "",
  replyFileUsername: "",
  projectStatus: "",
  supportLatestTime: "",
});
//序号
const indexMethod: any = (index: number) => {
  return index * 1 + 1;
};
//重置
Bus.on("reseting", (row: any) => {
  if (row) {
    queryParams.value.pageNo = 1;
    queryParams.value.projectName = "";
    queryParams.value.projectId = "";
    queryParams.value.area = "";
    queryParams.value.salesperson = "";
    queryParams.value.replyFileUsername = "";
    queryParams.value.projectStatus = "";
    queryParams.value.supportLatestTime = "";
    getpayList();
  }
});

//搜索
Bus.on("serchList", (row: any) => {
  if (row) {
    queryParams.value.projectName = row.projectName;
    (queryParams.value.projectId = row.projectId),
      (queryParams.value.area = row.area),
      (queryParams.value.salesperson = row.salesperson),
      (queryParams.value.replyFileUsername = row.replyFileUsername),
      (queryParams.value.projectStatus = row.projectStatus),
      (queryParams.value.supportLatestTime = row.supportLatestTime);
    getpayList();
  }
});
//获取列表
const getpayList = () => {
  let data = {
    pageNo: queryParams.value.pageNo,
    pageSize: queryParams.value.pageSize,
    projectName: queryParams.value.projectName,
    projectId: queryParams.value.projectId,
    area: queryParams.value.area,
    salesperson: queryParams.value.salesperson,
    replyFileUsername: queryParams.value.replyFileUsername,
    projectStatus: queryParams.value.projectStatus,
    supportLatestTime: queryParams.value.supportLatestTime,
  };
  getprjectList(data).then((res: any) => {
    res.data.records.map((v: any) => {
      const result = v.area.split('"').join("").slice(1, -1).split(",");
      v.area = result.toString();
    });
    datalist.value = res.data.records;
    queryParams.value.total = res.data.total;
  });
};
onMounted(() => {
  getpayList();
});
</script>
<style lang="scss">
@import "../css/index.scss";
</style>
