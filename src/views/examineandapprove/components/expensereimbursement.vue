<template>
  <div v-loading="loading">
    <div
      v-for="(item, index) in formReport.list"
      :key="index"
      class="list-form"
    >
      <div class="add-carefuls">
        <div class="inputs">
          <div class="title">科目*:</div>
          <el-select
            v-model="item.oneLevel"
            class="m-2"
            placeholder="请选择一级科目"
            @change="oneChange(item.oneLevel, index)"
          >
            <el-option
              v-for="(items, index) in item.oneSubject"
              :key="index"
              :label="items.label"
              :value="items.value"
            />
          </el-select>
          <el-select
            v-model="item.secondary"
            class="m-2"
            @change="twoChange(item.secondary, index)"
            placeholder="请选择二级科目"
          >
            <el-option
              v-for="(items, index) in item.twoSubject"
              :key="index"
              :label="items.label"
              :value="items.value"
            />
          </el-select>
          <el-select
            v-model="item.threeLevel"
            class="m-2"
            @change="threeChange(item.threeLevel, index)"
            placeholder="请选择三级科目"
          >
            <el-option
              v-for="(items, index) in item.threeSubject"
              :key="index"
              :label="items.label"
              :value="items.value"
            />
          </el-select>
        </div>
        <div>
          <el-button
            v-if="index + 1 == formReport.list.length"
            type="primary"
            @click="reportItem(index)"
          >
            添加付款审批
          </el-button>
          <el-button
            v-if="index !== 0"
            type="danger"
            @click="deletereport(item, index)"
          >
            删除
          </el-button>
        </div>
      </div>
      <div style="margin-top: 25px">
        <el-table
          :data="item.datalist"
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
      <div class="add-carefuls">
        <div class="inputs">
          <div class="title">所属月份:</div>
          <el-select
            :disabled="item.monthshow"
            style="width: 180px"
            v-model="item.getMonth"
            @change="monthChange(item.getMonth, index, item.datalist)"
            class="m-2"
            placeholder="请选择所属月份"
          >
            <el-option
              v-for="items in item.getNotNullMonthoptions"
              :key="items.value"
              :label="items.label"
              :value="items.value"
            />
          </el-select>
        </div>
        <div class="inputs">
          <div class="title">付款金额:</div>
          <el-input
            style="width: 180px"
            :disabled="item.monthshow"
            v-model="item.payAmount"
            type="number"
            placeholder="请输入付款金额"
          />
        </div>

        <div class="inputs">
          <div class="title">付款日期:</div>
          <el-date-picker
            :disabled="item.monthshow"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 180px"
            v-model="item.paymentDate"
            type="date"
            placeholder="请选择时间"
          />
        </div>
      </div>
      <div class="down">
        <el-upload
          v-model="item.cosUrl"
          v-model:file-list="item.fileList"
          class="upload-demo"
          :data="{ index }"
          action=""
          :http-request="upload"
          multiple
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-success="handleUploadSuccess"
          :on-change="uploadChange"
          :limit="1"
          :on-exceed="handleExceed"
          :show-file-list="true"
        >
          <el-button text type="primary" @click="btnupload(index)"
            >上传附件</el-button
          >
        </el-upload>
      </div>
      <div class="add-carefuls">
        <div class="textarea">
          <div>费用内容：</div>
          <div class="input-textarea">
            <el-input
              :disabled="item.monthshow"
              maxlength="1000"
              placeholder="请输入付款事由"
              show-word-limit
              type="textarea"
              v-model="item.paymentRemarks"
              :autosize="{ minRows: 6, maxRows: 8 }"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="btn"
      style="display: flex; align-items: center; margin-top: 50px"
    >
      <el-button
        @click="paymentcontractSubmin()"
        type="primary"
        :disabled="flag.show"
        style="margin-right: 15px"
        >保存</el-button
      >
      <el-button @click="reverted" type="info" plain>返回</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import type { UploadProps } from "element-plus";
