/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from "axios";
import { ElLoading, ElMessage } from "element-plus";
import { getToken, removeToken } from "./auth";
// 环境的切换
let baseURL = "";

if (process.env.NODE_ENV == "development") {
  baseURL = "https://ws.fcios.net/";
} else if (process.env.NODE_ENV == "debug") {
  baseURL = "https://ws.fcios.net/";
} else if (process.env.NODE_ENV == "production") {
  baseURL = "https://ws.fcios.net/";
}

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: baseURL,
  // 超时
  timeout: 30 * 24 * 60 * 60 * 1000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    config.headers = config.header || {
      "Content-Type": "multipart/form-data",
    };
    const isToken = (config.headers || {}).isToken === false;
    if (getToken() && !isToken) {
      config.headers["Authorization"] = "Bearer " + getToken();
    }
    return config;
  },
  (error) => {
    return Promise.error(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      if (response.data.code == 200) {
        return Promise.resolve(response.data);
      } else if (response.data.code == 401) {
        removeToken();
        localStorage.removeItem("virtualUserInfo");
        ElMessage({
          message: response.data.msg,
          type: "error",
        });
        setTimeout(() => {
          location.href = "/";
        }, 1000);
        return Promise.reject(response);
      } else {
        ElMessage({
          message: response.data.msg || "后台接口异常，请联系管理员！",
          type: "error",
        });
        return Promise.reject(response);
      }
    } else {
      ElMessage({
        message: response.data.msg || "后台接口异常，请联系管理员！",
        type: "error",
      });
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况
  (error) => {
    console.log(error);
    ElMessage({
      message: error || "后台接口异常，请联系管理员！",
      type: "error",
    });
  }
);

export default service;
