<template>
  <div style="margin-top: 20px" v-loading="loading">
    <el-form
      v-if="formShow"
      :inline="false"
      ref="mainBodyFormRef"
      label-position="right"
      label-width="140"
      :model="mainBodyForm"
      :rules="rules"
    >
      <el-form-item label="优先级: " prop="priorityLevel">
        <el-select
          v-model="mainBodyForm.priorityLevel"
          style="width: 210px; margin-top: -1px"
          class="m-2"
          clearable
          filterable
          placeholder="请选择优先级"
        >
          <el-option
            v-for="(items, index) in options.planPriorityOptions"
            :key="index"
            @click="priorityLevelChange(items)"
            :label="items.label"
            :value="items.value"
          />
        </el-select>
      </el-form-item>

      <div style="margin: 20px 0; width: 400px">
        <el-form-item label="所需支持最晚时间: " prop="supportLatestTime">
          <el-date-picker
            :disabled-date="disabledDate"
            v-model="mainBodyForm.supportLatestTime"
            format="YYYY-MM-DD HH:mm:ss "
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetime"
            placeholder="请选择所需支持最晚时间"
          />
        </el-form-item>
      </div>
      <div style="width: 400px">
        <el-form-item label="所需支持描述: " prop="supportDescription">
          <el-input
            maxlength="1000"
            placeholder="请输入所需支持描述"
            show-word-limit
            type="textarea"
            v-model="mainBodyForm.supportDescription"
            :autosize="{ minRows: 6, maxRows: 8 }"
          />
        </el-form-item>
      </div>
      <div style="margin-top: 20px">
        <!-- <el-form-item label="上传附件: " prop="fileList" style="margin-top: 25px;">
                    <view>
                        <el-upload v-model:file-list="mainBodyForm.fileList" class="upload-demo" :data="uploadData"
                            action="" :http-request="upload" multiple :on-preview="handlePreview" :on-remove="handleRemove"
                            :before-remove="beforeRemove" :before-upload="beforeAvatarUpload" :on-success="handleSuccess"
                            :on-exceed="handleExceed" :show-file-list="true">
                            <el-button style="margin-top: 14px;" type="primary">上传附件</el-button>
                        </el-upload>
                    </view>

                </el-form-item> -->
        <el-form-item label="上传附件: " style="margin-top: 20px">
          <view>
            <el-upload
              v-model:file-list="mainBodyForm.fileList"
              class="upload-demo"
              :data="uploadData"
              action=""
              :http-request="upload"
              multiple
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :before-upload="beforeAvatarUpload"
              :on-success="handleSuccess"
              :on-exceed="handleExceed"
              :show-file-list="true"
            >
              <el-button text type="primary">上传附件</el-button>
            </el-upload>
          </view>
        </el-form-item>
      </div>
      <div style="margin: 20px 0">
        <el-form-item label="选择支持人: " prop="supportDeptId">
          <el-cascader
            ref="articleOrgRef"
            style="width: 210px; margin-top: -10px"
            v-model="mainBodyForm.supportDeptId"
            :options="mainBodyForm.departmentList"
            @change="handleChange"
          />
          <el-select
            v-model="mainBodyForm.supportUserId"
            style="width: 210px; margin-top: -1px"
            class="m-2"
            clearable
            filterable
            placeholder="请选择所属人"
          >
            <el-option
              v-for="(items, index) in mainBodyForm.supportUserList"
              :key="index"
              @click="supportUserChange(items)"
              :label="items.name"
              :value="items.id"
            />
          </el-select>
        </el-form-item>
      </div>
      <el-form-item class="btn">
        <el-button type="primary" @click="addMainBody"> 保存 </el-button>
        <el-button @click="reverted">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { UploadProps } from "element-plus";
import { createFeishuUpload } from "@/api/plan/feishu/index";
import { listDeptOptions } from "@/api/dept";
import {
  getpreSalesSupportInsert,
  getpreSalesSupportEdite,
} from "@/api/presales/index";
import { getDepartmentPerson } from "@/api/fullCalendar/index";
import { getfeishuCreatesAnApproval, gettApprovaInstance } from "@/api/budget";
import { useRoute } from "vue-router";
import Bus from "@/views/projectbudget/js/Bus";
//路由
const route = useRoute();
//传递售前支持id
const proId = ref<any>("");
// 主体form ref
const mainBodyFormRef = ref<any>(null);
//表单绑定ref
const articleOrgRef = ref<any>(null);
//提交数组
const submitList = ref<any>([]);
//表单状态
const formShow = ref<any>(false);
//上传文件
const uploadData = ref({
  name: "文件",
  type: "attachment",
});
// 加载状态
const loading = ref(false);

