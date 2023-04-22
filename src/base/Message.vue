<template>
  <teleport to="#message">
    <div v-if="isVisible" class="alert message-info fixed-top w-50 mx-auto d-flex justify-content-between mt-2"
      :class="classObject">
      <span>{{ message }}</span>
      <button type="button" class="close btn-close" aria-label="Close" @click.prevent="hide">
      </button>
    </div>
  </teleport>
</template>

<script setup lang='ts'>

import useDOMCreate from "../hooks/useDOMCreate";
import { PropType, ref } from "vue";
import { MessageType } from "../type/Types";

// 定义属性
const props = defineProps({
  message: String,
  type: {
    type: String as PropType<MessageType>,
    default: "default"
  }
});

// 定义事件
const emits = defineEmits(['close-message']);

useDOMCreate("message");

const isVisible = ref(true);

const classObject = {
  "alert-success": props.type === 'success',
  "alert-danger": props.type === 'error',
  "alert-primary": props.type === 'default',
}

const hide = () => {
  isVisible.value = false;
  emits('close-message', true);
}

</script>

<style scoped></style>

