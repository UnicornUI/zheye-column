<template>
  <!-- code... -->
  <div class="validate-input-container pb-3">
    <input v-if="tag !== 'textarea'" class="form-control" :class="{ 'is-invalid': inputRef.error }" v-model="inputRef.val"
      @blur="validateInput" v-bind="$attrs" />
    <textarea v-else class="form-control" :class="{ 'is-invalid': inputRef.error }" @blur="validateInput"
      v-model="inputRef.val" v-bind="$attrs" />
    <span v-if="inputRef.error" class="invalid-feedback">{{
      inputRef.message
    }}</span>
  </div>
</template>

<script lang="ts" setup>

import { reactive, PropType, onMounted, computed } from "vue";
import { RuleProps } from "../type/Types";
import { emitter } from "./ValidateForm.vue";

export type TagType = "input" | "textarea" | "custom";
const emailReg =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const props = defineProps({
  rules: Array as PropType<RuleProps[]>,
  modelValue: String,
  tag: {
    type: String as PropType<TagType>,
    default: 'input'
  }
});

const emits = defineEmits(["update:modelValue"]);

const inputRef = reactive({
  val: computed({
    get: () => props.modelValue || "",
    set: val => {
      emits('update:modelValue', val)
    }
  }),
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
        case "custom":
          passed = rule.validator ? rule.validator() : true;
          break;
        default:
          break;
      }
      return passed;
    });
    inputRef.error = !allPassed;
    return allPassed;
  }
  return true;
};

onMounted(() => {
  emitter.emit("form-item-created", validateInput);
});

</script>
<style scoped>
/* code... */
</style>
