<template>
  <el-card>
    <el-tabs
      ref="tabs"
      v-model="activeName"
      class="demo-tabs"
      @tab-click="handleTabClick"
    >
      <el-tab-pane label="项目数据" name="first">
        <div class="header">
          <div class="left">
            <!-- <div>子计划状态:</div> -->
            <div class="item">
              <div class="lineTxt">未开始</div>
              <div class="line" style="background-color: #f0fff0"></div>
            </div>
            <div class="item">
              <div class="lineTxt">进行中</div>
              <div class="line" style="background-color: #db2b25"></div>
            </div>
            <div class="item">
              <div class="lineTxt">已完结</div>
              <div class="line" style="background-color: #d7d7d7"></div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="计划及日报" name="second">
        <div class="header">
          <div class="select" v-if="isAdmin">
            <div class="select">
              <div class="title" style="width: 40px">部门:</div>
              <el-cascader
                v-model="query.department"
                placeholder="请选择"
                clearable
                filterable
                @change="departmentChange"
                :options="options.departmentOptions"
                :props="{
                  value: 'id',
                  label: 'name',
                }"
              >
              </el-cascader>
            </div>
            <div class="select">
              <div class="title" style="width: 40px">人员:</div>
              <el-select
                v-model="query.renyuan"
                placeholder="请选择"
                clearable
                filterable
                @change="renyuanChange"
              >
                <el-option
                  v-for="item in options.renyuanOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                  @click.native="renyuanOptionClick(item)"
                >
                </el-option>
              </el-select>
            </div>

            <div>
              <el-button
                type="primary"
                @click="exportReport"
                v-hasPerm="['PORTAL_EXCEL']"
                >导出日报</el-button
              >
            </div>
          </div>
          <div class="left">
            <div>子计划状态:</div>
            <div class="item">
              <div class="lineTxt">待提交</div>
              <div class="line" style="background-color: #f0fff0"></div>
            </div>
            <div class="item">
              <div class="lineTxt">进行中</div>
              <div class="line" style="background-color: #db2b25"></div>
            </div>
            <div class="item">
              <div class="lineTxt">已完结</div>
              <div class="line" style="background-color: #d7d7d7"></div>
            </div>
          </div>
          <div class="right">
            <div>日报状态:</div>
            <div class="item">
              <div class="lineTxt">未提交</div>
              <div class="line" style="background-color: #f9d7dc"></div>
            </div>
            <div class="item">
              <div class="lineTxt">已提交</div>
              <div class="line" style="background-color: #f3f3f3"></div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div
      class="fullCalendarBox"
      style="display: flex; justify-content: left; margin-top: 20px"
    >
      <el-tabs
        v-if="isAdmin"
        v-model="personTab"
        :tab-position="'left'"
        class="demo-tabs"
        @tab-click="renyuanTabsClick"
      >
        <el-tab-pane
          :label="item.name"
          :name="item.id"
          v-for="(item, index) in options.departmentPersonOptions"
          :key="index"
        ></el-tab-pane>
      </el-tabs>

      <FullCalendar
        class="fullCalendar"
        style="width: 90%"
        ref="calendarRef"
        :options="calendarOptions"
      />
    </div>

    <projectPlanAdmin
      :id="id"
      v-model="planVisibleAdmin"
      :title="title"
      @closeLog="planVisibleAdmin = false"
    >
    </projectPlanAdmin>
    <projectPlanUser
      :id="id"
      v-model="planVisibleUser"
      @closeLog="planVisibleUser = false"
      :title="title"
    ></projectPlanUser>
    <daily
      ref="dailyRef"
      v-model="dailyVisible"
      @closeLog="close"
      @clearDaily="clearDaily"
      :dateStr="dateStr"
      :contentId="contentId"
      :contentTxt="contentTxt"
      :benren="benren"
      :file="file"
    ></daily>
  </el-card>
</template>

