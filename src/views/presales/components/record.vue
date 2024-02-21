<template>
  <el-table
    :data="tableData"
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
    <el-table-column prop="projectId" label="优先级">
      <template #default="scope">
        <div v-for="(item, index) in options.planPriorityOptions" :key="index">
          <div v-if="item.value === scope.row.priorityLevel">
            {{ item.label }}
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="supportLatestTime" label="所需支持最晚时间" />
    <el-table-column prop="supportDescription" label="所需支持描述">
      <template #default="scope">
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="scope.row.supportDescription"
          placement="top-start"
        >
          {{
            scope.row.supportDescription &&
            scope.row.supportDescription.length > 22
              ? scope.row.supportDescription.substring(0, 22) + "..."
              : scope.row.supportDescription
          }}
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="files" label="附件">
      <template #default="scope">
        <el-button
          v-if="scope.row.files"
          type="primary"
          @click="handleDownload(scope.row)"
          link
          >下载</el-button
        >
      </template>
    </el-table-column>
    <el-table-column prop="supportUserName" label="支持人" />
    <el-table-column prop="createTime" label="提交时间" />
    <el-table-column prop="supportStatus" label="支持状态">
      <template #default="scope">
        <div v-for="(item, index) in status" :key="index">
          <div v-if="item.value === scope.row.supportStatus">
            {{ item.label }}
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="preRecord(scope.row)" link
          >详情</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    v-model="detailsShow"
    :close-on-click-modal="false"
    title="详情"
    width="35%"
    center
  >
    <div class="msk">
      <div class="left">
        <div>
          <div style="font-weight: 550; font-size: 18px">基础信息</div>
          <div>
            支持状态:<span v-for="(item, index) in status" :key="index"
              ><span v-if="item.value === foundationList.supportStatus">{{
                item.label
              }}</span></span
            >
          </div>
          <div>
            优先级:
            <span
              v-for="(item, index) in options.planPriorityOptions"
              :key="index"
            >
              <span v-if="item.value === foundationList.priorityLevel">
                {{ item.label }}
              </span>
            </span>
          </div>
          <div>所需支持最晚时间:{{ foundationList.supportLatestTime }}</div>
          <div>所需支持描述:{{ foundationList.supportDescription }}</div>
          <div v-if="foundationList.files">
            附件:<el-button
              text
              type="primary"
              @click="handleDownloads(foundationList.files)"
              >下载</el-button
            >
          </div>
          <div>支持人：{{ foundationList.supportUserName }}</div>
          <div style="font-weight: 550; font-size: 18px">支持信息</div>
          <div
            v-for="(item, index) in foundationList.supportReplyFile"
            :key="index"
          >
            附件：<el-button
              text
              type="primary"
              @click="handleDownloads(item.url)"
              >{{ item.title }}</el-button
            >
          </div>
          <div>备注信息：{{ foundationList.supportReplyRemake }}</div>
        </div>
        <div v-if="supportReturn.length > 0">
          <div v-for="(item, index) in supportReturn" :key="index">
            <div style="font-weight: 550; font-size: 18px">基础信息</div>
            <div>
              支持状态:<span v-for="(items, index) in status" :key="index"
                ><span v-if="items.value === item.supportStatus">{{
                  items.label
                }}</span></span
              >
            </div>
            <div>
              优先级:
              <span
                v-for="(items, index) in options.planPriorityOptions"
                :key="index"
              >
                <span v-if="items.value === item.priorityLevel">
                  {{ items.label }}
                </span>
              </span>
            </div>
            <div>所需支持最晚时间:{{ item.supportLatestTime }}</div>
            <div>所需支持描述:{{ item.supportDescription }}</div>
            <div v-if="item.files">
              附件:<el-button text type="primary" @click="handleDownload(item)"
                >下载</el-button
              >
            </div>
            <div>支持人：{{ item.supportReplyUserName }}</div>
            <div style="font-weight: 550; font-size: 18px">支持信息</div>
            <div>
              附件：<el-button
                v-for="(items, index) in item.supportReplyFile"
                :key="index"
                text
                type="primary"
                @click="handleDownloads(items.url)"
                >{{ items.title }}</el-button
              >
            </div>
            <div>备注信息：{{ item.supportReplyRemake }}</div>
          </div>
        </div>
      </div>
      <div class="riht">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :color="activity.color"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
   
    
    <div
      style="display: flex; justify-content: center; margin-top: 30px"
      v-if="supportReturn.length > 0"
    >
      <el-button
        v-if="supportReturn[supportReturn.length - 1].examineStatus == 2"
        @click="finish(foundationList)"
        type="primary"
        >办结
      </el-button>
      <el-button
        @click="
          oncemore(foundationList, supportReturn[supportReturn.length - 1])
        "
        v-if="supportReturn[supportReturn.length - 1].examineStatus == 2"
      >
        再次提交</el-button
      >
      <el-button type="info" @click="detailsShow = false"> 关闭</el-button>
    </div>
    <div
      style="display: flex; justify-content: center; margin-top: 30px"
      v-else
    >
      <el-button
        v-if="
          foundationList.supportStatus == 'EXTENDED' ||
          (foundationList.supportStatus == 'SUPPORTING' &&
            foundationList.examineStatus == 2)
        "
        @click="finish(foundationList)"
        type="primary"
        >办结
      </el-button>
      <el-button
        @click="
          oncemore(foundationList, supportReturn[supportReturn.length - 1])
        "
        v-if="
          foundationList.supportStatus == 'EXTENDED' ||
          (foundationList.supportStatus == 'SUPPORTING' &&
            foundationList.examineStatus == 2)
        "
      >
        再次提交</el-button
      >
      <el-button type="info" @click="detailsShow = false"> 关闭</el-button>
    </div>
  </el-dialog>
  <div style="display: flex; justify-content: flex-end; margin-top: 20px">
    <pagination
      v-if="queryParams.total > 0"
      v-model:total="queryParams.total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="handleQuery"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import Bus from "@/views/projectbudget/js/Bus";
