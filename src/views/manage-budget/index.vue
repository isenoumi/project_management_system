<template>
  <div class="app-container">
    <el-card>
      <div style="font-size: 20px; font-weight: 500">付款审批</div>
      <div style="font-size: 20px; font-weight: 600; margin-top: 30px">
        一级科目:{{ title.illustrate.fname }}
      </div>
      <div style="font-size: 20px; font-weight: 600; margin: 10px 0">
        二级科目:{{ title.illustrate.sname }}
      </div>
      <div style="font-size: 20px; font-weight: 600">
        三级科目:{{ header_data.threename }}
      </div>
      <div style="margin-top: 25px">
        <el-table
          :data="listData.list"
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
            :index="indexMethod"
            width="60"
          />
          <el-table-column prop="code" label="科目编号" width="90" />
          <el-table-column prop="name" label="预算科目类别" width="110" />
          <el-table-column prop="costAmount" label="预算费用合计" width="120" />
          <el-table-column prop="payAmount" label="付款费用合计" width="120" />
          <el-table-column
            prop="overExpenditure"
            label="是否超标"
            width="100"
          />
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
      </div>
      <div>
        <el-tabs
          v-model="activeName"
          type="border-card"
          class="demo-tabs"
          @tab-click="handleClick"
        >
          <el-tab-pane label="新增付款审批" name="first">
            <div class="add-careful">
              <div class="input">
                <div class="title">项目编号:</div>
                <el-input
                  disabled
                  v-model="header_data.projectCode"
                  placeholder="请输入项目编号"
                />
              </div>
              <div class="input">
                <div class="title">一级科目:</div>
                <el-input
                  disabled
                  v-model="header_data.onelevel"
                  placeholder="请输入一级科目"
                />
              </div>
              <div class="input">
                <div class="title">二级科目:</div>
                <el-input
                  disabled
                  v-model="header_data.secondary"
                  placeholder="请输入二级科目"
                />
              </div>
              <div class="input">
                <div class="title">三级科目:</div>
                <el-input
                  disabled
                  v-model="header_data.threename"
                  placeholder="请输入三级科目"
                />
              </div>
              <div class="input">
                <div class="title">所属月份:</div>
                <el-select
                  v-model="header_data.getMonth"
                  class="m-2"
                  @change="monthchange"
                  placeholder="请选择项目类型"
                >
                  <el-option
                    v-for="item in header_data.getNotNullMonthoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div class="input">
                <div class="title">
                  付款金额(剩余金额,{{ listData.money }}元):
                </div>
                <el-input
                  @input="handleInput"
                  v-model="header_data.payAmount"
                  type="number"
                  placeholder="请输入付款金额"
                />
              </div>
              <div class="input">
                <div class="title">起止时间:</div>
                <el-date-picker
                  @change="datechange"
                  v-model="header_data.startEndTime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </div>
              <div class="input">
                <div class="title">我方单位名称:</div>
                <el-input
                  v-model="header_data.ourUnitName"
                  placeholder="请输入我方单位名称"
                />
              </div>
              <div class="input">
                <div class="title">我方负责人:</div>
                <el-input
                  v-model="header_data.ourResponsibleName"
                  placeholder="请输入我方负责人"
                />
              </div>
              <div class="input">
                <div class="title">对方单位名称:</div>
                <el-input
                  v-model="header_data.otherUnitName"
                  placeholder="请输入对方单位名称"
                />
              </div>
              <div class="input">
                <div class="title">对方负责人:</div>
                <el-input
                  v-model="header_data.otherResponsibleName"
                  placeholder="请输入对方负责人"
                />
              </div>
              <div class="input">
                <div class="title">对方负责人联系方式:</div>
                <el-input
                  v-model="header_data.otherPhone"
                  placeholder="请输入对方负责人联系方式"
                />
              </div>
            </div>
            <div class="down">
              <el-upload
                v-loading="loading"
                v-model:file-list="form.fileList"
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
            </div>
            <div class="textarea">
              <div>申请备注信息：</div>
              <div class="input-textarea">
                <el-input
                  maxlength="1000"
                  placeholder="请输入申请备注信息"
                  show-word-limit
                  type="textarea"
                  v-model="textarea2"
                  :autosize="{ minRows: 6, maxRows: 8 }"
                />
              </div>
            </div>
            <div
              class="btn"
              style="display: flex; align-items: center; margin-top: 50px"
            >
              <el-button
                @click="submin"
                type="primary"
                :disabled="flag.show"
                style="margin-right: 15px"
                >确定</el-button
              >
              <el-button @click="reverted" type="info" plain>返回</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="付款审批记录" name="second">
            <el-table
              :data="tableData.list"
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
                :index="
                  (e) => e + 1 + (queryParams.pageNo - 1) * queryParams.pageSize
                "
              />
              <el-table-column prop="createByUsername" label="上传人" />
              <el-table-column prop="createTime" label="申请时间" />
              <el-table-column prop="payAmount" label="付款金额" />
              <el-table-column prop="getMonth" label="所属月份" />
              <el-table-column label="附件">
                <template #default="scope">
                  <el-button
                    type="primary"
                    :bg="false"
                    link
                    @click="handleEdit(scope.$index, scope.row)"
                    >下载</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column prop="applicationNotes" label="申请备注信息" />
              <el-table-column prop="examineTime" label="审批时间" />
              <el-table-column prop="examineBudget" label="审批预算" />
              <el-table-column prop="examineRemake" label="审批备注" />
              <el-table-column prop="examineStatus" label="审核状态" />
              <el-table-column prop="applicationNotes" label="备注" />
            </el-table>
            <div
              style="display: flex; justify-content: flex-end; margin-top: 20px"
            >
              <pagination
                v-if="listData.total > 0"
                v-model:total="listData.total"
                v-model:page="queryParams.pageNo"
                v-model:limit="queryParams.pageSize"
                @pagination="handleQuery"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>
