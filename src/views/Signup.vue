<template>
  <div class="signup-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">注册者也账户</h5>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input 
          type="text"
          placeholder="请输入邮箱地址"
          :rules="emailRules"
          v-model="formData.email"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">昵称</label>
        <validate-input
          type="text"
          placeholder="请输入昵称"
          :rules="nicknameRules"
          v-model="formData.nickname"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input 
          type="password"
          placeholder="请输入密码"
          :rules="passwordRules"
          v-model="formData.password"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">重复密码</label>
        <validate-input
          type="password"
          placeholder="请再次输入密码"
          :rules="repeatPasswordRules"
          v-model="formData.repeatPassword"
        />
        <div class="form-text">
          <a href="/login" class="">已经有账号了? 去登录</a>
        </div>
      </div>
      <template v-slot:submit>
        <button type="submit" class="btn btn-primary btn-block btn-large">注册新用户</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import ValidateForm from "../base/ValidateForm.vue";
import ValidateInput from "../base/ValidateInput.vue";

import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { RuleProps, GlobalDataProps } from "../type/Types";
import createMessage from "../base/createMessage";

const formData = reactive({
  email: "",
  nickname: "",
  password: "",
  repeatPassword: ""
});


const emailRules: RuleProps[] = [
  {type: "required", message: "电子邮件的地址不能为空"},
  {type: "email", message: "请输入正确的电子邮件格式"},
]

const nicknameRules: RuleProps[] = [
  {type: "required", message:"昵称不能为空" }
]

const passwordRules: RuleProps[] = [
  {type: "required", message: "密码不能为空"}
]

const repeatPasswordRules: RuleProps[] = [
  {type: "required", message: "重复密码不能为空"},
  {
    type: "custom",
    validator: () => { return formData.password === formData.repeatPassword},
    message: "两次密码不相同",
  }
]

const router = useRouter();
const store = useStore<GlobalDataProps>();

const onFormSubmit = (result: boolean) => {
  if(result) {
    const payload = {
      email: formData.email,
      password: formData.password,
      nickname: formData.nickname
    };
    store.dispatch("register", payload).then(() => {
      createMessage("注册成功, 正在跳转登录页面", "success");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }).catch(e => {
      console.log(e);
    });
  }
}
</script>

<style scoped>

</style>
