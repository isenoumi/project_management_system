<template>
  <proTable
    :tableHeader="tableHeaderData"
    :handleSelection="handleSelectionChange"
    :isMoreSelect="true"
    :tableData="tableList"
    :currentChange="handleCurrentChange"
    :sizeChange="handleSizeChange"
    :pageSize="pageSizes"
    :currentPage="currentPages"
    :totalNum="total"
  >
    <template v-slot:default="{ rows, cols }">
      <!-- 显示其他内容 -->
      <span v-show="!['状态'].includes(cols.label)">
        {{ rows[cols.props] }}
      </span>
      <!-- 过滤一些内容-->
      <el-tag
        v-show="cols.label == '状态'"
        :type="rows.status == 1 ? 'danger' : ''"
        >{{ rows.status == 1 ? "停用" : "正常" }}</el-tag
      >
      <div v-show="cols.label == '操作'">
        <el-button
          size="small"
          type="primary"
          @click="editWorkshopFn(rows)"
          text
          :icon="Edit"
          >编辑</el-button
        >
        <el-button
          size="small"
          type="danger"
          text
          :icon="Delete"
          @click="deleteBtn(rows)"
          >删除</el-button
        >
      </div>
    </template>
  </proTable>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Delete, Edit } from "@element-plus/icons-vue";
// import { getWorkshopPage, deleteWorkshop } from '@/api/factory/workshop'
import proTable from "@/components/myTable/table.vue";
import { useHandleData } from "@/components/myTable/useHandleData.js";
const getWorkshopPage = () => {};
const deleteWorkshop = () => {};
const visible = ref(false);
// table数据
const tableList = ref([
  {
    sort: 1,
    workshopName: 1,
    deptName: 1,
    status: 1,
    createTime: 1,
  },
  {
    sort: 2,
    workshopName: 1,
    deptName: 1,
    status: 1,
    createTime: 1,
  },
]);

const tableHeaderData = [
  {
    label: "序号",
    props: "sort",
  },
  {
    label: "名称",
    props: "workshopName",
  },
  {
    label: "部门",
    props: "deptName",
  },
  {
    label: "状态",
    props: "status",
  },
  {
    label: "创建时间",
    props: "createTime",
  },
  {
    label: "操作",
    props: "controls",
  },
];
const total = ref(10);
const currentPages = ref(1);
const pageSizes = ref(10);

onMounted(() => {
  //初始化
  getWorkshopPageFn();
});

// 选择
const handleSelectionChange = (val) => {
  console.log("多选", val);
};

// 删除按钮
const deleteBtn = async (row) => {
  console.log("删除", row);
  await useHandleData(deleteWorkshop, row.workshopId); //deleteWorkshop为接口， row.workshopId为接口参数
  getWorkshopPageFn();
};

// 编辑按钮
const editWorkshopFn = async (row) => {
  visible.value = true;
  console.log("编辑", row);
};

//分页方法
const getWorkshopPageFn = async () => {
  //调接口拿数据
  let res = await getWorkshopPage({
    pageNum: currentPages.value,
    pageSize: pageSizes.value,
  });
  //   total.value = res.total
  //   tableList.value = res.rows
};

//分页相关按钮
const handleSizeChange = (page) => {
  pageSizes.value = page;
  getWorkshopPageFn();
};
const handleCurrentChange = (page) => {
  currentPages.value = page;
  getWorkshopPageFn();
};
</script>