import { getpreSalesSupport, getPreid, gettheEnd } from "@/api/presales/index";
import { useRoute } from "vue-router";
//路由
const route = useRoute();
//传递售前支持详情id
const props = defineProps(["id"]);
//售前支持id
const proId = ref<any>("");
//页数和条数
const queryParams = reactive<any>({
  total: 0,
  pageNo: 1,
  pageSize: 10,
});
//支持状态
const status = ref<any>([
  {
    label: "支持中",
    value: "SUPPORTING",
  },
  {
    label: "支持中(超期)",
    value: "EXTENDED",
  },
  {
    label: "已完结",
    value: "ENDED",
  },
]);
//流程图
const activities = ref<any>([]);
//更新数据
Bus.on("getpresales", (row: any) => {
  if (row) {
    queryParams.pageNo = 1;
    getList();
  }
});
//表格数据
const tableData = ref<any>([]);
//详情弹框
const detailsShow = ref(false);
//详情对象
const foundationList = ref<any>({});
//返回再次提交数据数组
const supportReturn = ref<any>([]);
//序号
const indexMethod = (index: number) => {
  return index * 1 + 1;
};
//分页点击
const handleQuery = () => {
  getList();
};
//刷新数据
Bus.on("promore", (row: any) => {
  if (row) {
    getList();
  }
});
//再次提交
const oncemore = (row: any, rem: any) => {
  if (rem != undefined) {
    if (rem.supportDescription) {
      row.supportDescription = rem.supportDescription;
    }
  }
  Bus.emit("oncemoreSmit", row);
  detailsShow.value = false;
};
//完结
const finish = (row: any) => {
  let data = {
    id: row.id,
  };
  gettheEnd(data).then((res: any) => {
    if (res.code === 200) {
      queryParams.pageNo = 1;
      getList();
      detailsShow.value = false;
      return ElMessage({
        type: "success",
        message: "提交审批成功",
      });
    }
  });
};
// 附件下载
const handleDownload = (event: any) => {
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.href = event.files;
  a.download = "模板" + ".xlsx";
  a.style.display = "none";
  a.click();
  document.body.removeChild(a);
};
// 附件下载
const handleDownloads = (event: any) => {
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.href = event;
  a.download = "模板" + ".xlsx";
  a.style.display = "none";
  a.click();
  document.body.removeChild(a);
};
//获取列表
const getList = () => {
  let data = {
    projectId: proId.value,
    pageNo: queryParams.pageNo,
    pageSize: queryParams.pageSize,
  };
  getpreSalesSupport(data).then((res: any) => {
    if (res.code === 200) {
      tableData.value = res.data.records;
      queryParams.total = res.data.total;
    }
  });
};
//获取优先级
const options = ref({
  priorityOptions: [{ value: "", label: "" }],
  planPriorityOptions: [{ value: "", label: "" }],
  salespersonOptions: [{ value: "", label: "" }],
});
//查看详情
const preRecord = (row: any) => {
  detailsShow.value = true;
  getPreid(row.id).then((res: any) => {
    supportReturn.value = [];
    foundationList.value = res.data.preSalesSupport;
    supportReturn.value = res.data.preSalesSupportList;
    console.log(supportReturn.value.length, "supportReturn.value.length");
    activities.value = res.data.process;
  });
};
onMounted(() => {
  //获取售前支持id
  if (route.query.id) {
    proId.value = route.query.id;
  }
  //售前支持记录id
  if (props.id) {
    proId.value = props.id;
  }
  //获取优先级
  options.value.priorityOptions = JSON.parse(
    localStorage.getItem("priorityOptions") || ""
  );
  //获取支持人
  options.value.planPriorityOptions = JSON.parse(
    localStorage.getItem("priorityOptions") || ""
  );
  //获取支持状态
  options.value.salespersonOptions = JSON.parse(
    localStorage.getItem("salespersonOptions") || ""
  );
  getList();
});
</script>
<style lang="scss" scoped>
@import "../css/details.scss";
</style>
