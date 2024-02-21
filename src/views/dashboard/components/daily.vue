<template>
  <!-- <el-dialog
  :close-on-click-modal="false"
    :title="props.dateStr + '日报'"
    width="1000px"
    :destroy-on-close="true"
    :append-to-body="true"
    @close="$emit('clearDaily')"
  > -->
  <el-dialog
    :close-on-click-modal="false"
    :title="props.dateStr + '日报'"
    width="1000px"
    :destroy-on-close="true"
    :append-to-body="true"
    @close="closeMsk"
  >
    <el-form ref="formDataAdd" :model="form" :rules="rules" label-width="100px">
      <el-form-item
        label="日报内容: "
        prop="content"
        v-if="!props.contentTxt || isEdit"
      >
        <el-input
          v-model="form.content"
          class="input"
          autocomplete="off"
          required="required"
          type="textarea"
          rows="15"
        ></el-input>
      </el-form-item>
      <div v-else>
        <el-form-item label="日报内容: " prop="">
          <div>{{ props.contentTxt }}</div>
        </el-form-item>
        <el-form-item label="评论内容: " prop="">
          <div>{{ commentContent }}</div>
        </el-form-item>
      </div>
      <el-form-item
        v-if="!props.contentTxt || isEdit"
        label="日报附件: "
        prop="formAnnex"
      >
        <div class="tipsBox">
          <fileUpload
            @get-file-url="getFileUrl"
            @setFileUrl="setFileUrl"
            :annex="fileUrl"
          ></fileUpload>
          <div class="tips">可上传图片(jpg, png)、文档、excel类型的文件</div>
        </div>
      </el-form-item>
      <el-form-item v-else label="日报附件: " prop="formAnnex">
        <div class="tipsBox">
          <div v-for="(item, index) in fileList" :key="index">
            {{ `附件(${index + 1})` }}
            <el-button type="primary" link @click="viewFileClick(item)"
              >查看</el-button
            >
          </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('closeLog')">关闭</el-button>
        <el-button
          v-if="props.contentTxt && !isEdit && benren"
          @click="editDaily"
        >
          编辑
        </el-button>
        <el-button
          type="primary"
          v-if="
            props.contentTxt && !isEdit && isAdmin && !benren && !commentContent
          "
          @click="appraiseDaily"
        >
          评论日报
        </el-button>
        <el-button
          type="primary"
          @click="saveDaily"
          v-if="!props.contentTxt || isEdit"
        >
          保存
        </el-button>
      </span>
      <el-dialog
        :title="'评论日报'"
        width="500px"
        :destroy-on-close="true"
        :append-to-body="true"
        v-model="appraiseVisible"
        style="z-index: 9999999"
      >
        <span>评论内容: </span>
        <el-input
          v-model="appraiseContent"
          class="input"
          autocomplete="off"
          required="required"
          type="textarea"
          rows="5"
        ></el-input>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="appraiseVisible = false">取消</el-button>

            <el-button type="primary" @click="saveAppraise" v-loading="loading">
              保存
            </el-button>
          </span>
        </template>
      </el-dialog>
      <fileView v-model="fileViewVisible" :file="viewsFileUrl"></fileView>
    </template>
  </el-dialog>
</template>
<!-- 图标选择器示例 -->
<script setup lang="ts">
import { ref, reactive, onUpdated } from "vue";
import { ElMessage, ElMessageBox, ElInput } from "element-plus";
import { postDailyPaper, putDailyPaper } from "@/api/fullCalendar/index";
import fileView from "@/components/FileView/fileView.vue";
import {
  postDailyRemark,
  getDailyRemark,
  getDailyRemarkById,
} from "@/api/fullCalendar";
const emits = defineEmits(["closeLog", "clearDaily"]);
const props = defineProps([
  "dateStr",
  "contentId",
  "contentTxt",
  "benren",
  "file",
]);
// 表单对象
const formDataAdd = ref();
// 表单
const form = ref({
  content: "",
  remark: "",
  file: "",
});
// 表单规则
const rules = reactive({
  content: [{ required: true, message: "请输入日报内容" }],
});
// 文件链接
const fileUrl = ref("");
// 预览链接
const viewsFileUrl = ref("");
const isEdit = ref(false);
const isAdmin = ref(false);
// 评论日报弹框
const appraiseVisible = ref(false);
const commentContent = ref("");
// 预览弹框
const fileViewVisible = ref(false);
// 加载中
const loading = ref(false);
// 评论内容
const appraiseContent = ref("");
const fileList = ref([]);
//　光と闇

