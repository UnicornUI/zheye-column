<template>
  <!-- code... -->
  <div class="validate-input-container pb-3">
    <input
      type="text"
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      :value="inputRef.val"
      @blur="validateInput"
      @keyup="updateValue"
    />
    <span v-if="inputRef.error" class="invalid-feedback">{{
      inputRef.message
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import { reactive, PropType, onMounted } from "vue";
import { RuleProps } from "../type/Types";
import { emitter } from "./ValidateForm.vue";
const emailReg =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const props = defineProps({
  rules: Array as PropType<RuleProps[]>,
  modelValue: String,
});

const emits = defineEmits(["update:modelValue"]);

const inputRef = reactive({
  val: props.modelValue || "",
  error: false,
  message: "",
});

const updateValue = (e: KeyboardEvent) => {
  const targetValue = (e.target as HTMLInputElement).value;
  inputRef.val = targetValue;
  emits("update:modelValue", targetValue);
};

const validateInput = () => {
  if (props.rules) {
    const allPassed = props.rules.every((rule) => {
      let passed = true;
      inputRef.message = rule.message;
      switch (rule.type) {
        case "required":
          passed = !(inputRef.val.trim() === "");
          break;
        case "email":
          passed = emailReg.test(inputRef.val);
          break;
        default:
          break;
      }
      return passed;
    });
    inputRef.error = !allPassed;
  }
};

onMounted(() => {
  emitter.emit("form-item-created", validateInput);
});
</script>
<style scoped>
/* code... */
</style>
