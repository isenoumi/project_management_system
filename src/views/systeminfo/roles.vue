<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="keywords" label="关键字">
          <el-input
            v-model="queryParams.name"
            placeholder="角色名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery"
            ><i-ep-search />搜索</el-button
          >
          <el-button @click="resetQuery"><i-ep-refresh />重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <template #header>
        <el-button type="success" @click="openDialog()"
          ><i-ep-plus />新增</el-button
        >
      </template>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="roleList"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="角色名称"
          prop="name"
          min-width="100"
          align="center"
        />
        <el-table-column
          label="角色编码"
          prop="code"
          width="250"
          align="center"
        />
        <el-table-column
          label="创建时间"
          prop="createTime"
          width="250"
          align="center"
        />
        <el-table-column
          label="备注"
          prop="description"
          width="250"
          align="center"
        />
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-tag v-if="(scope.row.showFlag = true)" type="success"
              >正常</el-tag
            >
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="320" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              @click="openMenuDialog(scope.row)"
            >
              <i-ep-position />分配权限
            </el-button>
            <el-button
              type="primary"
              size="small"
              link
              @click="openDialog(scope.row.id, scope.row)"
            >
              <i-ep-edit />编辑
            </el-button>
            <el-button
              type="primary"
              size="small"
              link
              @click="handleDelete(scope.row.id)"
            >
              <i-ep-delete />删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>

    <!-- 角色表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="closeDialog"
    >
      <el-form
        ref="roleFormRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="角色编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="formData.description"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配菜单弹窗  -->
    <el-dialog
      v-model="menuDialogVisible"
      :title="'【' + checkedRole.name + '】权限分配'"
      width="800px"
    >
      <el-scrollbar v-loading="loading" max-height="600px">

        <el-tree
        :check-strictly="isCheck.show"
          ref="menuRef"
          node-key="id"
          show-checkbox
          :data="menuList"
          :default-expand-all="true"
          :default-checked-keys="defaultPermTreeSelect"
        >
          <template #default="{ data }">
            {{ data.name }}
          </template>
        </el-tree>
      </el-scrollbar>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleRoleMenuSubmit"
            >确 定</el-button
          >
          <el-button @click="menuDialogVisible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted,nextTick } from "vue";
defineOptions({
  name: "Role",
  inheritAttrs: false,
});

