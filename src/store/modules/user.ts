import { defineStore } from "pinia";
import { loginApi, logoutApi } from "@/api/auth";
import { resetRouter } from "@/router";
import { store } from "@/store";
import { LoginData } from "@/api/auth/types";
import { useStorage } from "@vueuse/core";
export const useUserStore = defineStore("user", () => {
  //用户id
  const userId = ref();
  //token
  const token = useStorage("accessToken", "");
  //用户名称
  const nickname = ref("中环服");
  //用户头像
  const avatar = ref("https://img1.baidu.com/it/u=4159158149,2237302473&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500");
  // 用户角色编码集合 → 判断路由权限
  const roles = ref<Array<string>>([]);
  // 用户权限编码集合 → 判断按钮权限 
  const perms = ref<Array<string>>([]);
  //菜单
  const menu = reactive<any>([]);
  /**
   * 登录调用
   *
   * @param {LoginData}
   * @returns
   */
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      loginApi(loginData)
        .then((response: any) => {
          if (response.data.code != 400) {
            const { tokenType, accessToken } = response.data;
            //token赋值
            token.value = "Bearer" + " " + response.data.tokenValue;
            //本地存储token
            localStorage.setItem('accessToken', 'Bearer ' + response.data.tokenValue);
            //本地存储用户昵称
            localStorage.setItem('username', response.data.user.username);
            //本地存储用户名
            localStorage.setItem('nikename', response.data.user.name);
            //本地存储菜单
            localStorage.setItem('menu', JSON.stringify(response.data.permissions));
            //本地存储权限按钮
            localStorage.setItem('buttons', JSON.stringify(response.data.buttons));
            //本地存储用户信息
            localStorage.setItem('users', JSON.stringify(response.data.user));
            menu.vue = response.data.permissions
            resolve();
          } else {
            reject()
          }

        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getInfo() {

  }

  // 注销登录
  function logout() {
    return new Promise<void>((resolve, reject) => {
      logoutApi()
        .then(() => {
          resetRouter();
          resetToken();
          location.reload(); // 清空路由
          resolve();
        })
    });
  }

  // 重置
  function resetToken() {
    token.value = "";
    nickname.value = "";
    avatar.value = "";
    roles.value = [];
    perms.value = [];
  }
  return {
    menu,
    token,
    nickname,
    avatar,
    roles,
    perms,
    login,
    getInfo,
    logout,
    resetToken,
    /**
     * 当前登录用户ID
     */
    userId,
  };
});

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
