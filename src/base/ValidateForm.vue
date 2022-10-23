<template>
  <!-- code... -->
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>
<script lang="ts">
// 对于某些运行副作用或只能执行一次, 声明命名导出，组件重命名，
// 无法在 setup 代码块中申明的选项，可以使用普通的 script 标签来处理。
/**
export default {
    name: 'ComponentName',
    inheritAttrs: false,
    customOptions: {}
}

// 在模块范围下执行一次
runsideEffectOnce()

*/
export const emitter: Emitter<any> = mitt();
</script>


<script setup lang="ts">
// code...
import { onUnmounted } from "vue";
import mitt, { Emitter } from "mitt";
type ValidateFunc = () => boolean;

// 实例化 mitt
const emits = defineEmits(["form-submit"]);

let funcArr: ValidateFunc[] = [];

const submitForm = () => {
  // 循环执行数组，得到最终的验证结果
  const result = funcArr
  .map((func) => {
    return func();
  })
  .every((result) => {
    return result;
  });
  emits("form-submit", result);
};

// 将监听得到的验证函数都存到一个数组中
const callback = (func?: ValidateFunc) => {
  if (func) funcArr.push(func);
};

// 添加监听
emitter.on("form-item-created", callback);

onUnmounted(() => {
  // 删除监听
  emitter.off("form-item-created", callback);
  funcArr = [];
});
</script>
<style scoped>
/* code... */
</style>
