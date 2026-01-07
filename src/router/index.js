import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/pinia/userStore";
import Layout from "@/layouts/Layout.vue";

// 静态路由
const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/Login.vue"),
    meta: { title: "用户登录", requiresAuth: false },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/pages/Register.vue"),
    meta: { title: "用户注册", requiresAuth: false },
  },
  // 登录后布局
  {
    path: "/home",
    name: "Home",
    component: Layout,
    meta: { title: "首页", requiresAuth: true },
    children: [
      // 首页
      {
        path: "",
        component: () => import("@/pages/HomeIndex.vue"),
      },
      // 社团管理
      {
        path: "club/list",
        name: "ClubList",
        component: () => import("@/pages/club/ClubList.vue"),
        meta: { title: "社团列表" },
      },
      {
        path: "club/detail/:id",
        name: "ClubDetail",
        component: () => import("@/pages/club/ClubDetail.vue"),
        meta: { title: "社团详情" },
      },
      {
        path: "club/my",
        name: "MyClub",
        component: () => import("@/pages/club/MyClub.vue"),
        meta: { title: "我的社团" },
      },
      {
        path: "club/my/applications",
        name: "MyClubApplication",
        component: () => import("@/pages/club/MyClubApplication.vue"),
        meta: { title: "我的社团申请" },
      },
      // 活动管理
      {
        path: "activity/list",
        name: "ActivityList",
        component: () => import("@/pages/activity/ActivityList.vue"),
        meta: { title: "活动列表" },
      },
      {
        path: "activity/detail/:id",
        name: "ActivityDetail",
        component: () => import("@/pages/activity/ActivityDetail.vue"),
        meta: { title: "活动详情" },
      },
      {
        path: "activity/my-signups",
        name: "MyActivitySignup",
        component: () => import("@/pages/activity/MyActivitySignup.vue"),
        meta: { title: "我的活动报名" },
      },
      // 用户信息
      {
        path: "user/info",
        name: "UserInfo",
        component: () => import("@/pages/user/UserInfo.vue"),
        meta: { title: "个人信息" },
      },
    ],
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: routes || [],
});

// 路由守卫：拦截未登录访问
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title + " - 校园社团活动平台";
  }
  // 判断是否需要登录
  if (to.meta.requiresAuth) {
    if (userStore.token) {
      next();
    } else {
      next("/login"); // 未登录跳转到登录页
    }
  } else {
    next();
  }
});

export default router;