import { createFeishuUpload } from "@/api/plan/feishu/index";
import {
  getlevel1Subjects,
  getlevel2Subjects,
  getbudpage,
  getsubmitFeeApply,
  getfeishuCreatesAnApproval,
  gettApprovaInstance,
} from "@/api/budget";
import { useRoute } from "vue-router";
const route = useRoute();
const loading = ref(false);
const submitList = ref<any>([
  {
    code: "",
    id: "",
  },
]);
//按钮禁用状态
const flag = reactive<any>({
  show: false,
  showupload: true,
});
const datalist = reactive<any>({
  fileCode: [],
  cosUrl: "",
  id: "",
  projectId: "",
  peojectId: "",
  num: 0,
});
//费用报销
const formReport = ref<any>({
  list: [
    {
      fileCode: [],
      loading: false,
      cosUrl: "",
      //一级科目
      oneLevel: "",
      //二级科目
      secondary: "",
      //三级科目
      threeLevel: "",
      //所属月份
      getMonth: "",
      //付款金额
      payAmount: "0",
      //付款时间
      paymentDate: "",
      //付款事由
      paymentRemarks: "",
      //上传附件
      fileList: [],
      //一级科目列表
      oneSubject: [],
      //二级科目列表
      twoSubject: [],
      //三级科目列表
      threeSubject: [],
      //表格数据
      datalist: [],
      monthshow: true,
      showupload: true,
      //所属月份列表
      getNotNullMonthoptions: [
        {
          label: "全月份",
          value: "12",
        },
        {
          label: "1月",
          value: "1",
        },
        {
          label: "2月",
          value: "2",
        },
        {
          label: "3月",
          value: "3",
        },
        {
          label: "4月",
          value: "4",
        },
        {
          label: "5月",
          value: "5",
        },
        {
          label: "6月",
          value: "6",
        },
        {
          label: "7月",
          value: "7",
        },
        {
          label: "8月",
          value: "8",
        },
        {
          label: "9月",
          value: "9",
        },
        {
          label: "10月",
          value: "10",
        },
        {
          label: "11月",
          value: "11",
        },
      ],
    },
  ],
});
//新增费用报销
const reportItem = (index: any) => {
  formReport.value.list.splice(index + 1, 0, {
    fileCode: [],
    loading: false,
    cosUrl: "",
    //一级科目
    oneLevel: "",
    //二级科目
    secondary: "",
    //三级科目
    threeLevel: "",
    //所属月份
    getMonth: "",
    //付款金额
    payAmount: "0",
    //付款时间
    paymentDate: "",
    //付款事由
    paymentRemarks: "",
    //上传附件
    fileList: [],
    //一级科目列表
    oneSubject: formReport.value.list[0].oneSubject,
    //二级科目列表
    twoSubject: formReport.value.list[0].twoSubject,
    //三级科目列表
    threeSubject: formReport.value.list[0].threeSubject,
    //表格数据
    datalist: [],
    monthshow: true,
    showupload: true,
    //所属月份列表
    getNotNullMonthoptions: [
      {
        label: "全月份",
        value: "12",
      },
      {
        label: "1月",
        value: "1",
      },
      {
        label: "2月",
        value: "2",
      },
      {
        label: "3月",
        value: "3",
      },
      {
        label: "4月",
        value: "4",
      },
      {
        label: "5月",
        value: "5",
      },
      {
        label: "6月",
        value: "6",
      },
      {
        label: "7月",
        value: "7",
      },
      {
        label: "8月",
        value: "8",
      },
      {
        label: "9月",
        value: "9",
      },
      {
        label: "10月",
        value: "10",
      },
      {
        label: "11月",
        value: "11",
      },
    ],
  });
};
//删除费用报销
const deletereport = (item: any, index: any) => {
  formReport.value.list.splice(index, 1);
};
//返回
const reverted = () => {
  window.history.go(-1);
};
//保存
const paymentcontractSubmin = () => {
  let num = "";
  let moon = "";
  let date = "";
  let annex = "";
  let notes = "";
  let data: any = {
    budgetId: datalist.id,
    addReqs: [],
  };
  formReport.value.list.map((v: any) => {
    let list: any = {
      fileCode: datalist.fileCode,
      getMonth: v.getMonth,
      file: v.cosUrl,
      applicationNotes: v.paymentRemarks,
      paymentDate: v.paymentDate,
      budgetSubjectId: v.threeLevel,
      payAmount: v.payAmount,
    };
    data.addReqs.push(list);
  });
  data.addReqs.map((item: any) => {
    if (!item.budgetSubjectId) {
      num = "0";
    }
    if (!item.getMonth) {
      moon = "1";
    }
    if (!item.paymentDate) {
      date = "1";
    }
    if (!item.file) {
      annex = "1";
    }
    if (!item.applicationNotes) {
      notes = "1";
    }
  });
  if (num === "0") {
    return ElMessage({
      type: "error",
      message: "请先选择科目",
    });
  }
  if (moon === "1") {
    return ElMessage({
      type: "error",
      message: "请选择所属月份",
    });
  }
  if (date === "1") {
    return ElMessage({
      type: "error",
      message: "请选择付款日期",
    });
  }
  if (annex === "1") {
    return ElMessage({
      type: "error",
      message: "请上传附件",
    });
  }
  if (notes === "1") {
    return ElMessage({
      type: "error",
      message: "请输入费用内容",
    });
  }
  getsubmitFeeApply(data).then((response: any) => {
    if (response.code === 200) {
      loading.value = true;
      submitList.value = [];
      formReport.value.list.map((v: any) => {
        v.getNotNullMonthoptions.map((v1: any) => {
          if (v1.value === "12") {
            v.getMonth = v1.label;
          }
        });
        v.oneSubject.map((v1: any) => {
          if (v1.value === v.oneLevel) {
            v.oneLevel = v1.label;
          }
        });

        v.twoSubject.map((v1: any) => {
          if (v1.value === v.secondary) {
            v.secondary = v1.label;
          }
        });
        v.threeSubject.map((v1: any) => {
          if (v1.value === v.threeLevel) {
            v.threeLevel = v1.label;
          }
        });
        const user = JSON.parse(localStorage.getItem("users") || "");
        const formData = new FormData();
        //合同付款审批
        const contractPaymentList = [
          // 正式环境
          //一级科目
          {
            id: "widget16974549110580001",
            type: "input",
            value: v.oneLevel + "",
          },
          //二级科目
          {
            id: "widget16974549127840001",
            type: "input",
            value: v.secondary + "",
          },
          //三级科目
          {
            id: "widget16974549144730001",
            type: "input",
            value: v.threeLevel + "",
          },
          //科目编号
          {
            id: "widget16974549160020001",
            type: "input",
            value: v.datalist[0].code + "",
          },
          //是否超标
          {
            id: "widget16974549720580001",
            type: "input",
            value: v.datalist[0].overExpenditure + "",
          },
          //预算费用合计
          {
            id: "widget16974549862170001",
            type: "amount",
            currency: "CNY",
            value: Number(v.datalist[0].costAmount),
          },
          //付款费用合计
          {
            id: "widget16974550002400001",
            type: "amount",
            currency: "CNY",
            value: Number(v.datalist[0].payAmount),
          },
          //付款金额
          {
            id: "widget16974550128390001",
            type: "amount",
            currency: "CNY",
            value: Number(v.payAmount),
          },
          //所属月份
          {
            id: "widget16974550260630001",
            type: "input",
            value: v.getMonth + "",
          },
          //付款日期
          {
            id: "widget16974550441430001",
            type: "input",
            value: v.paymentDate + "",
          },

          //费用内容
          {
            id: "widget16974550668320001",
            type: "textarea",
            value: v.paymentRemarks + "",
          },
          //附件
          {
            id: "widget16974550780480001",
            type: "attachmentV2",
            value: [v.fileCode],
          },
          // 测试环境
          //一级科目
          // {
          //     id: "widget16966625021120001",
          //     type: "input",
          //     value: v.oneLevel + "",
          // },
          // //二级科目
          // {
          //     id: "widget16966625026480001",
          //     type: "input",
          //     value: v.secondary + "",
          // },
          // //三级科目
          // {
          //     id: "widget16966625029140001",
          //     type: "input",
          //     value: v.threeLevel + "",
          // },
          // //科目编号
          // {
          //     id: "widget16966616481200001",
          //     type: "input",
          //     value: v.datalist[0].code + "",
          // },
          // //是否超标
          // {
          //     id: "widget16967474861330001",
          //     type: "input",
          //     value: v.datalist[0].overExpenditure + "",
          // },
          // //预算费用合计
          // {
          //     id: "widget16966635801270001",
          //     type: "amount",
          //     currency: "CNY",
          //     value: Number(v.datalist[0].costAmount),
          // },
          // //付款费用合计
          // {
          //     id: "widget16966627222780001",
          //     type: "amount",
          //     currency: "CNY",
          //     value: Number(v.datalist[0].payAmount),
          // },
          // //付款金额
          // {
          //     id: "widget16966629516540001",
          //     type: "amount",
          //     currency: "CNY",
          //     value: Number(v.payAmount),
          // },
          // //所属月份
          // {
          //     id: "widget16967457818330001",
          //     type: "input",
          //     value: v.getMonth + "",
          // },
          // //付款日期
          // {
          //     id: "widget16967458051480001",
          //     type: "input",
          //     value: v.paymentDate + "",
          // },

          // //费用内容
          // {
          //     id: "widget16510509704570001",
          //     type: "textarea",
          //     value: v.paymentRemarks + "",
          // },
          // //附件
          // {
          //     id: "widget16966629163720001",
          //     type: "attachmentV2",
          //     value: [v.fileCode],
          // },
        ];
        const contractPaymentListTest = [
          //  一级科目
          {
            id: "widget16966625021120001",
            type: "input",
            value: v.oneLevel + "",
          },
          //二级科目
          {
            id: "widget16966625026480001",
            type: "input",
            value: v.secondary + "",
          },
          //三级科目
          {
            id: "widget16966625029140001",
            type: "input",
            value: v.threeLevel + "",
          },
          //科目编号
          {
            id: "widget16966616481200001",
            type: "input",
            value: v.datalist[0].code + "",
          },
          //是否超标
          {
            id: "widget16967474861330001",
            type: "input",
            value: v.datalist[0].overExpenditure + "",
          },
          //预算费用合计
          {
            id: "widget16966635801270001",
            type: "amount",
            currency: "CNY",
            value: Number(v.datalist[0].costAmount),
          },
          //付款费用合计
          {
            id: "widget16966627222780001",
            type: "amount",
            currency: "CNY",
            value: Number(v.datalist[0].payAmount),
          },
          //付款金额
          {
            id: "widget16966629516540001",
            type: "amount",
            currency: "CNY",
            value: Number(v.payAmount),
          },
          //所属月份
          {
            id: "widget16967457818330001",
            type: "input",
            value: v.getMonth + "",
          },
          //付款日期
          {
            id: "widget16967458051480001",
            type: "input",
            value: v.paymentDate + "",
          },

          //费用内容
          {
            id: "widget16510509704570001",
            type: "textarea",
            value: v.paymentRemarks + "",
          },
          //附件
          {
            id: "widget16966629163720001",
            type: "attachmentV2",
            value: [v.fileCode],
          },
        ];

        // TODO 费用报销
        // 正式环境
        // formData.append("params", JSON.stringify(contractPaymentList));
        // formData.append("approvalCode", "8FDE492B-9904-4215-A087-EFA25B36282A");

        // 测试环境
        formData.append("approvalCode", "CBFD1CE5-1714-4028-A6ED-34402117B74D");
        formData.append("params", JSON.stringify(contractPaymentListTest));

        formData.append("feishuUserId", user.feishuUserId);
        // 提交审批创建飞书实例
        getfeishuCreatesAnApproval(formData).then((res: any) => {
          if (res.code == 200) {
            const result = JSON.parse(res.msg);
            console.log(result, "xxx");
            response.data.forEach((v1: any) => {
              const responseList = {
                id: result.data.instance_code,
                code: v1,
                fileUrl: v.cosUrl,
              };
              submitList.value.push(responseList);
            });
          }
        });
      });
      setTimeout(() => {
        let data = [];
        var repeatobj: any = {};
        data = submitList.value.reduce(function (item: any, next: any) {
          repeatobj[next.id]
            ? ""
            : (repeatobj[next.id] =
                true && repeatobj[next.code]
                  ? ""
                  : (repeatobj[next.code] =
                      true && repeatobj[next.fileUrl]
                        ? ""
                        : (repeatobj[next.fileUrl] = true && item.push(next))));
          return item;
        }, []);
        data.forEach((item: any) => {
          gettApprovaInstance({
            instanceCode: item.id,
            attachment: item.fileUrl, //附件
            sourceId: item.code,
            sourceType: "ProjectBudget",
            sourceBy: localStorage.getItem("username"),
            budgetExamineId: item.code,
          }).then((res: any) => {
            loading.value = false;
            if (res.code === 200) {
              formReport.value.list = [
                {
                  loading: false,
                  cosUrl: "",
                  //一级科目
                  oneLevel: "",
                  //二级科目
                  secondary: "",
                  //三级科目
                  threeLevel: "",
                  //所属月份
                  getMonth: "",
                  //付款金额
                  payAmount: "0",
                  //付款时间
                  paymentDate: "",
                  //付款事由
                  paymentRemarks: "",
                  //上传附件
                  fileList: [],
                  //一级科目列表
                  oneSubject: formReport.value.list[0].oneSubject,
                  //二级科目列表
                  twoSubject: formReport.value.list[0].twoSubject,
                  //三级科目列表
                  threeSubject: formReport.value.list[0].threeSubject,
                  //表格数据
                  datalist: [],
                  monthshow: true,
                  showupload: true,
                  //所属月份列表
                  getNotNullMonthoptions: [
                    {
                      label: "1月",
                      value: "1",
                    },
                    {
                      label: "2月",
                      value: "2",
                    },
                    {
                      label: "3月",
                      value: "3",
                    },
                    {
                      label: "4月",
                      value: "4",
                    },
                    {
                      label: "5月",
                      value: "5",
                    },
                    {
                      label: "6月",
                      value: "6",
                    },
                    {
                      label: "7月",
                      value: "7",
                    },
                    {
                      label: "8月",
                      value: "8",
                    },
                    {
                      label: "9月",
                      value: "9",
                    },
                    {
                      label: "10月",
                      value: "10",
                    },
                    {
                      label: "11月",
                      value: "11",
                    },
                    {
                      label: "12月",
                      value: "12",
                    },
                  ],
                },
              ];
              return ElMessage({
                type: "success",
                message: "提交审批成功",
              });
            }
            return ElMessage({
              type: "success",
              message: "提交审批成功",
            });
          });
        });
      }, 2000);
    }
  });
};
//上传文件
const upload = (param: any) => {
  flag.showupload = false;
  loading.value = true;
  formReport.value.list[datalist.num].loading = true;
  const formData = new FormData();
  formData.set("content", param.file);
  formData.set("type", "attachment");
  formData.set("name", param.file.name);
  createFeishuUpload(formData).then((res: any) => {
    if (JSON.parse(res.msg).data.code) {
      loading.value = false;
      formReport.value.list[datalist.num].loading = false;
      datalist.fileCode = JSON.parse(res.msg).data.code;
      formReport.value.list[datalist.num].fileCode = JSON.parse(
        res.msg
      ).data.code;
    }
    formReport.value.list[datalist.num].cosUrl = JSON.parse(res.msg).cos_url;
    datalist.cosUrl = JSON.parse(res.msg).cos_url;
  });
};
//上传附件
const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile);
};
//删除上传文件
const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  flag.showupload = true;
};
//删除上传文件
const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(`是否删除文件 ${uploadFile.name} ?`).then(
    () => true,
    () => false
  );
};
//文件上传提交成功
const btnupload = (index: any) => {
  datalist.num = index;
};
const handleUploadSuccess = (fileList: any, row: any, index: any) => {
  console.log(fileList, row, index);
};
const uploadChange = (uploadFile: any, uploadFiles: any, response: any) => {
  console.log(uploadFile, uploadFiles);
};
//文件上传格式
const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning("超出文件上传数量,请先删除原来文件在重新上传");
};
//序号
const indexMethod = (index: number) => {
  return index * 1 + 1;
};
//获取一级科目下拉
const getlevel1Subject = () => {
  let data = {
    projectId: datalist.peojectId,
  };
  getlevel1Subjects(data).then((res: any) => {
    if (res.code === 200) {
      formReport.value.list.map((v: any) => {
        v.oneSubject = res.data;
      });
    }
  });
};
//一级科目下拉改变
const oneChange = (e: any, index: any) => {
  let data = {
    id: e,
  };
  getlevel2Subjects(data).then((res: any) => {
    if (res.code === 200) {
      formReport.value.list.map((v: any) => {
        v.twoSubject = res.data;
      });
      formReport.value.list[index].secondary = "";
      formReport.value.list[index].threeLevel = "";
    }
  });
};
//二级科目下拉获取
const twoChange = (e: any, index: any) => {
  let data = {
    id: e,
  };
  getlevel2Subjects(data).then((res: any) => {
    if (res.code === 200) {
      formReport.value.list[index].threeSubject = res.data;
      formReport.value.list[index].threeLevel = "";
    }
  });
};
//三级科目下拉
const threeChange = (e: any, index: any) => {
  let data = {
    id: e,
  };
  getbudpage(data).then((res: any) => {
    if (res.code === 200) {
      if (res.data.overExpenditure === 0) {
        res.data.overExpenditure = "未超过";
      } else if (res.data.overExpenditure === 1) {
        res.data.overExpenditure = "超过";
      }
      let list = [];
      list.push(res.data);
      formReport.value.list[index].datalist = [];
      formReport.value.list[index].datalist = list;
    }
    formReport.value.list[index].monthshow = false;
  });
};
//月份下拉
const monthChange = (e: any, index: any, data: any) => {};
//初始化
onMounted(() => {
  if (route.query.id) {
    datalist.id = route.query.id;
    datalist.peojectId = route.query.peojectId;
    datalist.projectId = route.query.projectId;
  }
  //一级科目下拉
  getlevel1Subject();
});
</script>
<style lang="scss" scoped>
@import "../css/examineandapprove.scss";
</style>
