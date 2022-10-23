<template>
  <!-- code... -->
  <div class="login-page mx-auto p-3 w-330">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input type="text" placeholder="请输入邮箱地址" :rules="emailRules" v-model="emailVal" />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input type="password" placehold="请输入密码" :rules="passwordRules" v-model="passwordVal" />
        <div class="form-text">
          <a href="/signup" class="">还没有账户? 去注册一个新的吧!</a>
        </div>
      </div>
      <template v-slot:submit>
        <button type="submit" class="btn btn-primary btn-block btn-large w-100">登录</button>
      </template>
    </validate-form>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import ValidateInput from "../base/ValidateInput.vue";
import ValidateForm from "../base/ValidateForm.vue";
import { RuleProps, GlobalDataProps } from "../type/Types";
import createMessage from "../base/createMessage";

const emailVal = ref("");
const emailRules: RuleProps[] = [
  {type: "required", message: "电子邮箱地址不能为空"},
  {type: "email", message: "请输入正确的电子邮箱地址"},
]

const passwordVal = ref("");
const passwordRules: RuleProps[] = [
  { type : "required", message: "密码不能为空"},
]

const router = useRouter();
const store = useStore<GlobalDataProps>();

const onFormSubmit = (result: boolean) => {
  if (result)  {
    const payload = {
      email: emailVal.value,
      password: passwordVal.value,
    }
    store.dispatch("loginAndFetch", payload).then(res => {
      console.log(res);
      createMessage("登录成功，2秒后跳转首页", "success");
      setTimeout(() => {
        router.push("/")
      }, 2000);
    }).catch(e => {
      console.log(e);
    })
  }
};
</script>

<style scoped>
/* code... */
.w-330 {
  max-width: 330px;
}
.btn-block {
  width: 100%;
  display: block;
}
</style>
