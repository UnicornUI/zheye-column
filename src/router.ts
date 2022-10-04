import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Signup from "./views/Signup.vue";
import CreatePost from "./views/CreatePost.vue";
import store from "./store";

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
      path: "/create",
      name: "create",
      component: CreatePost,
      meta: { requiredLogin: true },
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup,
    }
  ],
});

router.beforeEach((to, from, next) => {
  /*
   * 第一版本：没有 token 验证的版本
   */
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
});

export default router;