//　获取当前日期
const getNowDate = () => {
  var date = new Date();
  var sign2 = ":";
  var year = date.getFullYear(); // 年
  var month = date.getMonth() + 1; // 月
  var day = date.getDate(); // 日
  var hour = date.getHours(); // 时
  var minutes = date.getMinutes(); // 分
  var seconds = date.getSeconds(); //秒
  var weekArr = [
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
    "星期天",
  ];
  var week = weekArr[date.getDay()];
  // 给一位数的数据前面加 “0”
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  return " " + hour + sign2 + minutes + sign2 + seconds;
};
// 保存日报
const saveDaily = async () => {
  if (!form.value) {
    return;
  }
  try {
    await formDataAdd.value.validate();

    if (!props.contentId) {
      postDailyPaper({
        id: "",
        subDate: props.dateStr + getNowDate(),
        contentTxt: form.value.content,
        file: form.value.file,
      }).then(({ msg }) => {
        ElMessage.success(msg);
        emits("closeLog");
        isEdit.value = false;
      });
    } else {
      putDailyPaper({
        id: props.contentId,
        subDate: props.dateStr + getNowDate(),
        contentTxt: form.value.content,
        file: form.value.file,
      }).then(({ msg }) => {
        ElMessage.success(msg);
        isEdit.value = false;
        emits("closeLog");
      });
    }
  } catch (err) {
    console.log(err);
  }
};
// 编辑日报
const editDaily = () => {
  isEdit.value = true;
};
const closeMsk = () => {
  emits("clearDaily");
  // emits('closeLog')
  // saveAppraise();
};
// 保存评论
const saveAppraise = () => {
  postDailyRemark({
    dailyPaperId: props.contentId,
    commentContent: appraiseContent.value,
  }).then(({ msg }) => {
    ElMessage.success(msg);
    appraiseVisible.value = false;
    getDailyRemark({
      DailyPaperId: props.contentId,
    }).then(({ data }) => {
      if (data.records.length > 0)
        commentContent.value = data.records[0].commentContent;
      else commentContent.value = "";
    });
  });
};
const appraiseDaily = () => {
  appraiseContent.value = "";
  appraiseVisible.value = true;
};
// 查看附件
const viewFileClick = (url: any) => {
  viewsFileUrl.value = url;
  fileViewVisible.value = true;
};

// 附件链接url
const getFileUrl = (value: any) => {
  form.value.file += "," + value.msg;
};

// 回显附件链接url
const setFileUrl = (value: any) => {
  form.value.file = value;
};

defineExpose({
  isEdit,
});
onUpdated(() => {
  console.log(isEdit.value);
  isEdit.value = false;
  form.value.content = props.contentTxt;
  form.value.file = props.file;
  fileUrl.value = props.file;
  fileList.value = [];
  if (props.contentId)
    getDailyRemark({
      DailyPaperId: props.contentId,
    }).then(({ data, code }) => {
      if (data.records.length > 0)
        commentContent.value = data.records[0].commentContent;
      else commentContent.value = "";
    });
  if (fileUrl.value)
    fileUrl.value.split(",").forEach((item) => {
      if (item && item != "null" && item != "undefined")
        fileList.value.push(item);
    });
  isAdmin.value = localStorage.getItem("rolelist").includes("系统管理员");
});
</script>

<style lang="scss" scoped>
@import "../css/daily.scss";
</style>
