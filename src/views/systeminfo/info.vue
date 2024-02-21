<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col>
        <div class="search-container">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="关键字" prop="name">
              <el-input
                v-model="queryParams.username"
                placeholder="请输入用户昵称"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="全部"
                clearable
                style="width: 200px"
              >
                <el-option label="启用" value="ENABLED" />
                <el-option label="禁用" value="DISABLED" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleQuery"
                ><i-ep-search />搜索</el-button
              >
              <el-button @click="resetQuery">
                <i-ep-refresh />
                重置</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <el-card shadow="never">
          <template #header>
            <div class="flex justify-between">
              <div>
                <el-button type="success" @click="openDialog()"
                  ><i-ep-plus />新增</el-button
                >
              </div>
            </div>
          </template>
          <el-table
            border
            v-loading="loading"
            :data="userList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column label="用户名" align="center" prop="username" />
            <el-table-column
              key="username"
              label="用户昵称"
              align="center"
              prop="name"
            />
            <el-table-column label="性别" align="center" prop="genderValue" />
            <el-table-column label="手机号码" align="center" prop="phone" />
            <el-table-column label="状态" align="center" prop="statusValue">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.status"
                  inactive-value="DISABLED"
                  active-value="ENABLED"
                  @change="handleStatusChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="邮箱"
              align="center"
              prop="mail"
            ></el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              width="220"
              align="center"
            >
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  link
                  @click="resetPassword(scope.row)"
                  ><i-ep-refresh-left />重置密码</el-button
                >
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="openDialog(scope.row.id, scope.row)"
                  ><i-ep-edit />编辑</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <div
            style="
              display: flex;
              justify-content: flex-end;
              margin-top: 20px;
              margin-left: 0 auto;
            "
          >
            <pagination
              v-if="total > 0"
              v-model:total="total"
              v-model:page="queryParams.pageNo"
              v-model:limit="queryParams.pageSize"
              @pagination="handleQuery"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="600px"
      append-to-body
      @close="closeDialog"
    >
      <el-form
        ref="userFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            :disabled="id.dis"
            :readonly="!!formData.id"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item label="用户昵称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          v-if="dialog.title == '新增用户'"
        >
          <el-input
            v-model="formData.password"
            type="text"
            onkeyup="this.value=this.value.replace(/[^\w_]/g,'');"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="所属部门" prop="departIds">
          <el-tree-select
            v-model="formData.departIds"
            placeholder="请选择所属部门"
            :data="deptList"
            multiple
            :render-after-expand="false"
          />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="formData.gender" placeholder="请选择">
            <el-option label="男" value="MALE" />
            <el-option label="女" value="FEMALE" />
          </el-select>
        </el-form-item>

        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="formData.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="String(item.id)"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="手机号码" prop="mobile">
          <el-input
            v-model="formData.phone"
            placeholder="请输入手机号码"
            maxlength="11"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.mail"
            placeholder="请输入邮箱"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.description" placeholder="请输入备注" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="ENABLED">正常</el-radio>
            <el-radio label="DISABLED">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog
      v-model="dialog.visibles"
      title="重置密码"
      width="400px"
      append-to-body
      @close="closeDialogs"
    >
      <el-form ref="userFormRefs" :model="formDatas" label-width="80px">
        <el-form-item label="新密码">
          <el-input
            v-model="formDatas.password"
            type="text"
            @input="accountInput"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            v-model="formDatas.confirmPwd"
            type="text"
            @input="accountInputs"
            placeholder="请输入密码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="addSubmit">确 定</el-button>
          <el-button @click="dialog.visibles = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
/**
 * @see {@link https://vuejs.org/api/sfc-script-setup.html#defineoptions}
 */