import {
  deleteRole,
  getRolePage,
  updateRole,
  addRole,
  updateRoleMenus,
} from "@/api/role";
import { listMenuOptions } from "@/api/menu";
import { RolePageVO, RoleQuery } from "@/api/role/types";
const isCheck=reactive({
  show:true
})
//树形菜单数据
const defaultPermTreeSelect = ref([] as string[]);
//表单定义ref
const queryFormRef = ref(ElForm);
//角色权限
const roleFormRef = ref(ElForm);
//权限菜单
const menuRef = ref(ElTree);
//加载状态
const loading = ref(false);
//id
const ids = ref<number[]>([]);
//总条数
const total = ref(0);
//页数和条数
const queryParams = reactive<any>({
  pageNum: 1,
  pageSize: 10,
});
//用户信息
const roleList = ref<RolePageVO[]>();
//角色表单弹框
const dialog = reactive<DialogOption>({
  visible: false,
});
//表单数据
const formData = reactive<any>({
  sort: 1,
  status: 1,
  code: "",
  name: "",
  description: "",
});
//验证方法
const rules = reactive({
  name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
  dataScope: [{ required: true, message: "请选择数据权限", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
});
//菜单权限弹框
const menuDialogVisible = ref(false);
//菜单数据
const menuList = ref<OptionType[]>([]);
//传递过来参数
interface CheckedRole {
  id?: number;
  name?: string;
}
//查看权限
let checkedRole: CheckedRole = reactive({});

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  getRolePage(queryParams)
    .then(({ data }) => {
      roleList.value = data.records;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}
/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/**
 * 行checkbox change事件
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/**
 * 打开角色表单弹窗
 *
 * @param roleId
 */
function openDialog(roleId?: number, row?: object) {
  dialog.visible = true;
  if (roleId) {
    formData.id = roleId;
    dialog.title = "修改角色";
    formData.name = row.name;
    formData.code = row.code;
    formData.description = row.description;
  } else {
    formData.name = "";
    formData.code = "";
    formData.description = "";
    dialog.title = "新增角色";
  }
}

/**
 * 角色表单提交
 */
function handleSubmit() {
  roleFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const roleId = formData.id;
      if (roleId) {
        const data = {
          id: formData.id,
          code: formData.code,
          name: formData.name,
          description: formData.description,
        };
        updateRole(data)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        addRole(formData)
          .then((res: any) => {
            ElMessage.success("新增成功");
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/**
 * 关闭弹窗
 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
}

/**
 * 重置表单
 */
function resetForm() {
  roleFormRef.value.resetFields();
  roleFormRef.value.clearValidate();

  formData.id = undefined;
  formData.sort = 1;
  formData.status = 1;
}

/**
 * 删除
 */
function handleDelete(roleId?: number) {
  const roleIds = [roleId || ids.value].join(",");
  if (!roleIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    loading.value = true;
    deleteRole(roleIds)
      .then((res: any) => {
        ElMessage.success("删除成功");
        resetQuery();
      })
      .finally(() => (loading.value = false));
  });
}

//分配权限
function openMenuDialog(row: RolePageVO) {
  defaultPermTreeSelect.value = [];
  const roleId = row.id;
  if (roleId) {
    checkedRole = {
      id: roleId,
      name: row.name,
    };
    menuDialogVisible.value = true;
    loading.value = true;
    isCheck.show=true
    listMenuOptions(roleId).then((response: any) => {
      nextTick(()=>{
        console.log(response,'菜单分配')
      menuList.value = response.data.permissions;
      loading.value = false;
      response.data.selectedIds.map((v:any)=>{
        if(v!="201" && v!="20106" &&v!="20104" &&v!="20105" && v!="101" && v!="20107" && v!="20108"&&v!="20101"&&v!="20102"&&v!="20103" &&v!="20106"){
          defaultPermTreeSelect.value.push(v)
        }

      })
      // defaultPermTreeSelect.value = response.data.selectedIds;
      isCheck.show=false
      console.log(defaultPermTreeSelect.value,'状态11111111')
      })

    });
  }
}

// /**
//  * 角色分配菜单提交
//  */
// function handleRoleMenuSubmit() {
//   const roleId = checkedRole.id;
//   if (roleId) {
//     // const permNodes = menuRef.value.getCheckedNodes();
//     const permNodes = menuRef.value.getHalfCheckedNodes();
//     let permIds: any = [];
//     permNodes.map((menuId: any) => {
//       permIds.push(menuId.id);
//     });
//     loading.value = true;
//     updateRoleMenus(roleId, permIds)
//       .then((res) => {
//         ElMessage.success("分配权限成功");
//         menuDialogVisible.value = false;
//         resetQuery();
//       })
//       .finally(() => {
//         loading.value = false;
//       });
//   }
// }

/**
 * 角色分配菜单提交
 */
function handleRoleMenuSubmit() {
  const roleId = checkedRole.id;
  if (roleId) {
    const checkeds = menuRef.value.getHalfCheckedKeys();
    const permNodes = menuRef.value.getCheckedNodes();
    let permIds: any = [];
    permNodes.map((menuId: any) => {
      permIds.push(menuId.id);
    });
    const permissions = checkeds.concat(permIds);
    console.log(permissions, "选中000000");
    loading.value = true;
    updateRoleMenus(roleId, permissions)
      .then((res) => {
        ElMessage.success("分配权限成功");
        menuDialogVisible.value = false;
        resetQuery();
      })
      .finally(() => {
        loading.value = false;
      });
  }
}

onMounted(() => {
  handleQuery();
});
</script>
