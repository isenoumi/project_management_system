import vue from "@vitejs/plugin-vue";

import { UserConfig, ConfigEnv, loadEnv, defineConfig } from "vite";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

import UnoCSS from "unocss/vite";

import path from "path";
const pathSrc = path.resolve(__dirname, "src");

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  return {
    resolve: {
      alias: {
        "@": pathSrc,
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      },
    },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        //define global scss variable
        scss: {
          javascriptEnabled: true,
          additionalData: `
            @use "@/styles/variables.scss" as *;
          `,
        },
      },
    },
    server: {
      host: "0.0.0.0",
      port: Number(env.VITE_APP_PORT),
      open: true, // 运行是否自动打开浏览器
      proxy: {
        // 反向localStorage解决跨域
        // [env.VITE_APP_BASE_API]: {
        //   // target: "http://192.168.100.203:30000", // 正式接口地址
        //   // target: "http://192.168.100.202:9999", // 线上接口地址
        //   // target: "http://192.168.100.203:30003", // 线上接口地址
        //   //  target: "http://192.168.100.25:9003", // 王杰本地地址
        //   //  target: "http://124.220.27.136:9013", // 新建线上正式环境
        //   target: "http://192.168.100.26:9003", // 陈子琪本地地址
        //   // target: "http://192.168.100.56:9003", // 雍正宇本地地址
        //   // target: "http://192.168.100.16:9003", // 蒋俊本地地址
        //   // target: "https://25g3s95297.imdo.co", // 本地地址
        //   // target: 'http://localhost:8989',  // 本地接口地址 , 后端工程仓库地址：https://gitee.com/youlaiorg/youlai-boot
        //   changeOrigin: true,
        //   rewrite: (path) =>
        //     path.replace(new RegExp("^" + env.VITE_APP_BASE_API), ""), // 替换 /dev-api 为 target 接口地址
        // },
        '/oms-project': {
          // target: "http://192.168.100.203:30000", // 正式接口地址
          // target: "http://192.168.100.202:9999", // 线上接口地址
          // target: "http://192.168.100.203:30003", // 线上接口地址
          //  target: "http://192.168.100.25:9003", // 王杰本地地址
          // target: "http://124.220.27.136:9013", // 新建线上正式环境
          // target: "http://192.168.100.64:9003", // 陈子琪本地地址
          target: "http://192.168.100.70:9003", // 雍正宇本地地址
          // target: "http://192.168.100.16:9003", // 蒋俊本地地址
          // target: "https://25g3s95297.imdo.co", // 本地地址
          // target: 'http://localhost:8989',  // 本地接口地址 , 后端工程仓库地址：https://gitee.com/youlaiorg/youlai-boot
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(new RegExp("^" + '/oms-project'), "/oms-project"), // 替换 /dev-api 为 target 接口地址
        },
        '/oms-sys': {
          // target: "http://192.168.100.203:30000", // 正式接口地址
          // target: "http://192.168.100.202:9999", // 线上接口地址
          // target: "http://192.168.100.203:30003", // 线上接口地址
          //  target: "http://192.168.100.25:9003", // 王杰本地地址
          // target: "http://124.220.27.136:9013", // 新建线上正式环境
          // target: "http://192.168.100.64:9002", // 陈子琪本地地址
          target: "http://192.168.100.70:9002", // 雍正宇本地地址
          // target: "http://192.168.100.16:9003", // 蒋俊本地地址
          // target: "https://25g3s95297.imdo.co", // 本地地址
          // target: 'http://localhost:8989',  // 本地接口地址 , 后端工程仓库地址：https://gitee.com/youlaiorg/youlai-boot
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(new RegExp("^" + '/oms-sys'), "/oms-sys"), // 替换 /dev-api 为 target 接口地址
        },
      },
    },
    plugins: [
      vue(),
      UnoCSS({}),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ["vue", "@vueuse/core"],
        eslintrc: {
          enabled: false,
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true,
        },
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
          IconsResolver({}),
        ],
        vueTemplate: true,
        // 配置文件生成位置(false:关闭自动生成)
        dts: false,
        // dts: "src/types/auto-imports.d.ts",
      }),

      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({
            // @iconify-json/ep 是 Element Plus 的图标库
            enabledCollections: ["ep"],
          }),
        ],
        // 指定自定义组件位置(默认:src/components)
        dirs: ["src/**/components"],
        // 配置文件位置(false:关闭自动生成)
        dts: false,
        // dts: "src/types/components.d.ts",
      }),

      Icons({
        // 自动安装图标库
        autoInstall: true,
      }),

      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(pathSrc, "assets/icons")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]",
      }),
    ],
    // 预加载项目必需的组件
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "pinia",
        "axios",
        "element-plus/es/components/form/style/css",
        "element-plus/es/components/form-item/style/css",
        "element-plus/es/components/button/style/css",
        "element-plus/es/components/input/style/css",
        "element-plus/es/components/input-number/style/css",
        "element-plus/es/components/switch/style/css",
        "element-plus/es/components/upload/style/css",
        "element-plus/es/components/menu/style/css",
        "element-plus/es/components/col/style/css",
        "element-plus/es/components/icon/style/css",
        "element-plus/es/components/row/style/css",
        "element-plus/es/components/tag/style/css",
        "element-plus/es/components/dialog/style/css",
        "element-plus/es/components/loading/style/css",
        "element-plus/es/components/radio/style/css",
        "element-plus/es/components/radio-group/style/css",
        "element-plus/es/components/popover/style/css",
        "element-plus/es/components/scrollbar/style/css",
        "element-plus/es/components/tooltip/style/css",
        "element-plus/es/components/dropdown/style/css",
        "element-plus/es/components/dropdown-menu/style/css",
        "element-plus/es/components/dropdown-item/style/css",
        "element-plus/es/components/sub-menu/style/css",
        "element-plus/es/components/menu-item/style/css",
        "element-plus/es/components/divider/style/css",
        "element-plus/es/components/card/style/css",
        "element-plus/es/components/link/style/css",
        "element-plus/es/components/breadcrumb/style/css",
        "element-plus/es/components/breadcrumb-item/style/css",
        "element-plus/es/components/table/style/css",
        "element-plus/es/components/tree-select/style/css",
        "element-plus/es/components/table-column/style/css",
        "element-plus/es/components/select/style/css",
        "element-plus/es/components/option/style/css",
        "element-plus/es/components/pagination/style/css",
        "element-plus/es/components/tree/style/css",
        "element-plus/es/components/alert/style/css",
        "@vueuse/core",

        "path-to-regexp",
        "echarts",
        "@wangeditor/editor",
        "@wangeditor/editor-for-vue",
        "vue-i18n",
        "codemirror",
      ],
    },
  };
});
