<template>
  <div class="row">
    <div v-for="column in columnList" :key="column._id" class="col-4 mb-4">
      <div class="card h-100 shadom-sm">
        <div class="card-body text-center">
          <img
            :src="column.avatar && column.avatar.fitUrl"
            :alt="column.title"
            class="rounded-cicle border border-light w-25 my-3"
          />
          <h5 class="card-title">{{ column.title }}</h5>
          <p class="card-text text-left">{{ column.description }}</p>
          <router-link
            :to="`/column/${column._id}`"
            class="btn btn-outline-primary"
            >进入专栏</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PropType, computed } from "vue";
import { ColumnProps } from "../type/Types";
import { addColumnAvatar } from "../libs/helper";

// defineProps 是在 setup 语法块中才能使用的
// 用于接收父级组件中传递的值
const props = defineProps({
  list: {
    type: Array as PropType<ColumnProps[]>,
    required: true,
  },
});

const columnList = computed(() => {
  return props.list.map((column: ColumnProps) => {
    addColumnAvatar(column, 50, 50);
    return column;
  });
});
</script>
