<template>
  <!-- code... -->
  <div class="login-page mx-auto p-3 w-330">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input />
        <validate-input />
      </div>
    </validate-form>
  </div>
</template>
<script lang="ts" setup>
import ValidateInput from "../base/ValidateInput.vue";
import ValidateForm from "../base/ValidateForm.vue";
const onFormSubmit = () => {};
</script>

<style scoped>
/* code... */
</style>
