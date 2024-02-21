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
        :index="(index) => index + 1 + (props.currentPage - 1) * props.pageSize"
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
          <div v-if="col.enums">
            <div
              v-for="(enumsItem, enumsIndex) in col.enums.enums"
              :key="enumsIndex"
            >
              <div
                v-if="
                  enumsItem[col.enums.value ? col.enums.value : 'value'] ==
                  row[col.props]
                "
              >
                {{ enumsItem[col.enums.label ? col.enums.label : "label"] }}
              </div>
            </div>
          </div>
          <div v-else-if="col.hover">
            <el-tooltip
              class="box-item"
              :effect="col.hover.effect ? col.hover.effect : 'dark'"
              :content="row[col.props]"
              :placement="
                col.hover.placement ? col.hover.placement : 'top-start'
              "
            >
              {{
                row[col.props] &&
                row[col.props].length >
                  (col.hover.length ? col.hover.length : 8)
                  ? row[col.props].substring(
                      0,
                      col.hover.length ? col.hover.length : 8
                    ) + "..."
                  : row[col.props]
              }}
            </el-tooltip>
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
        v-if="isShowPagination"
        v-show="totalNum > 0"
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
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
  //是否分页器
  isShowPagination: {
    type: Boolean,
    default: true,
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
