
<template>
    <div class="app-container">
        <el-card>
            <template #header>
                <el-button type="success" @click="openDialogs"><i-ep-plus />新增</el-button>
            </template>
            <el-table v-loading="loading" :data="deptList" row-key="id" default-expand-all
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" @selection-change="handleSelectionChange"
                border>
                <el-table-column prop="name" label="部门名称" min-width="200" />
                <el-table-column label="操作" fixed="right" align="left" width="200">
                    <template #default="scope">
                        <el-button type="primary" link size="small"
                            @click.stop="openDialog(scope.row.id, undefined)"><i-ep-plus />新增
                        </el-button>
                        <el-button type="primary" link size="small"
                            @click.stop="openDialog(scope.row.parentId, scope.row.id, scope.row)"><i-ep-edit />编辑
                        </el-button>
                        <el-button type="primary" link size="small" @click.stop="handleDelete(scope.row.id)">
                            <i-ep-delete />删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="dialog.visible" :title="dialog.title" width="600px" @closed="closeDialog">
            <el-form ref="deptFormRef" :model="formData" :rules="rules" label-width="80px">
                <el-form-item label="部门名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入部门名称" />
                </el-form-item>

                <el-form-item label="备注">
                    <el-input v-model="formData.description" placeholder="请输入备注" />
                </el-form-item>

            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="handleSubmit"> 确 定 </el-button>
                    <el-button @click="closeDialog"> 取 消 </el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="dialogs.visible" :title="dialog.title" width="600px" @closed="closeDialog">
            <el-form ref="deptFormRef" :model="formDatas" :rules="rules" label-width="80px">
                <el-form-item label="部门名称" prop="name">
                    <el-input v-model="formDatas.name" placeholder="请输入部门名称" />
                </el-form-item>

                <el-form-item label="备注">
                    <el-input v-model="formDatas.description" placeholder="请输入备注" />
                </el-form-item>

            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="determineSubmit"> 确 定 </el-button>
                    <el-button @click="dialogs.visible = false"> 取 消 </el-button>
                </div>
            </template>
        </el-dialog>

    </div>
</template>
<script setup lang="ts">
defineOptions({
    name: "Dept",
    inheritAttrs: false,
});

import {
    deleteDept,
    updateDept,
    addDept,
    listDepts,
} from "@/api/dept";

import { DeptVO, DeptQuery } from "@/api/dept/types";
//部门树定义ref
const deptFormRef = ref(ElForm);
//加载状态
const loading = ref(false);
//行复选框选中记录选中ID集合
const ids = ref<number[]>([]);
//新增部门
const dialog = reactive<DialogOption>({
    visible: false,

});
//修改部门
const dialogs = reactive<DialogOption>({
    visible: false,

});
//部门状态
const flg = reactive({
    flag: 0
})
//部门列表所需参数
const queryParams = reactive<DeptQuery>({});
//部门列表
const deptList = ref<DeptVO[]>();
//新增部门
const formData = reactive<any>({
    name: '',
    description: '',
    status: 1,
    parentId: 0,
    sort: 1,
    id: ''
});
//编辑部门
const formDatas = reactive<any>({
    name: '',
    description: '',

});
//验证方式
const rules = reactive({
    parentId: [{ required: true, message: "上级部门不能为空", trigger: "blur" }],
    name: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
    sort: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
});

/**
 * 查询
 */
function handleQuery() {
    loading.value = true;
    listDepts(queryParams).then(({ data }) => {
        deptList.value = data;
        loading.value = false;
    });
}
/**
 * 新增一级
 */

const openDialogs = () => {
    dialogs.visible = true
    formDatas.name = ''
    formDatas.description = ''

};
/**
 * 行复选框选中记录选中ID集合
 */
function handleSelectionChange(selection: any) {
    ids.value = selection.map((item: any) => item.id);
}

/**
 * 打开弹窗
 *
 * @param parentId 父部门ID
 * @param deptId 部门ID
 */
async function openDialog(parentId?: number, deptId?: number, row?: any) {
    dialog.visible = true;
    if (deptId) {
        dialog.title = "修改部门";
        formData.name = row.name
        formData.description = row.description
        formData.id = deptId
        flg.flag = 2
    } else {
        formData.name = ''
        formData.description = ''
        dialog.title = "新增部门";
        formData.parentId = parentId ?? 0;
        flg.flag = 1
    }
}


/**
 * 表单提交
 */
function handleSubmit() {
    deptFormRef.value.validate((valid: any) => {
        if (valid) {
            const deptId = formData.id;
            loading.value = true;
            if (flg.flag == 2) {
                const datalist: any = {
                    id: deptId,
                    name: formData.name,
                    description: formData.description
                }
                updateDept(datalist)
                    .then(() => {
                        ElMessage.success("修改成功");
                        closeDialog();
                        handleQuery();
                    })
                    .finally(() => (loading.value = false));
            } else {
                addDept(formData)
                    .then(() => {
                        ElMessage.success("新增成功");
                        closeDialog();
                        handleQuery();
                    })
                    .finally(() => (loading.value = false));
            }
        }
    });
}

//提交新增
function determineSubmit() {
    const data = {
        name: formDatas.name,
        description: formDatas.description
    }
    addDept(data)
        .then(() => {
            ElMessage.success("新增成功");
            closeDialog();
            handleQuery();
            dialogs.visible = false

        })
        .finally(() => (loading.value = false));
}

/**
 * 删除部门
 */
function handleDelete(deptId?: number) {
    const deptIds = [deptId || ids.value].join(",");

    if (!deptIds) {
        ElMessage.warning("请勾选删除项");
        return;
    }

    ElMessageBox.confirm(`确认删除已选中的数据项?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        deleteDept(deptIds).then(() => {
            ElMessage.success("删除成功");
            handleQuery();
        });
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
    deptFormRef.value.resetFields();
    deptFormRef.value.clearValidate();

    formData.id = undefined;
    formData.parentId = 0;
    formData.status = 1;
    formData.sort = 1;
}

onMounted(() => {
    handleQuery();
});
</script>
