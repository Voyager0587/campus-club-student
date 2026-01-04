import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStore } from "@/pinia/userStore";
import router from "@/router";

// 创建axios实例
const service = axios.create({
  baseURL: "", // 已通过Vite proxy配置跨域，无需填写baseURL
  timeout: 5000,
});

// 请求拦截器：添加Token
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers["Authorization"] = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// 响应拦截器：统一处理响应和异常
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 操作成功（code=200）
    if (res.code === 200) {
      return res;
    } else {
      // 业务异常提示
      ElMessage.error(res.message || "操作失败");
      return Promise.reject(new Error(res.message || "Error"));
    }
  },
  (error) => {
    const userStore = useUserStore();
    // 状态码判断
    switch (error.response?.status) {
      case 401: // 未登录/Token过期
        ElMessageBox.confirm("登录状态已过期，请重新登录", "提示", {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          userStore.logout(); // 清除用户信息
          router.push("/login"); // 跳转到登录页
        });
        break;
      case 403: // 权限不足
        ElMessage.error("没有操作权限");
        break;
      case 400: // 参数校验失败
        ElMessage.error("参数填写错误，请检查后重试");
        break;
      case 500: // 服务器异常
        ElMessage.error("服务器内部错误，请稍后再试");
        break;
      default:
        ElMessage.error(error.message || "请求异常");
    }
    return Promise.reject(error);
  }
);

export default service;
