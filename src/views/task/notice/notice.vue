<template>
  <div class="app-container">
    <el-card>
      <div class="header">
        <div class="header-left">
          <div class="input">
            <div class="title">标题名称:</div>
            <el-input v-model="query.title" placeholder="请输入标题名称" />
          </div>

          <div class="input" v-if="isAdmin">
            <div class="title">状态:</div>
            <el-select
              v-model="query.status"
              class="m-2"
              placeholder="请选择项目状态"
              clearable
            >
              <el-option
                v-for="item in options.statusOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="input">
            <div class="title">时间:</div>
            <el-date-picker
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              v-model="query.updateTime"
              type="date"
              placeholder="请选择日期"
              :default-value="new Date()"
            />
          </div>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="queryList">搜索 </el-button>
          <el-button type="info" @click="reset">重置</el-button>
          <!-- <el-button
            v-if="roleList.buttonShow"
            type="primary"
            
            @click="noticeFaBu"
            >通知发布
          </el-button> -->
          <el-button
            v-hasPerm="['NOTICE_MANAGEMENT_ADD']"
            type="primary"
            @click="noticeFaBu"
            >通知发布
          </el-button>
        </div>
      </div>
      <div class="tabla">
        <el-table
          :header-row-style="{ height: '60px' }"
          :row-style="{ height: '50px' }"
          :data="noticeTableData"
          style="width: 100%"
          :border="true"
          :cell-style="{ textAlign: 'center' }"
          :header-cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60"
            :index="(e) => e + 1 + (currentPage - 1) * pageSize"
          />
          <el-table-column prop="title" label="标题名称" />
          <el-table-column prop="publisher" label="发布人" />
          <el-table-column prop="updateTime" label="更新时间" width="180">
            <template #default="scope">
              <div>
                {{ scope.row.updateTime.slice(0, 10) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="isAdmin"
            prop="status"
            label="状态"
            width="180"
          />
          <el-table-column label="操作" width="240">
            <template #default="scope">
              <el-button
                type="primary"
                :bg="false"
                link
                @click="handleViewNotice(scope.$index, scope.row)"
                >查看</el-button
              >
              <!-- <el-button
                v-if="roleList.buttonShow"
                type="primary"
                :bg="false"
                link
                @click="handleEditNotice(scope.$index, scope.row)"
                >编辑</el-button
              > -->
              <el-button
                v-hasPerm="['NOTICE_MANAGEMENT_EDIT']"
                type="primary"
                :bg="false"
                link
                @click="handleEditNotice(scope.$index, scope.row)"
                >编辑</el-button
              >

              <el-button
                v-hasPerm="['NOTICE_MANAGEMENT_DEL']"
                type="danger"
                :bg="false"
                link
                @click="handleDeleteNotice(scope.$index, scope.row)"
                >删除</el-button
              >
              <!-- <el-button
                v-if="roleList.buttonShow"
                type="danger"
                :bg="false"
                link
                @click="handleDeleteNotice(scope.$index, scope.row)"
                >删除</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="yeshu">
        <!-- <el-pagination
          background
          layout="total, prev, pager, next"
          :total="total"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        /> -->
        <pagination
          v-if="total > 0"
          v-model:total="total"
          v-model:page="currentPage"
          v-model:limit="pageSize"
          @pagination="queryList"
        />
      </div>
      <el-dialog
        v-model="centerDialogVisible"
        title="通知发布"
        width="70%"
        align-center
      >
        <div class="input">
          <div class="title">标题名称:</div>
          <el-input
            v-model="notificationReleaseForm.title"
            placeholder="请输入项目名称"
          />
        </div>
        <div class="txt">
          <div style="width: 85px">通知内容:</div>
          <editor
            v-model="notificationReleaseForm.content"
            style="height: calc(100vh - 180px)"
          />
        </div>
        <div class="input" style="margin-top: 15px" v-if="showDownload">
          <div class="title">上传附件:</div>
          <div style="width: 200px">
            <fileUpload
              @setFileUrl="setFileUrl"
              @get-file-url="getFileUrl"
              :annex="fileUrl"
            ></fileUpload>
          </div>
        </div>
        <div class="btn">
          <el-button type="primary" @click="handleSaveNotice">保存</el-button>
          <el-button type="primary" @click="handleReleaseNotice"
            >发布</el-button
          >
          <el-button type="info" @click="centerDialogVisible = false"
            >返回</el-button
          >
        </div>
      </el-dialog>
      <el-dialog
        v-model="noticeInfoVisible"
        title="通知发布"
        width="70%"
        align-center
      >
        <div class="input">
          <div class="title">标题名称: {{ noticeForm.title }}</div>
        </div>
        <div class="txt">
          <div style="width: 85px">
            通知内容:
            <div class="content" v-html="noticeForm.content"></div>
          </div>
        </div>
        <div class="input" style="margin-top: 15px">
          <div class="title">上传附件:</div>
          <el-button v-if="noticeForm.annex" type="primary" @click="download">
            下载
          </el-button>
          <div v-else>暂无附件</div>
        </div>
        <div class="btn">
          <el-button type="info" @click="reset">关闭 </el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<!-- 图标选择器示例 -->
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import Editor from "@/components/WangEditor/index.vue";
import fileUpload from "@/components/Upload/fileUpload.vue";
import { downloadFile } from "@/api/plan/feishu";
import getFileType from "@/utils/getFileType";
import {
  getNoticePage,
  saveNotice,
  getNoticeOne,
  delNotice,
  releaseNotice,
} from "@/api/task/notice/index";
import { getTaskNoticeOne } from "@/api/task/taskcenter/index";
// 是否管理员
const isAdmin = ref(false);
// 文件上传链接url
const fileUrl = ref("");
// 显示下载按钮
const showDownload = ref(true);
// 当前页
const currentPage = ref(1);
// 每页条数
const pageSize = ref(10);
// 总数
const total = ref(10);
// 通知发布弹框
const centerDialogVisible = ref(false);
// 通知详情弹框
const noticeInfoVisible = ref(false);
// 条件查询
const query = ref({
  title: "",
  updateTime: "",
  status: "",
});
// select下拉以及枚举
const options = ref({
  statusOption: [
    {
      label: "已发布",
      value: "已发布",
    },
    {
      label: "待发布",
      value: "待发布",
    },
  ],
});
// 用户的角色
const roleList = reactive<any>({
  user: [],
  buttonShow: false,
});
// 通知表格数据
const noticeTableData = ref([]);
// 是否编辑
const isEdit = ref(false);
const id = ref("");
// 通知发布的表单
const notificationReleaseForm = ref({ title: "", content: "", annex: "" });
// 通知保存表单
const noticeForm = ref({ title: "", content: "", annex: "" });

// 表格序号
const indexMethod = (index: number) => {
  return index * 1 + 1;
};

// 通知发布按钮
const noticeFaBu = (e: string) => {
  centerDialogVisible.value = true;
  id.value = "";
  isEdit.value = false;
  notificationReleaseForm.value = { title: "", content: "", annex: "" };
};
const handleSizeChange = (val: number) => {};
// table 跳页
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  queryList();
};

// 通知编辑
const handleEditNotice = (index: number, row: any) => {
  isEdit.value = true;
  centerDialogVisible.value = true;
  id.value = row.id;
  showDownload.value = false;
  getNoticeOne({ id: row.id }).then(({ data }) => {
    notificationReleaseForm.value = data;
    console.log("asdasda", notificationReleaseForm.value.annex);
    fileUrl.value = notificationReleaseForm.value.annex;
    nextTick(() => {
      showDownload.value = true;
    });
  });
};

// 查看通知详情
const handleViewNotice = (index: number, row: any) => {
  noticeInfoVisible.value = true;
  getTaskNoticeOne({ id: row.id }).then(({ data }) => {
    noticeForm.value = data;
  });
};

// 附件下载
const download = () => {
  if (noticeForm.value.annex) {
    const urlArr = noticeForm.value.annex.split(",");
    urlArr.forEach((item) => {
      if (item && item != "null" && item != "undefined") {
        const formData = new FormData();
        formData.append("fileUrl", item);
        downloadFile(formData).then((res) => {
          const blob = new Blob([res.data], {
            type: getFileType(item),
          });
          console.log("getFileType(item)", getFileType(item));
          const objectUrl = URL.createObjectURL(blob);
          console.log(objectUrl);
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

// 删除通知
const handleDeleteNotice = (index: number, row: any) => {
  ElMessageBox.confirm("此操作将永久删除该通知, 是否继续?", "提示", {
    distinguishCancelAndClose: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then(() => {
    delNotice({ id: row.id }).then(({ code }) => {
      if (code == 200) {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        reset();
      }
    });
  });
};

// 页面重置
const reset = () => {
  notificationReleaseForm.value = { title: "", content: "", annex: "" };
  query.value = {
    title: "",
    updateTime: "",
    status: "",
  };
  noticeInfoVisible.value = false;
  centerDialogVisible.value = false;
  queryList();
};

// 发布通知
const handleReleaseNotice = () => {
  releaseNotice({
    id: id.value,
    content: notificationReleaseForm.value.content,
    title: notificationReleaseForm.value.title,
    annex: notificationReleaseForm.value.annex,
    name: JSON.parse(localStorage.getItem("users")).name,
  }).then(({ code, msg }) => {
    ElMessage({
      type: "success",
      message: msg,
    });
    reset();
  });
};

// 保存通知
const handleSaveNotice = () => {
  let data = {
    content: notificationReleaseForm.value.content,
    title: notificationReleaseForm.value.title,
    annex: notificationReleaseForm.value.annex,
    name: JSON.parse(localStorage.getItem("users")).name,
  };
  if (id.value) {
    data.id = id.value;
  }
  saveNotice(data).then(({ msg }) => {
    ElMessage({
      type: "success",
      message: msg,
    });
    reset();
  });
};

// 查询列表
const queryList = () => {
  if (!isAdmin.value) query.value.status = "已发布";
  getNoticePage({
    title: query.value.title,
    updateTime: query.value.updateTime,
    status: query.value.status,
    pageNo: currentPage.value,
    // username: JSON.parse(localStorage.getItem("users")).username,
  }).then(({ data }) => {
    noticeTableData.value = data.records;
    console.log(" data.total", data.total);
    total.value = data.total;
  });
};

// 拼接文件链接url
const getFileUrl = (value: any) => {
  notificationReleaseForm.value.annex += "," + value.msg;
};
// 回显文件列表
const setFileUrl = (value: any) => {
  notificationReleaseForm.value.annex = value;
};

onMounted(() => {
  roleList.user = localStorage.getItem("rolelist");
  if (
    roleList.user.includes("系统管理员" || roleList.user.includes("项目负责人"))
  ) {
    roleList.buttonShow = true;
  } else {
    roleList.buttonShow = false;
  }
  isAdmin.value =
    localStorage.getItem("rolelist").includes("系统管理员") ||
    localStorage.getItem("rolelist").includes("项目负责人");
  queryList();
});
</script>
<style lang="scss" scoped>
@import "./css/notice.scss";
</style>
