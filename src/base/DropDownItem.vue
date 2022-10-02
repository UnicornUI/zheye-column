<template>
  <!-- code... -->
  <li class="dropdown-option" :class="{ 'is-disabled': disabled }">
    <slot></slot>
  </li>
</template>

<script lang="ts" setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
/* code... */
.dropdown-option.is-disabled * {
  color: #6c757d;
  pointer-events: none;
  background-color: transparent;
}
</style>
