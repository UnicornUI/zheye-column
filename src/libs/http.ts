import axios, { AxiosRequestConfig } from "axios";
import store from "../store";

axios.defaults.baseURL = "http://127.0.0.1:7001/";
// axios.defaults.baseURL = "http://api.imooc.com/";
// axios.defaults.baseURL = "http://api.vikingship.xyz:7001/";

// 前置拦截器，设置请求数据加载的提示
axios.interceptors.request.use((config) => {
  store.commit("setLoading", true);
  store.commit("setError", { status: false, message: "" });
  return config;
});

// 后置拦截，判断是否出错，设置错误信息，
// 不管成功与否，都取消数据加载的提示
axios.interceptors.response.use(
  (resp) => {
    store.commit("setLoading", false);
    return resp;
  },
  (e) => {
    // console.log(e);
    const { error } = e.code;
    store.commit("setError", { status: true, message: error });
    store.commit("setLoading", false);
    return Promise.reject(error);
  }
);

export { axios, AxiosRequestConfig };
