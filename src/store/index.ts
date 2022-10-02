import { createStore, Commit } from "vuex";
import { testColumns } from "../data/columnlist";
import { testPosts } from "../data/PostProps";
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
    login(state) {
      state.user = { ...state.user, isLogin: true, nickname: "viking" };
    },
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