// 主体form
const mainBodyForm = ref<any>({
  supportDeptId: "",
  supportDeptName: "",
  departmentList: [
    {
      value: "0c96c08c4a1192a8ca47196b188a187a",
      label: "项目部",
      children: [
        {
          value: "e2100ccd9205c26da26da83ddbbacf46",
          label: "项目部负责人",
        },
      ],
    },
  ],
  supportUserId: "",
  supportUserName: "",
  supportUserList: [],
  fileList: [],
  priorityLevel: "",
  priorityLevelName: "",
  supportLatestTime: "",
  supportDescription: "",
  fileCode: [],
  cosUrl: [],
  id: "",
});
//获取再次提交售前支持数据
Bus.on("editPro", (row: any) => {
  if (row.id) {
    console.log(row, "回显");
    mainBodyForm.value.fileList = [];
    mainBodyForm.value.fileCode = [];
    options.value.planPriorityOptions.map((v: any) => {
      if (row.priorityLevel === v.value) {
        mainBodyForm.value.priorityLevelName = v.label;
      }
    });

    mainBodyForm.value.id = row.id;
    mainBodyForm.value.priorityLevel = row.priorityLevel;
    mainBodyForm.value.supportLatestTime = row.supportLatestTime;
    mainBodyForm.value.supportDescription = row.supportDescription;
    mainBodyForm.value.supportUserId = row.supportUserId;
    mainBodyForm.value.supportDeptId = row.supportDeptId;
    mainBodyForm.value.cosUrl = row.files;
    mainBodyForm.value.fileCode = row.fileCode;

    row.files.map((v: any) => {
      let data = {
        name: "附件",
        url: v,
      };
      mainBodyForm.value.fileList.push(data);
    });
    console.log(mainBodyForm.value.fileList, "回显filecode");
    handleChange(row.supportDeptId);
    // if (row.files) {
    //     //附件上传
    //     let fileList = [
    //         {
    //             name: '附件',
    //             url: row.files,
    //         },
    //     ]
    //     mainBodyForm.value.fileList = fileList
    // }
  }
});
// form规则
const rules = reactive({
  supportDescription: [{ required: true, message: "请输入所需支持描述" }],
  priorityLevel: [
    { required: true, message: "请选择优先级", trigger: "change" },
  ],
  supportLatestTime: [
    {
      type: "date",
      required: true,
      message: "所需支持最晚时间",
      trigger: "change",
    },
  ],
  supportDeptId: [{ required: true, message: "请选择支持人" }],
  // fileList: [{ required: true, message: '请上传凭证', trigger: 'blur' }]
});
//优先级选择
const priorityLevelChange = (e: any) => {
  mainBodyForm.value.priorityLevelName = e.label;
};
//禁用当前日期之前的日期
const disabledDate = (time: any) => {
  //Date.now()是javascript中的内置函数，它返回自1970年1月1日00:00:00 UTC以来经过的毫秒数。
  return time.getTime() < Date.now() - 8.64e7;
};
//支持人
const supportUserChange = (e: any) => {
  mainBodyForm.value.supportUserName = e.name;
};
//获取优先级
const options = ref({
  planPriorityOptions: [{ value: "", label: "" }],
  salespersonOptions: [{ value: "", label: "" }],
});
//上传附件
const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log("uploadFile", uploadFile);
};

