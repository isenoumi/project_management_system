<template>
  <el-dialog
    title="操作"
    width="70%"
    :close-on-click-modal="false"
    align-center
  >
    <div class="title1">一级科目：{{ props.illustrate.fname }}</div>
    <div class="title1 title2">二级科目：{{ props.illustrate.sname }}</div>
    <div class="title1">三级科目</div>
    <!-- 老操作 -->
    <el-table
      v-if="props.illustrate.fname != '项目毛利测算汇总表'"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '40px' }"
      :data="props.tableDatas"
      style="width: 100%"
      :border="true"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        'text-align': 'center',
      }"
    >
      <el-table-column prop="code" label="科目编号" width="100" />
      <el-table-column prop="name" label="预算科目类别" width="120" />
      <el-table-column prop="costAmount" label="预算费用合计" width="120" />
      <el-table-column prop="payAmount" label="付款费用合计" width="120" />
      <el-table-column prop="overExpenditure" label="是否超预算" width="120">
        <!-- <template #default="{ row }">{{ row }}</template> -->
      </el-table-column>
      <el-table-column prop="januaryCost" label="1月" />
      <el-table-column prop="februaryCost" label="2月" />
      <el-table-column prop="marchCost" label="3月" />
      <el-table-column prop="aprilCost" label="4月" />
      <el-table-column prop="mayCost" label="5月" />
      <el-table-column prop="juneCost" label="6月" />
      <el-table-column prop="julyCost" label="7月" />
      <el-table-column prop="augustCost" label="8月" />
      <el-table-column prop="septemberCost" label="9月" />
      <el-table-column prop="octoberCost" label="10月" />
      <el-table-column prop="novemberCost" label="11月" />
      <el-table-column prop="decemberCost" label="12月" />
    </el-table>
    <!-- 新操作权限 -->
    <el-table
      v-else
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '40px' }"
      :data="budgetSubject"
      style="width: 100%"
      :border="true"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        'text-align': 'center',
      }"
    >
      <el-table-column prop="code" label="科目编号" width="100" />
      <el-table-column prop="name" label="预算科目类别" width="120" />
      <el-table-column prop="costAmount" label="费用合计" width="120" />
      <el-table-column prop="januaryCost" label="1月" />
      <el-table-column prop="februaryCost" label="2月" />
      <el-table-column prop="marchCost" label="3月" />
      <el-table-column prop="aprilCost" label="4月" />
      <el-table-column prop="mayCost" label="5月" />
      <el-table-column prop="juneCost" label="6月" />
      <el-table-column prop="julyCost" label="7月" />
      <el-table-column prop="augustCost" label="8月" />
      <el-table-column prop="septemberCost" label="9月" />
      <el-table-column prop="octoberCost" label="10月" />
      <el-table-column prop="novemberCost" label="11月" />
      <el-table-column prop="decemberCost" label="12月" />
    </el-table>
    <!-- 提交表单 -->
    <div
      v-if="props.illustrate.fname === '项目毛利测算汇总表'"
      style="display: flex; align-items: center"
    >
      <el-form ref="mainBodyFormRef" :model="mainBodyForm" :rules="rules">
        <div style="display: flex; align-items: center">
          <el-form-item label="金额: " prop="money">
            <el-input
              v-model="mainBodyForm.money"
              type="number"
              placeholder="请输入金额"
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item
            style="margin-left: 20px; margin-right: 25px"
            label="发生月份: "
            prop="month"
          >
            <el-select
              v-model="mainBodyForm.month"
              style="width: 180px"
              placeholder="请选择月份"
            >
              <el-option
                v-for="(item, index) in mainBodyForm.deviceheaderList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" style="margin-top: 20px">
            <el-input v-model="mainBodyForm.remarks" type="textarea" />
          </el-form-item>
          <el-form-item
            label="上传附件: "
            style="margin-top: 45px; margin-left: 25px"
          >
            <el-upload
              v-loading="loading"
              v-model:file-list="mainBodyForm.fileList"
              class="upload-demo"
              :data="uploadData"
              action=""
              :http-request="upload"
              multiple
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-success="handleSuccess"
              :limit="1"
              :on-exceed="handleExceed"
              :show-file-list="true"
            >
              <el-button text type="primary">上传附件</el-button>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 新操作权限 -->
    <div
      class="title1"
      v-if="props.illustrate.fname === '项目毛利测算汇总表'"
      style="margin: 15px 0"
    >
      操作记录:
    </div>
    <el-table
      v-if="props.illustrate.fname === '项目毛利测算汇总表'"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '40px' }"
      :data="props.recordList"
      style="width: 100%"
      :border="true"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        'text-align': 'center',
      }"
    >
      <el-table-column
        type="index"
        label="序号"
        :index="indexMethod"
        width="60"
      />
      <el-table-column prop="money" label="金额" width="90" />
      <el-table-column prop="month" label="发生月份" />
      <el-table-column prop="createTime" label="操作时间" />
      <el-table-column prop="createByUsername" label="操作人" />

      <el-table-column prop="remarks" label="备注" />
      <el-table-column prop="file" label="凭证附件">
        <template #default="scope">
          <div v-if="scope.row.file">
            <el-button text type="primary" @click="handleDownload(scope.row)">
              下载
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 老操作 -->
    <div
      class="title1"
      v-if="props.illustrate.fname != '项目毛利测算汇总表'"
      style="margin: 15px 0"
    >
      详情:
    </div>
    <el-table
      v-if="props.illustrate.fname != '项目毛利测算汇总表'"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '40px' }"
      :data="props.details"
      style="width: 100%"
      :border="true"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        'text-align': 'center',
      }"
    >
      <el-table-column
        type="index"
        label="序号"
        :index="indexMethod"
        width="60"
      />
      <el-table-column prop="createByUsername" label="上传人" width="90" />
      <el-table-column prop="createTime" label="申请时间" width="120" />
      <el-table-column prop="payAmount" label="付款金额" />
      <el-table-column prop="getMonth" label="所属月份" width="120" />
      <el-table-column
        prop="applicationNotes"
        label="申请备注信息"
        width="120"
      />
      <el-table-column prop="examineTime" label="审批时间" />
      <el-table-column prop="examineBudget" label="审批预算" />
      <el-table-column prop="examineRemake" label="审批备注" />
      <el-table-column prop="examineStatus" label="审核状态" />
      <el-table-column prop="applicationNotes" label="备注" />
    </el-table>
    <div style="width: 170px; margin: 0 auto; margin-top: 30px">
      <!-- 新操作权限 -->
      <el-button
        v-if="props.illustrate.fname === '项目毛利测算汇总表'"
        type="primary"
        @click="addMainBody"
        >保存</el-button
      >
      <el-button type="info" @click="$emit('closess')">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import {
  getaccountAmountModification,
  getqueryAccountInformation,
} from "@/api/budget";
import type { UploadProps } from "element-plus";
import { createFeishuUpload } from "@/api/plan/feishu/index";
import Bus from "../js/Bus";
const emit = defineEmits(["closess"]);
//新查看数据
const budgetSubject = ref<any>([]);
// 加载状态
const loading = ref(false);
//上传文件
const uploadData = ref({
  name: "文件",
  type: "attachment",
});
//获取父组件数据
const props = defineProps({
  xmId: <any>{
    type: String,
    default: "",
  },
  tableDatas: <any>{
    type: Array,
    default: [],
  },
  illustrate: <any>{
    type: Object,
    default: {},
  },
  details: <any>{
    type: Array,
    default: [],
  },
  recordList: <any>{
    type: Array,
    default: [],
  },
});
// 主体form ref
const mainBodyFormRef = ref<any>(null);
// form规则
const rules = reactive({
  money: [{ required: true, message: "请输入金额" }],
  month: [{ required: true, message: "请选择月份" }],
});
// 主体form
const mainBodyForm = ref<any>({
  cosUrl: "",
  fileCode: [],
  fileList: [],
  uploadshow: true,
  month: "",
  money: "",
  remarks: "",
  deviceheaderList: [
    {
      label: "1月",
      value: 1,
    },
    {
      label: "2月",
      value: 2,
    },
    {
      label: "3月",
      value: 3,
    },
    {
      label: "4月",
      value: 4,
    },
    {
      label: "5月",
      value: 5,
    },
    {
      label: "6月",
      value: 6,
    },
    {
      label: "7月",
      value: 7,
    },
    {
      label: "8月",
      value: 8,
    },

    {
      label: "9月",
      value: 9,
    },
    {
      label: "10月",
      value: 10,
    },

    {
      label: "11月",
      value: 11,
    },
    {
      label: "11月",
      value: 11,
    },
    {
      label: "12月",
      value: 12,
    },
  ],
});
// 附件下载
const handleDownload = (event: any) => {
  console.log(event.file);
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.href = event.file;
  a.download = "模板" + ".xlsx";
  a.style.display = "none";
  a.click();
  document.body.removeChild(a);
};
//上传附件
const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile);
};
//删除上传文件
const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  mainBodyForm.value.uploadshow = true;
};
//文件上传格式
const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(`只能上传一个附件，请先删除，在重新上传`);
};
//文件上传提交成功
const handleSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {
  console.log(res, uploadFile);
};
//删除上传文件
const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(`是否删除文件 ${uploadFile.name} ?`).then(
    () => true,
    () => false
  );
};
//上传文件
const upload = (param: any) => {
  loading.value = true;
  mainBodyForm.value.uploadshow = false;
  const formData = new FormData();
  formData.set("content", param.file);
  formData.set("type", "attachment");
  formData.set("name", param.file.name);
  createFeishuUpload(formData).then((res: any) => {
    if (JSON.parse(res.msg).data.code) {
      loading.value = false;
      mainBodyForm.value.fileCode = JSON.parse(res.msg).data.code;
    }
    mainBodyForm.value.cosUrl = JSON.parse(res.msg).cos_url;
    console.log(
      mainBodyForm.value.fileCode,
      "JSON.parse(res.msg).data.cos_url"
    );
  });
};
//提交表单
const addMainBody = async () => {
  if (!mainBodyForm.value) {
    return;
  }
  try {
    await mainBodyFormRef.value.validate();

    let data = {
      id: props.xmId,
      money: mainBodyForm.value.money,
      month: mainBodyForm.value.month,
      remarks: mainBodyForm.value.remarks,
      file: mainBodyForm.value.cosUrl,
    };
    getaccountAmountModification(data).then((res: any) => {
      if (res.code === 200) {
        mainBodyForm.value.money = "";
        mainBodyForm.value.month = "";
        mainBodyForm.value.remarks = "";
        ElMessage.success("新增成功");
        emit("closess");
        Bus.emit("closeerbudget", "1");
      }
    });
  } catch (err) {}
};
//序号
const indexMethod: any = (index: number) => {
  return index * 1 + 1;
};
onMounted(() => {
  //获取传递id
  if (props.xmId) {
    let data = {
      id: props.xmId,
    };
    //获取财务查看数据
    getqueryAccountInformation(data).then((res: any) => {
      budgetSubject.value = [];
      budgetSubject.value.push(res.data.budgetSubject);
    });
  }
});
</script>
<style scoped lang="scss">
@import "../css/index.scss";
</style>
