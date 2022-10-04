import { createStore, Commit } from "vuex";
// import { testColumns } from "../data/columnlist";
// import { testPosts } from "../data/PostProps";
import { localType, storageHandler } from "../libs/storeage";
import { axios, AxiosRequestConfig } from "../libs/http";
import { arrToObj, objToArr } from "../libs/helper";
import {
  GlobalDataProps,
  GlobalErrorProps,
  UserProps,
  ColumnProps,
  PostProps,
} from "../type/Types";

const asyncAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
  config: AxiosRequestConfig = { method: "get" },
  extraData?: any
) => {
  const { data } = await axios(url, config);
  if (extraData) {
    commit(mutationName, { data, extraData });
  } else {
    commit(mutationName, data);
  }
  return data;
};

const store = createStore<GlobalDataProps>({
  state: {
    token: storageHandler.getItem(localType, "token") || "",
    loading: false,
    columns: { data: {}, currentPage: 0, total: 0 },
    error: { status: false },
    posts: { data: {}, loadedColumns: {} },
    user: { isLogin: false },
  },
  mutations: {
    fetchColumns(state, rawData) {
      const { data } = state.columns;
      const { list, count, currentPage } = rawData.data;
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        currentPage: currentPage * 1,
      };
    },
    fetchColumn(state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data;
    },
    setLoading(state, status) {
      state.loading = status;
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e;
    },
    login(state, rawData) {
      const { token } = rawData.data;
      state.token = token;
      storageHandler.setItem(localType, "token", token);
      state.user = { ...state.user, isLogin: true, nickname: "viking" };
      // axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    fetchCurrentUser(state,rawData) {
      // console.log(rawData.data);
      state.user = { isLogin: true, ...rawData.data }
    },
    logout(state) {
      state.token = "";
      state.user = { isLogin: false};
      storageHandler.remove(localType, "token");
      delete axios.defaults.headers.common.Authorization;
    }
  },
  actions: {
    fetchColumns({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params;
      if (state.columns.currentPage < currentPage) {
        console.log(state.columns.currentPage, currentPage);
        return asyncAndCommit(
          `/api/columns?currentPage=${currentPage}&pageSize=${pageSize}`,
          "fetchColumns",
          commit
        );
      }
    },
    fetchColumn({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return asyncAndCommit(`/api/columns/${cid}`, "fetchColumn", commit);
      }
    },
    loginAndFetch({dispatch}, loginData) {
      return dispatch("login", loginData).then(() => {
        return dispatch("fetchCurrentUser");
      })
    },
    login({commit}, payload) {
      return asyncAndCommit("/api/user/login","login", commit, { method: "post", data: payload});
    },
    fetchCurrentUser({commit}) {
      return asyncAndCommit("/api/user/currentUser","fetchCurrentUser", commit);
    },
    register({commit}, payload) {
      return asyncAndCommit("/api/users/", "register", commit, { method: "post", data: payload });
    },
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns.data);
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id];
    },
  },
});

export default store;