//删除上传文件
const handleRemove: UploadProps["onRemove"] = (file, fileList) => {
  console.log(file, fileList, "file,fileList");

  // mainBodyForm.value.fileList.splice(index)
  // mainBodyForm.value.fileCode.splice(index, 1)
  // mainBodyForm.value.uploadshow = true;
  mainBodyForm.value.fileList = fileList;
  console.log(mainBodyForm.value.fileList, " mainBodyForm.value.fileList");
};
//文件上传格式
const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(`只能上传一个附件，请先删除，在重新上传`);
};
//文件上传提交成功
const handleSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {
  console.log(res, "上传");
  mainBodyForm.value.fileList = res.data.url;
};
//限制上传文件大小
const beforeAvatarUpload = (file: any) => {
  console.log("文件：：：" + file);
  const isLtXM = file.size / 1024 / 1024 < 1000;
  if (!isLtXM) {
    ElMessage.warning(`上传文件大小不能超过 1GB!`);
  }
  return isLtXM;
};
//删除上传文件
const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles, "删除");
  return ElMessageBox.confirm(`是否删除文件 ${uploadFile.name} ?`).then(
    () => true,
    () => false
  );
};
//返回
const reverted = () => {
  window.history.go(-1);
};
//上传文件
const upload = (param: any) => {
  loading.value = true;
  const formData = new FormData();
  formData.set("content", param.file);
  formData.set("type", "attachment");
  formData.set("name", param.file.name);
  createFeishuUpload(formData).then((res: any) => {
    if (JSON.parse(res.msg).data.code) {
      console.log(
        JSON.parse(res.msg).data.code,
        "JSON.parse(res.msg).data.code"
      );
      loading.value = false;
      // mainBodyForm.value.fileCode = JSON.parse(res.msg).data.code;
      mainBodyForm.value.fileCode.push(JSON.parse(res.msg).data.code);
      // [...JSON.parse(res.msg).data.code]
      mainBodyForm.value.cosUrl.push(JSON.parse(res.msg).data.url);
      // mainBodyForm.value.cosUrl = JSON.parse(res.msg).data.url;
    }
  });
};
//保存
const addMainBody = async () => {
  if (!mainBodyForm.value) {
    return;
  }
  try {
    await mainBodyFormRef.value.validate();
    console.log(mainBodyForm.value.fileCode);
    loading.value = true;
    console.log();
    if (mainBodyForm.value.id) {
      let data = {
        hostId: mainBodyForm.value.id,
        priorityLevel: mainBodyForm.value.priorityLevel,
        supportLatestTime: mainBodyForm.value.supportLatestTime,
        supportDescription: mainBodyForm.value.supportDescription,
        files: mainBodyForm.value.cosUrl,
        fileCode: mainBodyForm.value.fileCode,
        supportUserId: mainBodyForm.value.supportUserId,
        supportDeptId: mainBodyForm.value.supportDeptId,
        supportUserName: mainBodyForm.value.supportUserName,
        projectId: proId.value,
      };
      getpreSalesSupportEdite(data).then((response: any) => {
        if (response.code === 200) {
          let contractPaymentList = [
            //优先级
            {
              id: "widget17035833299380001",
              type: "input",
              value: mainBodyForm.value.priorityLevelName + "",
            },

            //所需支持最晚时间
            {
              id: "widget17036394212160001",
              type: "input",
              value: mainBodyForm.value.supportLatestTime + "",
            },

            //所属支持描述
            {
              id: "widget17035835435020001",
              type: "textarea",
              value: mainBodyForm.value.supportDescription,
            },
            //附件
            {
              id: "widget17036651451360001",
              type: "attachmentV2",
              value: mainBodyForm.value.fileCode,
            },
          ];
          const user = JSON.parse(localStorage.getItem("users") || "");
          const formData = new FormData();
          formData.append("params", JSON.stringify(contractPaymentList));
          //正式环境
          formData.append(
            "approvalCode",
            "C67758A3-7B95-4C18-BF1D-B5C3DE320D07"
          );
          formData.append("feishuUserId", user.feishuUserId);
          // 提交审批创建飞书实例
          getfeishuCreatesAnApproval(formData).then((res: any) => {
            if (res.code == 200) {
              submitList.value = [];
              const results = JSON.parse(res.msg);
              let responseList = {
                id: results.data.instance_code,
                code: response.data,
              };
              submitList.value.push(responseList);
              formShow.value = false;
            }
          });
          //提交飞书
          setTimeout(() => {
            let data = [];
            var contractobj: any = {};
            data = submitList.value.reduce(function (item: any, next: any) {
              contractobj[next.id]
                ? ""
                : (contractobj[next.id] =
                    true && contractobj[next.code]
                      ? ""
                      : (contractobj[next.code] =
                          true && contractobj[next.fileUrl]
                            ? ""
                            : (contractobj[next.fileUrl] =
                                true && item.push(next))));
              return item;
            }, []);
            data.forEach((item: any) => {
              gettApprovaInstance({
                instanceCode: item.id,
                attachment: mainBodyForm.value.cosUrl, //附件
                sourceId: item.code,
                sourceType: "PreSalesSupport",
                sourceBy: localStorage.getItem("username"),
                salesSupportId: item.code,
              }).then((res: any) => {
                if (res.code === 200) {
                  mainBodyForm.value.priorityLevel = "";
                  mainBodyForm.value.supportLatestTime = "";
                  mainBodyForm.value.supportDescription = "";
                  mainBodyForm.value.supportUserId = "";
                  mainBodyForm.value.supportDeptId = "";
                  mainBodyForm.value.fileList = [];
                  mainBodyForm.value.cosUrl = "";
                  mainBodyForm.value.fileCode = "";
                  mainBodyFormRef.value?.clearValidate();
                  mainBodyForm.value.id = "";
                  loading.value = false;
                  formShow.value = true;
                  Bus.emit("promore", 1);
                  return ElMessage({
                    type: "success",
                    message: "再次提交成功",
                  });
                }
              });
            });
          }, 2000);
        }
      });
    } else {
      let data = {
        priorityLevel: mainBodyForm.value.priorityLevel,
        supportLatestTime: mainBodyForm.value.supportLatestTime,
        supportDescription: mainBodyForm.value.supportDescription,
        files: mainBodyForm.value.cosUrl,
        fileCode: mainBodyForm.value.fileCode,
        supportUserId: mainBodyForm.value.supportUserId,
        supportDeptId: mainBodyForm.value.supportDeptId,
        supportUserName: mainBodyForm.value.supportUserName,
        projectId: proId.value,
      };
      getpreSalesSupportInsert(data).then((response: any) => {
        if (response.code === 200) {
          let contractPaymentList = [
            //优先级
            {
              id: "widget17035833299380001",
              type: "input",
              value: mainBodyForm.value.priorityLevelName + "",
            },

            //所需支持最晚时间
            {
              id: "widget17036394212160001",
              type: "input",
              value: mainBodyForm.value.supportLatestTime + "",
            },

            //所属支持描述
            {
              id: "widget17035835435020001",
              type: "textarea",
              value: mainBodyForm.value.supportDescription,
            },
            //附件
            {
              id: "widget17036651451360001",
              type: "attachmentV2",
              value: mainBodyForm.value.fileCode,
            },
          ];
          const user = JSON.parse(localStorage.getItem("users") || "");
          const formData = new FormData();
          formData.append("params", JSON.stringify(contractPaymentList));
          //正式环境
          formData.append(
            "approvalCode",
            "C67758A3-7B95-4C18-BF1D-B5C3DE320D07"
          );
          formData.append("feishuUserId", user.feishuUserId);
          // 提交审批创建飞书实例
          getfeishuCreatesAnApproval(formData).then((res: any) => {
            if (res.code == 200) {
              submitList.value = [];
              const results = JSON.parse(res.msg);
              let responseList = {
                id: results.data.instance_code,
                code: response.data,
              };
              submitList.value.push(responseList);
              formShow.value = false;
            }
          });
          setTimeout(() => {
            let data = [];
            var contractobj: any = {};
            data = submitList.value.reduce(function (item: any, next: any) {
              contractobj[next.id]
                ? ""
                : (contractobj[next.id] =
                    true && contractobj[next.code]
                      ? ""
                      : (contractobj[next.code] =
                          true && contractobj[next.fileUrl]
                            ? ""
                            : (contractobj[next.fileUrl] =
                                true && item.push(next))));
              return item;
            }, []);

            data.forEach((item: any) => {
              gettApprovaInstance({
                instanceCode: item.id,
                attachment: Array.from(
                  new Set(mainBodyForm.value.cosUrl)
                ).toString(), //附件
                sourceId: item.code,
                sourceType: "PreSalesSupport",
                sourceBy: localStorage.getItem("username"),
                salesSupportId: item.code,
              }).then((res: any) => {
                if (res.code === 200) {
                  mainBodyForm.value.priorityLevel = "";
                  mainBodyForm.value.supportLatestTime = "";
                  mainBodyForm.value.supportDescription = "";
                  mainBodyForm.value.supportUserId = "";
                  mainBodyForm.value.supportDeptId = "";
                  mainBodyForm.value.fileList = [];
                  mainBodyForm.value.cosUrl = "";
                  mainBodyForm.value.fileCode = "";
                  Bus.emit("promore", 1);
                  loading.value = false;
                  formShow.value = true;
                  return ElMessage({
                    type: "success",
                    message: "提交审批成功",
                  });
                }
              });
            });
          }, 2000);
        }
      });
    }
  } catch (err) {}
};
//获取执行人
const handleChange = (value: any) => {
  let data = {
    id: value[value.length - 1],
  };
  getDepartmentPerson(data).then((res: any) => {
    if (res.code === 200) {
      mainBodyForm.value.supportUserList = res.data;
    }
  });
};
//格式化部门
const department = () => {
  listDeptOptions().then((response: any) => {
    if (response.code == 200) {
      let stlist: any = JSON.stringify(response.data);
      stlist = stlist.replace(/\"id"/g, '"value"');
      stlist = stlist.replace(/\"name"/g, '"label"');
      stlist = stlist.replace(new RegExp(/(,"children":\[\])/g), "");
      mainBodyForm.value.departmentList = JSON.parse(stlist);
    }
  });
};
onMounted(() => {
  //获取优先级
  options.value.planPriorityOptions = JSON.parse(
    localStorage.getItem("priorityOptions") || ""
  );
  options.value.salespersonOptions = JSON.parse(
    localStorage.getItem("salespersonOptions") || ""
  );
  //获取售前支持详情id
  if (route.query.id) {
    formShow.value = true;
    proId.value = route.query.id;
  }
  department();
});
</script>
<style lang="scss" scoped>
@import "../css/details.scss";

.file-list {
  //   word-wrap: break-word;
  margin-left: 80px;
  display: flex;

  padding-right: 30px;
  margin-top: 10px;
  font-size: 14px;
}
</style>
