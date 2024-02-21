<template>
  <div>
    <el-table
      :data="tableData"
      stripe
      empty-text="暂无数据"
      @selection-change="handleSelection"
      border
    >
      <el-table-column
        align="center"
        type="index"
        width="60"
        label="序号"
        v-if="isShowIndex"
      >
      </el-table-column>
      <el-table-column
        type="selection"
        width="100"
        v-if="isMoreSelect"
        align="center"
      />
      <el-table-column
        v-for="(col, i) in tableHeader"
        :prop="col.props"
        :key="i"
        :label="col.label"
        :width="col.width || 'auto'"
        align="center"
      >
        <template #default="{ row }">
          <!-- 自定义内容 -->
          <div v-if="col.type === 'enums'">
            <div v-for="(enumsItem, enumsIndex) in col.enums" :key="enumsIndex">
              <div v-if="enumsItem.value == row[col.props]">
                {{ enumsItem.label }}
              </div>
            </div>
          </div>
          <div v-else-if="col.type === 'customFunction'">
            {{ col.customFunction(row) }}
          </div>
          <slot v-else :rows="row" :cols="col"></slot>
        </template>
      </el-table-column>
    </el-table>
    <div style="height: 15px"></div>
    <el-row justify="end">
      <el-pagination
        v-show="totalNum > 0"
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="totalNum"
        background
      >
      </el-pagination>
    </el-row>
  </div>
</template>
<script setup name="Table">
const props = defineProps({
  //  表头
  tableHeader: {
    type: Array,
    default: () => [],
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  //是否多选显示
  isMoreSelect: {
    type: Boolean,
    default: false,
  },
  //是否显示序号
  isShowIndex: {
    type: Boolean,
    default: false,
  },
  //是否折叠
  isExpand: {
    type: Boolean,
    default: false,
  },
  // 当前页
  currentPage: {
    type: Number,
    default: 0,
  },
  // 展示页数
  pageSize: {
    type: Number,
    default: 0,
  },
  //总页数
  totalNum: {
    type: Number,
    default: 0,
  },
  // 改变每页展示页数
  sizeChange: {
    type: Function,
    default: () => {},
  },
  // 改变页码
  currentChange: {
    type: Function,
    default: () => {},
  },
  //多选
  handleSelection: {
    type: Function,
    default: () => {},
  },
});
</script>

<style scoped lang="scss"></style>
