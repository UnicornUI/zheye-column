<template>
  <!-- code... -->
  <div class="user-profile-component">
    <div class="d-flex align-items-center">
      <img
        :src="fitUrl"
        :alt="user.nickName"
        class="rounded-circle img-thumbnail"
      />&nbsp;&nbsp;
      <div class="detail ml-2">
        <h6 class="d-block mb-0">{{ user.nickName }}</h6>
        <span class="text-truncate text-muted d-block">{{
          user.description
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// code...
import { PropType, computed } from "vue";
import { UserProps, ImageProps } from "../type/Types";
import { addColumnAvatar } from "../libs/helper";

const props = defineProps({
  user: {
    type: Object as PropType<UserProps>,
    required: true,
  },
});

const fitUrl = computed(() => {
  addColumnAvatar(props.user, 50, 50);
  const { avatar } = props.user;
  return avatar && (avatar as ImageProps).fitUrl;
});
</script>

<style scoped>
/* code... */
</style>
