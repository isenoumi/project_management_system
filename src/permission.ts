import router from "@/router";
import { usePermissionStoreHook } from "@/store/modules/permission";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({ showSpinner: false }); // 进度条
const permissionStore = usePermissionStoreHook();

// 白名单路由
const whiteList = ["/login"];
//前置路由守卫
router.beforeEach(async (to, from, next) => {
  if (localStorage.getItem("accessToken")) {
    next();
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      // ElMessage.error( 'token失效请重新登录');
      next('/login')
    }
  }
});
//后置路由守卫
router.afterEach(() => {
  NProgress.done();
});