<script setup lang="ts">
import moment from "moment";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import projectPlanAdmin from "./components/projectPlanAdmin.vue"; //  A-- admin
import projectPlanUser from "./components/projectPlanUser.vue"; // 普通用户 U -- user
import daily from "./components/daily.vue";
import { myDict } from "@/utils/myDict";
import { ref, onMounted, onUpdated, nextTick } from "vue";
import { useRoute } from "vue-router";
import {
  getFullCalendarPlan,
  getDailyPaper,
  getFullCalendarPlanAll,
  getUserList,
  getDepartmentPerson,
  getDepartment,
  exportDailyPaper,
} from "@/api/fullCalendar/index";
// 路由对象
const route = useRoute();
// tab切换卡
const activeName = ref("first");
// 左侧人员tabs
const personTab = ref("");
// 项目计划弹框管理员
const planVisibleAdmin = ref(false);
// 项目计划弹框普通
const planVisibleUser = ref(false);
// 日报弹框
const dailyVisible = ref(false);
// 是否是管理员
const isAdmin = ref(false);
// 是否是普通用户
const isUser = ref(false);
// 是否是本人登录
const benren = ref(true);
// 是否搜索
const isSearch = ref(false);
// 日历ref
const calendarRef = ref();
// 临时id
const id = ref("");
// 日报id
const contentId = ref("");
// 日报日期
const dateStr = ref("");
// 日报开始时间
const time = ref("");
// 开始日期
const start = ref("");
// 结束日期
const end = ref("");
// 查询参数
const query = ref({ renyuan: "", tabRenyuan: "", department: "" });
// 枚举
const options = ref({
  departmentOptions: [],
  departmentPersonOptions: [],
  renyuanOptions: [],
});

// 日历事件模板
// const events = ref([
//   // 子计划
//   {
//     title: "任务名称",
//     start: "2023-08-01 12:30",
//     end: "2023-08-01 13:30",
//     color: "#70b603", // #70b603 待提交 #d9001b 进行中 #d7d7d7 已完结
//     myId: "", // 任务id, 字段名随意 不能是Id
//   }, //可以拖动但不能缩放，但在周、日视图中是可以进行缩放的
//   // 日报
//   {
//     // title: "日报", // 日报title 不用传
//     start: "2023-08-01",
//     display: "background",
//     color: "#d7d7d7", // #d9001b 未提交 #d7d7d7 已提交
//     myContent: "日报内容", // 日报内容, 字段名随意
//   },
// ]);
// 日历事件
const events = ref([]);
// 用户列表
const userList = ref([]);
// 项目名称
const title = ref("");
// 日报内容
const contentTxt = ref("");
// 附件
const file = ref("");
// 当前日历时间段
const dateRange = ref([]);
// 请求参数
const renyuanQuery = ref({ name: "", userId: "" });
// 日报REF
const dailyRef = ref(null);
// 清空 日报信息
const clearDaily = () => {
  nextTick(() => {
    contentTxt.value = "";
    file.value = "";
  });
};
// 关闭dialog
const close = () => {
  activeName.value = "second";
  if (renyuanQuery.value.name && renyuanQuery.value.userId) {
    getDaily(renyuanQuery.value.name, renyuanQuery.value.userId);
  } else {
    getDaily(
      localStorage.getItem("nikename"),
      JSON.parse(localStorage.getItem("users")).id
    );
  }

  dailyVisible.value = false;
  nextTick(() => {
    contentTxt.value = "";
    file.value = "";
  });
};
// 部门
const departmentChange = (e: any) => {
  if (!e) return;
  if (e.length > 0) {
    getDepartmentPerson({ id: e[e.length - 1] }).then(({ data }) => {
      options.value.departmentPersonOptions = data;
      if (data) {
        renyuanTabsClick({ props: { label: data[0].name, name: data[0].id } });
        personTab.value = data[0].id;
      }
    });
  }
};

// 人员搜索select框选择
const renyuanChange = (e: any) => {
  isSearch.value = e;
  if (!e) {
    getDaily(
      localStorage.getItem("nikename"),
      JSON.parse(localStorage.getItem("users")).id
    );
  }
  // getDaily()
};
// 人员搜索select框下拉点击
const renyuanOptionClick = (e: any) => {
  console.log(e);
  renyuanQuery.value.name = e.name;
  renyuanQuery.value.userId = e.user_id;
  getDaily(e.name, e.user_id);
  benren.value = e.user_id == JSON.parse(localStorage.getItem("users")).id;
};
// 人员搜索tab框下拉点击
const renyuanTabsClick = (e: any) => {
  renyuanQuery.value.name = e.props.label;
  renyuanQuery.value.userId = e.props.name;
  getDaily(e.props.label, e.props.name);
  isSearch.value = e.props.name;
  benren.value = e.props.name == JSON.parse(localStorage.getItem("users")).id;
};

