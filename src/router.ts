import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Signup from "./views/Signup.vue";
import CreatePost from "./views/CreatePost.vue";
import ColumnDetail from "./views/ColumnDetail.vue";
import PostDetail from "./views/PostDetail.vue";
import NotFound from "./views/NotFound.vue";
import EditUserInfo from "./views/EditUserInfo.vue";
import store from "./store";
import { axios } from "./libs/http";

const routerHistory = createWebHistory();
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { redirectAlreadyLogin: true },
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup,
      meta: { redirectAlreadyLogin: true },
    },
    {
      path: "/column/:id",
      name: "column",
      component: ColumnDetail,
    },
    {
      path: "/create",
      name: "create",
      component: CreatePost,
      meta: { requiredLogin: true },
    },
    {
      path: "/posts/:id",
      name: "post",
      component: PostDetail,
    },
    {
      path: "/edit/:id",
      name: "edit",
      component: EditUserInfo
    },
    {
      path: "/*",
      name: "notFound",
      components: NotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  /*
  // 1. 第一版本：没有 token 验证的版本
  // ------------------------------------------------------------
  // 结构对象，使用起来更加的方便
  const { requiredLogin, redirectAlreadyLogin } = to.meta;
  // 判断是否已经登录，没有登录的时候需要重定向到登录界面
  if (requiredLogin && !store.state.user.isLogin) {
    next({ name: "login" });
  } else if (redirectAlreadyLogin && store.state.user.isLogin) {
    next("/");
  } else {
    next();
  }
  */

  // 2. 第二个版本，用户登录信息功能已经完成，token 进行了本地的持久化
  // -------------------------------------------------------------
  // vuex 每次刷新页面都会重新刷新构建，这样会使得我们丢失登录信息
  // 我们借助我们已经 token 信息，重新加载出用户信息
  const { user, token } = store.state;
  const { requiredLogin, redirectAlreadyLogin } = to.meta;

  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      store
        .dispatch("fetchCurrentUser")
        .then(() => {
          if (redirectAlreadyLogin) {
            next("/");
          } else {
            next();
          }
        })
        .catch((err) => {
          console.log(err);
          store.commit("logout");
          next("login");
        });
    } else {
      if (requiredLogin) {
        next("login");
      } else {
        next();
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next("/");
    } else {
      next();
    }
  }
});

export default router;
