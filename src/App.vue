<template>
  <div class="container-fluid px-0 flex-shrink-0">
    <global-header :user="currentUser" />
    <router-view></router-view>
    <loader v-if="isLoading" text="拼命加载中..." background="rgba(0, 0, 0, 0.8)"></loader>
  </div>
  <footer class="text-center py-4 text-secondary bg-light mt-auto">
    <small>
      <li class="list-inline-item">© 2020 者也专栏</li>
      <ul class="list-inline mb-0">
        <li class="list-inline-item">课程</li>
        <li class="list-inline-item">文档</li>
        <li class="list-inline-item">联系</li>
        <li class="list-inline-item">更多</li>
      </ul>
    </small>
  </footer>
  <!--<HelloWorld msg="Vite + Vue" /> -->
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from "./components/HelloWorld.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import { computed, watch } from "vue";
import { useStore } from "vuex";
import GlobalHeader from "./components/GlobalHeader.vue";
import Loader from './base/Loader.vue';
import createMessage from "./base/createMessage";
import { GlobalDataProps } from "./type/Types";

const store = useStore<GlobalDataProps>();

const currentUser = computed(() => {
  return store.state.user;
});

const isLoading = computed(() => {
  return store.state.loading;
});

const error = computed(() => {
  return store.state.error;
});

watch(() => error.value.status, () => {
  const { status, message } = error.value
  if (status && message) {
    createMessage(message, "error");
  }
});

</script>

<style scoped>
/*
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
*/
</style>