// 获取日报以及项目计划
const getDaily = (username: any, userId: any) => {
  calendarOptions.value.events = [];
  getDateRange();
  getFullCalendarPlan({
    executiveProjectLeader: username,
  }).then(({ data }) => {
    events.value = data;
    calendarOptions.value.events.push(...data);
  });
  getDailyPaper({
    createBy: userId,
  }).then(({ data }) => {
    data.records.forEach((item) => {
      if (item.start) {
        item.start = item.start.slice(0, 10);
      }
    });
    calendarOptions.value.events.push(...setDaily(data.records));
    let remarkList = [];
    calendarOptions.value.events.forEach((item) => {
      if (item.commentType == "yes")
        remarkList.push({
          title: "已评论", // 日报title 不用传
          start: item.start,
          color: "#39C5BB", // #d9001b 未提交 #d7d7d7 已提交
          display: "list-item",
        });
    });
    calendarOptions.value.events.push(...remarkList);
    // calendarOptions.value.events.push({
    //   title: "未開始11 ", // 日报title 不用传
    //   start: "2023-08-10",
    //   color: "#f0fff0", // #d9001b 未提交 #d7d7d7 已提交
    //   myContent: "日报内容", // 日报内容, 字段名随意
    // });
    // calendarOptions.value.events.push({
    //   title: "已完結", // 日报title 不用传
    //   start: "2023-08-10",
    //   color: "#d7d7d7", // #d9001b 未提交 #d7d7d7 已提交
    //   myContent: "日报内容", // 日报内容, 字段名随意
    // });
  });
};

