<template>
  <div class="column-detail-page w-690">
    <div
      class="column-info row mb-4 border-bottom pb-4 align-items-center"
      v-if="column"
    >
      <div class="col-3 text-center">
        <img
          :src="column.avatar && column.avatar.fitUrl"
          :alt="column.title"
          class="rounded-circle border w-100"
        />
      </div>
      <div class="col-9">
        <h4>{{ column.title }}</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>
    <post-list :list="postList"></post-list>
    <button
      v-if="!isLastPage"
      @click="loadMorePage"
      class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 load-more"
    >
      加载更多
    </button>
  </div>
</template>
<script lang="ts" setup>
import { computed, watch, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { addColumnAvatar } from "../libs/helper";
import { ColumnProps, GlobalDataProps } from "../type/Types";
import useLoadMore from "../hooks/useLoadMore";
import PostList from "../components/PostList.vue";

const store = useStore<GlobalDataProps>();
const route = useRoute();
const currentId = route.params.id as string;
const loaded = reactive({
  currentPage: 0,
  total: 0,
});
const total = computed(() => loaded.total);

watch(store.state.posts.loadedColumns, () => {
  console.log(store.state.posts.loadedColumns);
  const { currentPage, total } = store.getters.getLoadedPost(currentId);
  loaded.currentPage = currentPage;
  loaded.total = total;
});

onMounted(() => {
  console.log(">>>>" + currentId);
  store.dispatch("fetchColumn", currentId);
  store.dispatch("fetchPosts", { columnId: currentId, pageSize: 3 });
});

const column = computed(() => {
  const selectColumn = store.getters.getColumnById(currentId) as
    | ColumnProps
    | undefined;
  console.log(selectColumn);
  if (selectColumn) {
    addColumnAvatar(selectColumn, 100, 100);
  }
  return selectColumn;
});

const params = {
  columnId: currentId,
  pageSize: 3,
  currentPage: loaded.currentPage ? loaded.currentPage + 1 : 2,
};

const { loadMorePage, isLastPage } = useLoadMore("fetchPosts", total, params);

const postList = computed(() => store.getters.getPostByCid(currentId));
</script>

<style scoped>
.w-690 {
  width: 690px;
  margin: 0 auto;
}
.load-more {
  margin-left: 50% !important;
  transform: translate3d(-50%, 0, 0);
}
</style>
