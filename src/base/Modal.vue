<template>
  <!-- code... -->
  <teleport to="#modal">
    <div class="modal d-block" tabindex="-1" v-if="visible">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="close btn-close" data-dismiss="modal" aria-label="Close" @click="onClose">
              <!--<span aria-hidden="true">&times;</span> -->
            </button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="onClose">
              取消
            </button>
            <button type="button" class="btn btn-primary" @click="onConfirm">
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
// code...
import useDOMCreate from "../hooks/useDOMCreate";
defineProps({
  title: String,
  visible: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["modal-on-close", "modal-on-confirm"]);

useDOMCreate("modal");

const onClose = () => {
  emits("modal-on-close");
};

const onConfirm = () => {
  emits("modal-on-confirm");
};
</script>

<style scoped>
/* code... */
</style>
