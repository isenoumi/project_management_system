<template>
  <el-dialog
    title="招投标"
    width="40%"
    :append-to-body="true"
    :destroy-on-close="true"
  >
    <!-- <div class="tips">
      请确认是否招投标。确认后将流转至下一流程，并在"招投标管理"中展示该项目。
    </div> -->
    <el-form ref="formDataAdd" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="" prop="">
        <div class="tips" style="color: #f56c6c">
          请确认是否招投标。确认后将流转至下一流程，并在"招投标管理"中展示该项目。
        </div>
      </el-form-item>
      <el-form-item label="中标主体: " prop="biddingMainName">
        <el-input
          v-model="form.biddingMainName"
          class="input"
          autocomplete="off"
          required="required"
        ></el-input>
      </el-form-item>
      <el-form-item label="标书份数: " prop="biddingDocumentsNum">
        <el-input-number
          v-model="form.biddingDocumentsNum"
          class="input"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="招标预算: " prop="tenderBudgetNum">
        <el-input-number
          v-model="form.tenderBudgetNum"
          class="input"
          required="required"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="是否挂网: " prop="spreadNetStatus">
        <el-radio-group v-model="form.spreadNetStatus">
          <el-radio label="YES">是</el-radio>
          <el-radio label="NO">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="form.spreadNetStatus == 'YES'"
        label="开标时间: "
        prop="biddingOpenTime"
      >
        <el-date-picker
          v-model="form.biddingOpenTime"
          type="datetime"
          placeholder="请选择开标时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item
        v-if="form.spreadNetStatus == 'NO'"
        label="预计挂网时间: "
        prop="spreadNetTime"
      >
        <el-date-picker
          v-model="form.spreadNetTime"
          type="datetime"
          placeholder="请选择预计挂网时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('reset')">取消</el-button>
        <el-button type="primary" @click="add"> 确定招投标 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const emits = defineEmits(["reset"]);
const props = defineProps(["id", "formData"]);
import { biddingPost } from "@/api/bidding/index";
import { ref, reactive, onMounted, onUpdated } from "vue";
import { bidding } from "@/api/visit/index";
import { ElMessage, ElMessageBox } from "element-plus";
// 新增弹框
const addVisible = ref(false);
// 项目新增对象
const formDataAdd = ref(null);

// 项目信息form
const form = ref({
  biddingDocumentsNum: 0,
  biddingMainName: "",
  tenderBudgetNum: 0,
  biddingOpenTime: "",
  spreadNetTime: "",
  spreadNetStatus: "",
});
// form验证规则
const rules = reactive({
  biddingMainName: [{ required: true, message: "请输入中标主体" }],
  biddingDocumentsNum: [{ required: true, message: "请输入标书份数" }],
  tenderBudgetNum: [{ required: true, message: "请输入招标预算" }],
  spreadNetStatus: [{ required: true, message: "请选择是否挂网" }],
  biddingOpenTime: [{ required: true, message: "请选择开标时间" }],
  spreadNetTime: [{ required: true, message: "请选择预计挂网时间" }],
});

// 新增招投标
const add = async () => {
  if (!form.value) {
    return;
  }
  try {
    await formDataAdd.value.validate();
    // 中标
    bidding({
      ...form.value,
      id: props.id,
    }).then(({ msg }) => {
      ElMessage({
        message: msg,
        type: "success",
      });
      emits("reset");
    });
  } catch (err) {
    console.log(err);
  }
};

// 枚举
onMounted(() => {});
</script>

<style scoped>
@import "../css/addproject.scss";
</style>
