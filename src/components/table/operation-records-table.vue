<template>
  <el-table :data="props.tableData" border style="width: 100%">
    <el-table-column type="index" label="序号" width="80" align="center">
    </el-table-column>
    <!-- <el-table-column prop="itemText" label="修改信息" width="" align="center">
      </el-table-column> -->
    <!-- <el-table-column prop="itemValue" label="修改前" width="" align="center">
      </el-table-column>
      <el-table-column prop="description" label="修改后" align="center">
      </el-table-column> -->
    <el-table-column prop="updateTime" label="修改时间" align="center">
    </el-table-column>
    <el-table-column prop="updatePeople" label="修改人" align="center">
    </el-table-column>
    <el-table-column label="操作" align="center" width="380">
      <template #default="scope">
        <el-button
          text
          type="primary"
          @click="handleView(scope.$index, scope.row)"
        >
          查看
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref, onUpdated } from "vue";
const props = defineProps({
  tableData: { type: Array, default: () => [] },
});
const emits = defineEmits(["openLog"]);
const changeVisible = ref(false);

const handleView = (index, row) => {
  emits("openLog", row);
};
onUpdated(() => {
  console.log(props.tableData, "tableData");
});
</script>

<style lang="scss">
.infoBox {
  display: flex;
  justify-content: left;
  flex-wrap: wrap;

  .title {
    font-size: 14px;
    margin-bottom: 15px;
    width: 300px;
  }
}
</style>