// 日报导出
const exportReport = () => {
  if (!renyuanQuery.value.userId) {
    ElMessage.info("请选择人员后再导出");
    return;
  }

  exportDailyPaper({
    userid: renyuanQuery.value.userId,
    userName: renyuanQuery.value.name,
  }).then((res) => {
    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `${renyuanQuery.value.name}日报导出`;
    a.href = objectUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
};

// tab切换
const handleTabClick = (e: any) => {
  isAdmin.value =
    localStorage.getItem("rolelist").includes("系统管理员") ||
    localStorage.getItem("rolelist").includes("项目负责人");
  calendarOptions.value.events = [];
  if (JSON.parse(localStorage.getItem("users")).id == 1) return;
  if (e.props.name == "first") {
    getFullCalendarPlanAll({}).then(({ data }) => {
      calendarOptions.value.events = data;
    });
  } else if (
    e.props.name == "second" &&
    (localStorage.getItem("rolelist").includes("项目执行人") ||
      localStorage.getItem("rolelist").includes("销售人员"))
  ) {
    getDaily(
      localStorage.getItem("nikename"),
      JSON.parse(localStorage.getItem("users")).id
    );
  } else if (e.props.name == "second" && isAdmin.value) {
    query.value.renyuan = options.value.renyuanOptions[0];
    getDaily(
      options.value.renyuanOptions[0].name,
      options.value.renyuanOptions[0].user_id
    );
  }
};

// 设置未填写日报事件
const setDaily = (arr) => {
  let list = [];
  dateRange.value.forEach((element) => {
    let temp = {
      // title: "日报未填写",
      start: element,
      display: "background",
      color: "#eb7c8a", // #d9001b 未提交 #d7d7d7 已提交
      myFlag: true,
    };
    list.push(temp);
  });
  let ids = arr.map((item) => item.start); //只有id的数组
  //最后这里的res数组就是不重复的数组那部分
  let res = list.filter((num) => {
    let res = !(ids.indexOf(num.start) > -1); //添加的数组对象id是否已经存在
    return res; //false表示不符合条件
  });

  return arr.concat(res);
};

// 日历点击
const handleEventClick = (e: any) => {
  console.log(e.event);
  dailyRef.value.isEdit = false;
  if (e.event.extendedProps.planItemId) {
    if (isAdmin.value) {
      planVisibleAdmin.value = true;
      title.value = e.event.title;
      id.value = e.event.extendedProps.planItemId;
    } else if (
      localStorage.getItem("rolelist").includes("项目执行人") ||
      localStorage.getItem("rolelist").includes("销售人员")
    ) {
      planVisibleUser.value = true;
      title.value = e.event.title;
      id.value = e.event.extendedProps.planItemId;
      localStorage.setItem("firstCode", e.event.title.slice(11));
    }
  } else if (e.event.extendedProps.contentTxt) {
    dailyVisible.value = true;
    contentTxt.value = e.event.extendedProps.contentTxt;
    file.value = e.event.extendedProps.file;
    dateStr.value = e.event.startStr;
    contentId.value = e.event.id;
  } else if (e.event.extendedProps.myFlag) {
    if (
      localStorage.getItem("rolelist").includes("项目执行人") ||
      localStorage.getItem("rolelist").includes("销售人员")
    ) {
      if (
        (isAdmin.value && !isSearch.value) ||
        (isAdmin.value &&
          (query.value.renyuan ==
            JSON.parse(localStorage.getItem("users")).id ||
            renyuanQuery.value.userId ==
              JSON.parse(localStorage.getItem("users")).id))
      ) {
        dailyVisible.value = true;
        contentTxt.value = e.event.extendedProps.contentTxt;
        file.value = e.event.extendedProps.file;
        dateStr.value = e.event.startStr;
        contentId.value = e.event.id;
        return;
      } else if (isAdmin.value && isSearch.value) return;

      dailyVisible.value = true;
      contentTxt.value = e.event.extendedProps.contentTxt;
      file.value = e.event.extendedProps.file;
      dateStr.value = e.event.startStr;
      contentId.value = e.event.id;
    }
  }
};

// 日报点击
const handleDateClick = (e: any) => {
  // if (activeName.value == "second" && !isAdmin.value) {
  if (
    activeName.value == "second" &&
    (localStorage.getItem("rolelist").includes("项目执行人") ||
      localStorage.getItem("rolelist").includes("销售人员"))
  ) {
    if (
      moment(new Date().getTime()).format("YYYY-MM-DD") == e.dateStr &&
      !isSearch.value
    ) {
      console.log(contentId.value);
      // dailyVisible.value = true;
      // dateStr.value = e.dateStr;
    }
  }
};

// 日历初始化
const calendarOptions = ref({
  // 引入的插件，比如fullcalendar/daygrid，fullcalendar/timegrid引入后才可显示月，周，日
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
  initialView: "dayGridMonth", // 默认为那个视图（月：dayGridMonth，周：timeGridWeek，日：timeGridDay）
  firstDay: 1, // 设置一周中显示的第一天是哪天，周日是0，周一是1，类推
  locale: "zh-cn", // 切换语言，当前为中文
  eventColor: "#3BB2E3", // 全部日历日程背景色
  themeSystem: "bootstrap", // 主题色(本地测试未能生效)
  // initialDate: moment().format("YYYY-MM-DD"), // 自定义设置背景颜色时一定要初始化日期时间
  timeGridEventMinHeight: "10", // 设置事件的最小高度
  height: 1200,
  // aspectRatio: 1.5, // 设置日历单元格宽度与高度的比例。
  displayEventTime: false, // 是否显示时间
  // hiddenDays: [0, 6],
  // allDaySlot: false, // 周，日视图时，all-day 不显示
  // showNonCurrentDates: false,
  eventOrder: ["title"],
  eventOrderStrict: true,
  eventTextColor: "#000",
  eventLimit: true, // 设置月日程，与all-day slot的最大显示数量，超过的通过弹窗显示
  headerToolbar: {
    // 日历头部按钮位置
    left: "title",
    center: "",
    // right: "today dayGridMonth,timeGridWeek,timeGridDay",
    right: "prev today next",
  },
  buttonText: {
    today: "今天",
    month: "月",
    week: "周",
    day: "日",
  },
  slotLabelFormat: {
    hour: "2-digit",
    minute: "2-digit",
    meridiem: false,
    hour12: false, // 设置时间为24小时
  },
  dayMaxEventRows: 6, // for all non-TimeGrid views
  eventLimitNum: {
    // 事件显示数量限制(本地测试未能生效)
    dayGrid: {
      eventLimit: 5,
    },
    timeGrid: {
      eventLimit: 2, // adjust to 6 only for timeGridWeek/timeGridDay
    },
  },
  events: [],
  // 事件
  eventClick: handleEventClick, // 点击日历日程事件
  dateClick: handleDateClick,
  // eventDblClick: this.handleEventDblClick, // 双击日历日程事件 (这部分是在源码中添加的)
  // eventClickDelete: this.eventClickDelete, // 点击删除标签事件 (这部分是在源码中添加的)
  // eventDrop: this.eventDrop, // 拖动日历日程事件
  // eventResize: this.eventResize, // 修改日历日程大小事件
  // select: this.handleDateSelect, // 选中日历格事件
  // eventDidMount: this.eventDidMount, // 安装提示事件
  // // loading: this.loadingEvent, // 视图数据加载中、加载完成触发（用于配合显示/隐藏加载指示器。）
  // // selectAllow: this.selectAllow, //编程控制用户可以选择的地方，返回true则表示可选择，false表示不可选择
  // eventMouseEnter: this.eventMouseEnter, // 鼠标滑过
  // allowContextMenu: false,
  // editable: true, // 是否可以进行（拖动、缩放）修改
  // eventStartEditable: true, // Event日程开始时间可以改变，默认true，如果是false其实就是指日程块不能随意拖动，只能上下拉伸改变他的endTime
  // eventDurationEditable: true, // Event日程的开始结束时间距离是否可以改变，默认true，如果是false则表示开始结束时间范围不能拉伸，只能拖拽
  // selectable: true, // 是否可以选中日历格
  // selectMirror: true,
  // selectMinDistance: 0, // 选中日历格的最小距离
  // dayMaxEvents: true,
  // weekends: true,
  // navLinks: true, // 天链接
  // selectHelper: false,
  // slotEventOverlap: false, // 相同时间段的多个日程视觉上是否允许重叠，默认true允许
});

// 获取时间段内的所有日期/指定星期几的日期
function setHouseRatesColumn(startTime, endTime, week) {
  week = week == 7 ? 0 : week;
  let dateList = [];
  startTime = new Date(startTime);
  endTime = new Date(endTime);
  while (endTime.getTime() - startTime.getTime() >= 0) {
    let year = startTime.getFullYear();
    let month =
      startTime.getMonth() + 1 < 10
        ? "0" + (startTime.getMonth() + 1)
        : startTime.getMonth() + 1;
    let day =
      startTime.getDate().toString().length == 1
        ? "0" + startTime.getDate()
        : startTime.getDate();
    if (isNaN(week) || startTime.getDay() == week) {
      dateList.push(`${year}-${month}-${day}`);
    }
    startTime.setDate(startTime.getDate() + 1);
  }
  return dateList;
}
// 获取工作日时间
const getDateRange = () => {
  time.value = "2023-01-01";
  // 视图开始时间
  // start.value = moment(time.value.start).format("YYYY-MM-DD");
  start.value = "2023-01-01";
  // 视图结束时间
  end.value = moment(new Date().getTime()).format("YYYY-MM-DD");
  dateRange.value = [];
  dateRange.value.push(...setHouseRatesColumn(start.value, end.value, 1));
  dateRange.value.push(...setHouseRatesColumn(start.value, end.value, 2));
  dateRange.value.push(...setHouseRatesColumn(start.value, end.value, 3));
  dateRange.value.push(...setHouseRatesColumn(start.value, end.value, 4));
  dateRange.value.push(...setHouseRatesColumn(start.value, end.value, 5));
  dateRange.value.push(...setHouseRatesColumn(start.value, end.value, 6));
  dateRange.value.push(...setHouseRatesColumn(start.value, end.value, 7));
};

onMounted(() => {
  if (route.query.noticeId) {
    // routerMeta.value.id = route.query.id;
    activeName.value = "second";
    handleTabClick({ props: { name: "second" } });
  } else {
    getFullCalendarPlanAll({}).then(({ data }) => {
      events.value = data;
      calendarOptions.value.events = data;
    });
  }
  getDepartment().then(({ data }) => {
    options.value.departmentOptions = data;
  });

  getUserList().then(({ data }) => {
    options.value.renyuanOptions = data;
    userList.value = data;
  });
});

onUpdated(() => {
  isAdmin.value =
    localStorage.getItem("rolelist").includes("系统管理员") ||
    localStorage.getItem("rolelist").includes("项目负责人");
  isUser.value =
    localStorage.getItem("rolelist").includes("项目执行人") ||
    localStorage.getItem("rolelist").includes("销售人员");
  myDict({});
});
</script>

<style lang="scss" scoped>
@import "./css/dashboard.scss";
</style>
