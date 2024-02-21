<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginData"
      :rules="loginRules"
      class="login-form"
    >
      <div
        class="flex text-white items-center py-4"
        style="margin-top: 120px; margin-bottom: 30px"
      >
        <span class="text-2xl flex-1 text-center">经营数据平台</span>
      </div>
      <el-form-item prop="username">
        <div class="p-2 text-white">
          <svg-icon icon-class="user" />
        </div>
        <el-input
          ref="username"
          v-model="loginData.username"
          class="flex-1"
          :placeholder="$t('login.username')"
          name="username"
        />
      </el-form-item>

      <el-tooltip
        :disabled="isCapslock === false"
        content="Caps lock is On"
        placement="right"
      >
        <el-form-item prop="password">
          <span class="p-2 text-white">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            v-model="loginData.password"
            class="flex-1"
            placeholder="密码"
            :type="passwordVisible === false ? 'password' : 'input'"
            name="password"
            @keyup="checkCapslock"
            @keyup.enter="handleLogin"
          />
          <span class="mr-2" @click="passwordVisible = !passwordVisible">
            <svg-icon
              :icon-class="passwordVisible === false ? 'eye' : 'eye-open'"
              class="text-white cursor-pointer"
            />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-button
        style="margin-top: 30px"
        size="default"
        :loading="loading"
        type="primary"
        class="w-full"
        @click.prevent="handleLogin"
        >{{ $t("login.login") }}
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import SvgIcon from "@/components/SvgIcon/index.vue";
// 状态管理依赖
import { useUserStore } from "@/store/modules/user";
// API依赖
import { LocationQuery, LocationQueryValue, useRoute } from "vue-router";
import { LoginData } from "@/api/auth/types";
import { getRolePage } from "@/api/role";
const userStore = useUserStore();
const route = useRoute();

/**
 * 按钮loading
 */
const loading = ref(false);
/**
 * 是否大写锁定
 */
const isCapslock = ref(false);
/**
 * 密码是否可见
 */
const passwordVisible = ref(false);
/**
 * 验证码图片Base64字符串
 */
const captchaBase64 = ref();

/**
 * 登录表单引用
 */
const loginFormRef = ref(ElForm);

const loginData = ref<LoginData>({
  username: "",
  password: "",
});

const loginRules = {
  username: [
    {
      required: true,
      trigger: "blur",
      validator: (rule: any, value: any, callback: any) => {
        if (!value) {
          callback(new Error("用户名不能为空"));
        } else {
          callback();
        }
      },
    },
  ],
  password: [{ required: true, trigger: "blur", validator: passwordValidator }],
};

/**
 * 密码校验器
 */
function passwordValidator(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error("密码长度最低为6位"));
  } else {
    callback();
  }
}

/**
 * 检查输入大小写状态
 */
function checkCapslock(e: any) {
  const { key } = e;
  isCapslock.value = key && key.length === 1 && key >= "A" && key <= "Z";
}

/**
 * 登录
 */
function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      userStore
        .login(loginData.value)
        .then(() => {
          loading.value = false;
          const query: LocationQuery = route.query;
          let redirect = (query.redirect as LocationQueryValue) ?? "/";
          if (redirect) {
            router.push({ path: redirect });
          }
        })
        .catch((err) => {
          loading.value = false;
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
}

onMounted(() => {});
</script>

<style lang="scss" scoped>
@import "./css/login.scss";
</style>