<!-- 图标选择器示例 -->
<script setup lang="ts">
import {
  getitemname,
  getNotNullMonth,
  budgetExamine,
  getinsert,
  getspLits,
  getfeishuCreatesAnApproval,
  gettApprovaInstance,
} from "@/api/budget";
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { UploadProps } from "element-plus";
import { useRouter } from "vue-router";
import { createFeishuUpload } from "@/api/plan/feishu/index";
//选项卡切换
const activeName = ref("first");
//上传文件
const uploadData = ref({
  name: "文件",
  type: "attachment",
});
//加载状态
const loading = ref(false);
//路由
const route = useRoute();
//列表数据
const listData = reactive<any>({
  id: "",
  money: "0",
  list: [],
  total: 0,
  exceed: "",
});
//按钮禁用状态
const flag = reactive<any>({
  show: false,
});
//表单验证
function handleInput(value: any) {
  // 使用正则表达式验证输入值是否为正整数
  const pattern = /^[1-9]\d*$/;
  if (pattern.test(value)) {
    // 如果输入值为正整数，则直接将其赋值给 inputValue
    header_data.payAmount = value;
  } else {
    // 如果输入值不为正整数，则从中提取出数字，并将其拼接为一个字符串后赋值给 inputValue
    const num = value.match(/\d+/g);
    header_data.payAmount = num ? num.join("") : "";
  }
}
//页数和条数
const queryParams = reactive<any>({
  budgetSubjectId: "",
  pageNo: 1,
  pageSize: 10,
});
//一级科目二级科目三级科目名称
const title = reactive<object>({
  illustrate: {},
});
const value1 = ref<[Date, Date]>([new Date(), new Date()]);
//申请备注信息
const textarea2 = ref("");
//表格数据
const tableData = reactive({
  list: [],
});
//上传文件存储名字
const cosUrl = ref("");
//表单
const form = ref({
  projectCode: "",
  taskCode: "",
  subTaskCode: "",
  fileList: [],
  remark: "",
  schedule: "",
  fileCode: [],
});
//表单数据
const header_data: any = reactive({
  file: "",
  threename: "",
  threelevel: "",
  secondary: "",
  onelevel: "",
  projectCode: "",
  payAmount: 0,
  getMonth: 13,
  ourUnitName: "",
  ourResponsibleName: "",
  otherUnitName: "",
  otherResponsibleName: "",
  startEndTime: "",
  name: "",
  number: "",
  date: "",
  otherPhone: "",
  getNotNullMonthoptions: [],
});
//起止日期change事件
const datechange = (val: any) => {
  val = val.join(",");
};
//上传文件
const upload = (param: any) => {
  loading.value = true;
  const formData = new FormData();
  formData.set("content", param.file);
  formData.set("type", "attachment");
  formData.set("name", param.file.name);
  createFeishuUpload(formData).then((res: any) => {
    console.log(JSON.parse(res.msg));
    if (JSON.parse(res.msg).data.code) {
      loading.value = false;
      form.value.fileCode = JSON.parse(res.msg).data.code;
    }
    cosUrl.value = JSON.parse(res.msg).cos_url;
  });
};
//表格数据
function list() {
  let datas = {
    budgetSubjectId: listData.id,
    pageNo: queryParams.pageNo,
    pageSize: queryParams.pageSize,
  };
  if (listData.id) {
    getspLits(datas).then((response: any) => {
      response.data.records.map((v: any) => {
        if (v.examineStatus == "0") {
          v.examineStatus = "待审批";
        } else if (v.examineStatus == "1") {
          v.examineStatus = "审批通过";
        } else if (v.examineStatus == "2") {
          v.examineStatus = "未通过";
        }
      });
      tableData.list = response.data.records;
      listData.total = response.data.total;
    });
  }
}
//上传附件
const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile);
};
//序号
const indexMethod = (index: number) => {
  return index * 1 + 1;
};
//删除上传文件
const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};
//table点击事件
const handleClick = (tab: any, event: any) => {
  console.log(tab, event);
};
//月份changen事件
function monthchange(val: any) {
  let data = {
    budgetSubjectId: listData.id,
    monthNo: val,
  };
  budgetExamine(data).then((response: any) => {
    listData.money = Number(response.data) - Number(listData.list[0].payAmount);
  });
}
//文件上传提交成功
const handleSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {
  console.log(res, uploadFile);
};
//文件上传格式
const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  );
};
//删除上传文件
const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  );
};
//提交审批
function submin() {
  if (Number(header_data.payAmount) <= Number(listData.money)) {
    listData.exceed = "未超预算";
  } else {
    listData.exceed = "超预算";
  }
  if (!header_data.payAmount) {
    return ElMessage({ type: "info", message: "请输入付款金额" });
  }
  if (!header_data.startEndTime) {
    return ElMessage({ type: "info", message: "请输入起止时间" });
  }
  if (!header_data.ourUnitName) {
    return ElMessage({ type: "info", message: "请输入我方单位名称" });
  }
  if (!header_data.ourResponsibleName) {
    return ElMessage({ type: "info", message: "请输入我方负责人" });
  }
  if (!header_data.otherUnitName) {
    return ElMessage({ type: "info", message: "请输入对方单位名称" });
  }
  if (!header_data.otherResponsibleName) {
    return ElMessage({ type: "info", message: "请输入对方负责人" });
  }
  if (!header_data.otherPhone) {
    return ElMessage({ type: "info", message: "请输入对方负责人联系人" });
  }
  if (!header_data.payAmount && !header_data.getMonth && !value1) {
    return ElMessage({
      type: "info",
      message: "请选择起止时间和月份以及付款金额",
    });
  }
  if (!cosUrl.value) {
    return ElMessage({ type: "info", message: "请先上传附件" });
  }
  let data = {
    budgetSubjectId: listData.id,
    budgetExamineDto: {
      fastSubject: header_data.onelevel,
      thirdSubject: header_data.threename,
      secondSubject: header_data.secondary,
      projectcode: header_data.projectCode,
      payAmount: header_data.payAmount,
      getMonth: header_data.getMonth,
      startEndTime: header_data.startEndTime.join(","),
      ourUnitName: header_data.ourUnitName,
      ourResponsibleName: header_data.ourResponsibleName,
      otherUnitName: header_data.otherUnitName,
      otherResponsibleName: header_data.otherResponsibleName,
      otherPhone: header_data.otherPhone,
      file: "string",
      applicationNotes: textarea2._value,
      budgetSubjectId: listData.id,
      examineBudget: listData.money,
      budgetOverspend: listData.exceed,
    },
    budgetAmount: listData.money,
  };
  //提交飞书实例创建
  getinsert(data).then((response: any) => {
    flag.show = true;
    const list = [
      {
        id: "widget16913979976760001",
        type: "input",
        value: header_data.projectCode,
      },
      {
        id: "widget16913982947810001",
        type: "input",
        value: header_data.onelevel + "",
      },
      {
        id: "widget16913983103880001",
        type: "input",
        value: header_data.secondary + "",
      },
      {
        id: "widget16913983120360001",
        type: "input",
        value: header_data.threename + "",
      },
      {
        id: "widget16913993287970001",
        type: "input",
        value: header_data.getMonth + "",
      },
      {
        id: "widget16915444120570001",
        type: "input",
        value: header_data.payAmount + "",
      },
      {
        id: "widget16901849243650001",
        type: "attachmentV2",
        value: [form.value.fileCode],
      },
      {
        id: "widget16913980294030001",
        type: "input",
        value: header_data.ourUnitName,
      },
      {
        id: "widget16901848805320001",
        type: "input",
        value: header_data.otherUnitName,
      },
      {
        id: "widget16901848942380001",
        type: "input",
        value: header_data.otherResponsibleName,
      },
      {
        id: "widget16901849046290001",
        type: "input",
        value: header_data.otherPhone,
      },
      {
        id: "widget16901702754",
        type: "textarea",
        value: textarea2,
      },

      {
        id: "widget16920046990900001",
        type: "input",
        value: listData.exceed,
      },
    ];
    //用户信息
    const user = JSON.parse(localStorage.getItem("users"));
    //飞书实例数据格式
    const formData = new FormData();
    formData.append("params", JSON.stringify(list));
    formData.append("approvalCode", "C67758A3-7B95-4C18-BF1D-B5C3DE320D07");
    formData.append("feishuUserId", user.feishuUserId);
    //提交审批创建飞书实例
    getfeishuCreatesAnApproval(formData).then((res: any) => {
      if (res.code == 200) {
        ElMessage({
          type: "success",
          message: "提交成功",
        });
        const result = JSON.parse(res.msg);
        //提交飞书信息录入
        gettApprovaInstance({
          instanceCode: result.data.instance_code,
          attachment: cosUrl.value, //附件
          sourceId: response.data,
          sourceType: "ProjectBudget",
          sourceBy: localStorage.getItem("username"),
          budgetExamineId: response.data,
        }).then((res: any) => {
          if (res.code === 200) {
            flag.show = false;
            window.history.go(-1);
          }
        });
      }
    });
  });
}
//分页刷新页面
function handleQuery() {
  list();
}
//返回上一页
function reverted() {
  window.history.go(-1);
}
onMounted(() => {
  listData.list = [];
  header_data.threename = route.query.name;
  //获取来自上个页面传递的表格数据
  let data = {
    code: route.query.code,
    name: route.query.name,
    costAmount: route.query.costAmount,
    payAmount: route.query.payAmount,
    overExpenditure: route.query.overExpenditure,
    januaryCost: route.query.januaryCost,
    februaryCost: route.query.februaryCost,
    marchCost: route.query.marchCost,
    aprilCost: route.query.aprilCost,
    mayCost: route.query.mayCost,
    juneCost: route.query.juneCost,
    julyCost: route.query.julyCost,
    augustCost: route.query.augustCost,
    septemberCost: route.query.septemberCost,
    octoberCost: route.query.octoberCost,
    novemberCost: route.query.novemberCost,
    decemberCost: route.query.decemberCost,
  };
  listData.list.push(data);
  listData.id = route.query.id;
  //月份调用
  getitemname(listData.id).then((response: any) => {
    title.illustrate = response.data;
    header_data.onelevel = response.data.fname;
    header_data.secondary = response.data.sname;
    header_data.projectCode = response.data.projectCode;
  });
  list();
  getNotNullMonth(listData.id).then((response: any) => {
    header_data.getNotNullMonthoptions = response.data;
  });
});
</script>
<style lang="scss" scoped>
@import "./css/index.scss";
</style>
