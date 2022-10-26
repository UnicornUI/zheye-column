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
    fetchPosts(state, { data: rawData, extraData: columnId }) {
      const { data } = state.posts;
      const { list, count, currentPage } = rawData.data;
      state.posts.data = { ...data, ...arrToObj(list) };
      state.posts.loadedColumns[columnId] = {
        columnId: columnId,
        total: count,
        currentPage: currentPage * 1,
      };
    },
    fetchPost(state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data;
    },
    createPost(state, newPost) {
      state.posts.data[newPost._id] = newPost;
    },
    updatePost(state, { data }) {
      state.posts.data[data._id] = data;
    },
    deletePost(state, { data }) {
      delete state.posts.data[data._id];
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
      state.user = { ...state.user, isLogin: true };
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    },
    fetchCurrentUser(state, rawData) {
      // console.log(rawData.data);
      state.user = { isLogin: true, ...rawData.data };
    },
    logout(state) {
      state.token = "";
      state.user = { isLogin: false };
      storageHandler.remove(localType, "token");
      delete axios.defaults.headers.common.Authorization;
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
    fetchPosts({ state, commit }, params = {}) {
      const { columnId, currentPage = 1, pageSize = 3 } = params;
      const loadedPost = state.posts.loadedColumns[columnId];
      if (!loadedPost) {
        return asyncAndCommit(
          `/api/columns/${columnId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`,
          "fetchPosts",
          commit,
          { method: "get" },
          columnId
        );
      } else {
        const loadedPostCurrentPage = loadedPost.currentPage || 0;
        if (loadedPostCurrentPage < currentPage) {
          return asyncAndCommit(
            `/api/columns/${columnId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`,
            "fetchPosts",
            commit,
            { method: "get" },
            columnId
          );
        }
      }
    },
    fetchPost({ state, commit }, id) {
      const currentPost = state.posts.data[id];
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit(`/api/posts/${id}`, "fetchPost", commit);
      } else {
        return Promise.resolve({ data: currentPost });
      }
    },
    createPost({ commit }, payload) {
      return asyncAndCommit(`/api/posts`, "createPost", commit, {
        method: "post",
        data: payload,
      });
    },
    updatePost({ commit }, { id, payload }) {
      return asyncAndCommit(`/api/posts/${id}`, "updatePost", commit, {
        method: "patch",
        data: payload,
      });
    },
    deletePost({ commit }, id) {
      return asyncAndCommit(`/api/posts/${id}`, "deletePost", commit, {
        method: "delete",
      });
    },
    async loginAndFetch({ dispatch }, loginData) {
      await dispatch("login", loginData);
      return await dispatch("fetchCurrentUser");
    },
    login({ commit }, payload) {
      return asyncAndCommit("/api/user/login", "login", commit, {
        method: "post",
        data: payload,
      });
    },
    fetchCurrentUser({ commit }) {
      return asyncAndCommit("/api/user/current", "fetchCurrentUser", commit);
    },
    register({ commit }, payload) {
      return asyncAndCommit("/api/users/", "register", commit, {
        method: "post",
        data: payload,
      });
    },
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns.data);
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id];
    },
    getLoadedPost: (state) => (id: string) => {
      return state.posts.loadedColumns[id];
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.data[id];
    },
    getPostByCid: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter((post) => post.column === cid);
    },
  },
});

export default store;
