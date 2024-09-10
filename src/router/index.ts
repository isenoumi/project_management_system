import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

export const Layout = () => import("@/layout/index.vue");

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },
  //登录
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },
  //首页
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: { title: "dashboard", icon: "homepage", affix: true },
      },
      //报错页面401
      {
        path: "401",
        component: () => import("@/views/error-page/401.vue"),
        meta: { hidden: true },
      },
      //找不到页面404
      {
        path: "404",
        component: () => import("@/views/error-page/404.vue"),
        meta: { hidden: true },
      },
    ],
  },
  // 客户档案
  {
    path: "/customerVisit",
    component: Layout,
    children: [
      {
        path: "customerVisit",
        component: () => import("@/views/customerVisit/index.vue"),
        meta: { hidden: true },
      },
    ],
  },
  // 项目信息
  {
    path: "/projectinfo",
    component: Layout,
    children: [
      {
        path: "Projectinfo",
        component: () => import("@/views/projectinfo/index.vue"),
        meta: { hidden: true },
      },
    ],
  },
  //招投标管理
  {
    path: "/bidding",
    component: Layout,
    children: [
      {
        path: "Bidding",
        component: () => import("@/views/bidding/index.vue"),
        meta: { hidden: true },
      },
    ],
  },
  //合同管理
  {
    path: "/contractManagement",
    component: Layout,
    children: [
      {
        path: "projectContract",
        component: () => import("@/views/contractManagement/projectContract/index.vue"),
        meta: { hidden: true },
      },
      {
        path: "procurementContract",
        component: () => import("@/views/contractManagement/procurementContract/index.vue"),
        meta: { hidden: true },
      },
    ],
  },

  //项目计划-管理员页面
  {
    path: "/projectplan_u",
    component: Layout,
    children: [
      {
        path: "Projectplan",
        component: () => import("@/views/projectplan_u/index.vue"),
        meta: { hidden: true },
      },
    ],
  },

  //项目预算
  {
    path: "/projectbudget",
    component: Layout,
    children: [
      {
        path: "Projectbudget",
        component: () => import("@/views/projectbudget/index.vue"),
        meta: { hidden: true },
      },
    ],
  },
  // 项目预算-管理员页面
  {
    path: "/managebudget",
    component: Layout,
    children: [
      {
        path: "managebudget",
        name: "Managebudget",
        component: () => import("@/views/manage-budget/index.vue"),
        meta: { hidden: true },
      },
    ],
  },
  //付款审批
  {
    path: "/paymentapproval",
    component: Layout,
    children: [
      {
        path: "Paymentapproval",
        name: "Paymentapproval",
        component: () => import("@/views/paymentapproval/paymentapproval.vue"),
        meta: { hidden: true },
      },
    ],
  },
  //付款审批
  {
    path: "/examineandapprove",
    component: Layout,
    children: [
      {
        path: "examineandapprove",
        name: "Examineandapprove",
        component: () => import("@/views/examineandapprove/examineandapprove.vue"),
        meta: { hidden: true },
      },
    ],
  },
  //再次提交付款审批
  {
    path: "/reapproval",
    component: Layout,
    children: [
      {
        path: "reapproval",
        name: "Reapproval",
        component: () => import("@/views/reapproval/examineandapprove.vue"),
        meta: { hidden: true },
      },
    ],
  },
  //售前支持
  {
    path: "/presales",
    component: Layout,
    children: [
      {
        path: "presales",
        name: "Presales",
        component: () => import("@/views/presales/presales.vue"),
        meta: { hidden: true },
      },
    ],
  },

  //付款管理
  {
    path: "/payment",
    component: Layout,
    children: [
      {
        path: "payment",
        name: "Payment",
        component: () => import("@/views/payment/index.vue"),
        meta: { hidden: true },
      },
    ],
  },
  //报表统计
  {
    path: "/reportforms",
    component: Layout,
    children: [
      {
        path: "Reportforms",
        name: "Reportforms",
        component: () => import("@/views/statement/index.vue"),
        meta: { hidden: true },
      },
    ],
  },
  //付款审批
  {
    path: "/financialManagement",
    component: Layout,
    children: [
      {
        path: "financialApproval",
        name: "financialApproval",
        component: () => import("@/views/financialManagement/financialApproval/index.vue"),
        meta: { hidden: true },
      },
    ],
  },
  // 系统管理
  {
    path: '/systeminfo',
    component: Layout,
    name: 'System',
    meta: { title: '系统管理', icon: 'system' },
    children: [
      {
        path: 'info',
        component: () => import('@/views/systeminfo/info.vue'),
        name: 'Info',
        meta: { title: '用户管理' }
      },
      {
        path: 'roles',
        component: () => import('@/views/systeminfo/roles.vue'),
        name: 'Roles',
        meta: { title: '角色管理' }
      },
      {
        path: 'department',
        component: () => import('@/views/systeminfo/department.vue'),
        name: 'Department',
        meta: { title: '部门管理' }
      }

    ]

  },
  // 消息中心
  {
    path: "/task",
    component: Layout,
    name: "Task",
    meta: { hidden: true },
    children: [
      {
        path: "level3-1",
        component: () => import("@/views/task/taskcenter/taskcenter.vue"),
        name: "Level3-1",
        meta: { title: "任务中心" },
      },
      {
        path: "level3-2",
        component: () => import("@/views/task/notice/notice.vue"),
        name: "Level3-2",
        meta: { title: "通知发布" },
      },
    ],

  },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/login" });
}

export default router;