import { onMounted } from "vue";
defineOptions({
  name: "User",
  inheritAttrs: false,
});
import {
  getUserPage,
  deleteUsers,
  addUser,
  updateUser,
  updateUserStatu,
} from "@/api/user";
import { listDeptOptions } from "@/api/dept";
import { listRoleOptions } from "@/api/role";
import { enumSalesperson } from "@/api/enum";
onMounted(() => {
  // 初始化用户列表数据
  handleQuery();
});
// 查询表单
const queryFormRef = ref(ElForm);
// 用户表单
const userFormRef = ref(ElForm);
// 用户表单
const userFormRefs = ref(ElForm);
//加载状态
const loading = ref(false);
const ids = ref([]);
//总条数
const total = ref(0);
//修改密码弹框
const dialog = reactive<any>({
  visible: false,
  visibles: false,
});
//页数和条数
const queryParams = reactive<any>({
  pageNo: 1,
  pageSize: 10,
});
//用户信息
const userList = ref<any[]>();
//用户详情信息
const id = reactive<any>({
  ids: "",
  name: "",
  dis: false,
});
//账号的实时输入
function accountInput(val: any) {
  let codeReg = new RegExp("[A-Za-z0-9]+"), //正则 英文+数字；
    len = val.length,
    str = "";
  for (var i = 0; i < len; i++) {
    if (codeReg.test(val[i])) {
      str += val[i];
    }
  }
  formDatas.password = str;
}
//账号的实时输入
function accountInputs(val: any) {
  let codeReg = new RegExp("[A-Za-z0-9]+"), //正则 英文+数字；
    len = val.length,
    str = "";
  for (var i = 0; i < len; i++) {
    if (codeReg.test(val[i])) {
      str += val[i];
    }
  }
  formDatas.confirmPwd = str;
}
//状态开关
const formData = reactive<any>({
  status: "ENABLED",
});
const formDatas = reactive<any>({});
//验证输入框
const rules = reactive({
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
  name: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
  departIds: [{ required: true, message: "所属部门不能为空", trigger: "blur" }],
  roleIds: [{ required: true, message: "用户角色不能为空", trigger: "blur" }],
  email: [
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
  mobile: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
});
//所属部门
const deptList = ref<any[]>();
//所属角色
const roleList = ref<any[]>();
/**
 * 获取角色下拉列表
 */
async function getRoleOptions() {
  listRoleOptions().then((response: any) => {
    roleList.value = response.data.records;
  });
}

/**
 * 修改用户状态
 */
function handleStatusChange(row: { [key: string]: any }) {
  const text = row.status === "DISABLED" ? "启用" : "停用";
  ElMessageBox.confirm(
    "确认要" + "停用或启用" + row.username + "用户吗?",
    "警告",
    {
      confirmButtonText: "启用",
      cancelButtonText: "停用",
      type: "warning",
    }
  )
    .then(() => {
      updateUserStatu(row.id, row.status);
    })
    .then(() => {
      ElMessage.success("启用成功");
    })
    .catch(() => {
      let status = "DISABLED";
      updateUserStatu(row.id, status);
      row.status = row.status === 1 ? 0 : 1;
    });
}

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  getUserPage(queryParams)
    .then((data: any) => {
      console.log(data.data.records, "xxx");
      userList.value = data.data.records;
      total.value = data.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 重置查询
 */
function resetQuery() {
  queryParams.username = "";
  queryFormRef.value.resetFields();
  queryParams.pageNo = 1;
  queryParams.deptId = undefined;
  handleQuery();
}

/**
 * 行checkbox
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/**
 * 重置密码
 */
function resetPassword(row: { [key: string]: any }) {
  console.log(row);
  id.ids = row.id;
  id.name = row.username;
  formDatas.username = "";
  formDatas.originPwd = "";
  formDatas.confirmPwd = "";
  formDatas.password = "";
  dialog.visibles = true;
}

/**
 * 打开用户弹窗
 */
async function openDialog(userId?: number, row?: any) {
  await getDeptOptions();
  await getRoleOptions();
  dialog.visible = true;
  if (userId) {
    id.dis = true;
    dialog.title = "修改用户";
    formData.name = row.name;
    formData.username = row.username;
    formData.phone = row.phone;
    formData.mail = row.mail;
    formData.description = row.description;
    formData.status = row.status;
    formData.gender = row.gender;
    id.ids = row.id;
    formData.roleIds = row.roleIds;
    formData.departIds = row.departIds;
  } else {
    id.dis = false;
    formData.name = "";
    formData.username = "";
    formData.phone = "";
    formData.mail = "";
    formData.description = "";
    formData.status = "";
    formData.gender = "";
    dialog.title = "新增用户";
  }
}

/**
 * 关闭弹窗
 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
}
/**
 * 关闭重置密码弹窗
 */
function closeDialogs() {
  dialog.visibles = false;
}

/**
 * 重置表单
 */
function resetForm() {
  userFormRef.value.resetFields();
  userFormRef.value.clearValidate();

  formData.id = undefined;
  formData.status = 1;
}
/**
 * 表单提交
 */
const handleSubmit = useThrottleFn(() => {
  userFormRef.value.validate((valid: any) => {
    if (valid) {
      const userId = id.ids;
      loading.value = true;
      if (dialog.title == "修改用户") {
        let data = {
          id: userId,
          roleIds: formData.roleIds,
          departIds: formData.departIds,
          username: formData.username,
          name: formData.name,
          gender: formData.gender,
          mail: formData.mail,
          phone: formData.phone,
          description: formData.description,
          status: formData.status,
        };
        updateUser(data)
          .then(() => {
            ElMessage.success("修改用户成功");
            closeDialog();
            resetQuery();
            enumSalesperson().then(({ data }) => {
              localStorage.setItem("salespersonOptions", JSON.stringify(data));
            });
          })
          .finally(() => (loading.value = false));
      } else {
        if (!formData.gender) {
          return ElMessage({ type: "info", message: "请选择您的性别" });
        }
        if (!formData.phone) {
          return ElMessage({ type: "info", message: "请输入您的手机号" });
        }
        if (!formData.status) {
          return ElMessage({ type: "info", message: "请选择状态" });
        }
        addUser(formData)
          .then(() => {
            ElMessage.success("新增用户成功");
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}, 3000);

/**
 * 表单提交
 */
function addSubmit() {
  if (formDatas.confirmPwd != formDatas.password) {
    return ElMessage.warning("两次密码不一致，请重新输入");
  }
  const data = {
    userId: String(id.ids),
    username: id.name,
    confirmPwd: String(formDatas.confirmPwd),
    password: String(formDatas.password),
  };
  deleteUsers(data).then(() => {
    ElMessage.success("修改密码成功");
    dialog.visibles = false;
    resetQuery();
  });
}

/**
 * 获取部门下拉项
 */
async function getDeptOptions() {
  listDeptOptions().then((response) => {
    let stlist: any = JSON.stringify(response.data);
    stlist = stlist.replace(/\"id"/g, '"value"');
    stlist = stlist.replace(/\"name"/g, '"label"');
    stlist = stlist.replace(new RegExp(/(,"children":\[\])/g), "");
    deptList.value = JSON.parse(stlist);
  });
}
</script>
