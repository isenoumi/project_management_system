<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import SidebarItem from "./SidebarItem.vue";
import Logo from "./Logo.vue";
import { getRolePage } from "@/api/role";
import { useSettingsStore } from "@/store/modules/settings";
import { usePermissionStore } from "@/store/modules/permission";
import { useAppStore } from "@/store/modules/app";
import { storeToRefs } from "pinia";
import variables from "@/styles/variables.module.scss";
import { useUserStore } from "@/store/modules/user";
const state = useUserStore();
//分页数量和条数
const queryParams = reactive<any>({
  pageNum: 1,
  pageSize: 10,
});
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const appStore = useAppStore();
const currRoute = useRoute();
const { sidebarLogo } = storeToRefs(settingsStore);
//菜单相关数据
const rowList = reactive<any>({
  user: "",
  menulist: [],
  list: [],
  datalist: [],
  txt: [],
  role: [],
});
onMounted(() => {
  handleQuery();
  //用户昵称
  rowList.user = localStorage.getItem("username");
  //获取用户信息
  const role = JSON.parse(localStorage.getItem("users"));
  //获取菜单
  const menu = JSON.parse(localStorage.getItem("menu"));
  //循环菜单取出数据
  function handleQuery() {
    getRolePage(queryParams)
      .then(({ data }) => {
        let Data = role.roleIds.map(
          (item: any) => data.records.filter((i: any) => i?.id == item)[0]
        );
        Data.map((v: any) => {
          rowList.role.push(v.name);
        });
        localStorage.setItem("rolelist", rowList.role);
      })
      .finally(() => {});
  }
  //后端返回菜单处理
  menu.map((item: any) => {
    if (item.name.includes("项目运营管理系统")) {
      rowList.menulist.push(item.children);
    } else {
      let list = [];
      list.push(item);
      rowList.menulist.push(list);
    }
  });
  rowList.menulist.map((item: any, i: any) => {
    item.map((v: any) => {
      let list: any = {
        path: v.url,
        haveSort: v.haveSort,
        meta: {
          title: v.name,
          icon: v.icon,
          keepAlive: true,
          parentId: v.parentId,
        },
        children: [],
      };
      v.children.map((v2: any) => {
        if (v.id == v2.parentId) {
          if (v2.type === "menu") {
            list.children.push({
              path: v2.url,
              meta: {
                title: v2.name,
                icon: v2.icon,
                keepAlive: true,
              },
            });
          }
        }
      });
      rowList.datalist.push(list);
    });
  });
  //菜单排序
  // rowList.datalist.push({
  //   haveSort: 0,
  //   path: "/contractManagement/contractManagement",
  //   meta: {
  //     icon: "contract",
  //     keepAlive: true,
  //     parentId: "201",
  //     title: "合同管理",
  //   },
  // });
  rowList.datalist = rowList.datalist.sort((a: any, b: any) => {
    return a.haveSort - b.haveSort;
  }); //升序
});
</script>

<template>
  <div :class="{ 'has-logo': sidebarLogo }">
    <logo v-if="sidebarLogo" :collapse="!appStore.sidebar.opened" />
    <el-scrollbar>
      <el-menu
        :default-active="currRoute.path"
        :collapse="!appStore.sidebar.opened"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in rowList.datalist"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-collapse="!appStore.sidebar.opened"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
