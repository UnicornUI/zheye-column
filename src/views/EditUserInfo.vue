<template>
  <!-- code... -->
  <div class="update-profile-page w-690">
    <ul class="nav nav-tabs my-4">
      <li class="nav-item">
        <a href="#" class="nav-link" :class="{ active: activeIndex === 1 }" @click="changeTab(1)">更新个人资料</a>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link" :class="{ active: activeIndex === 2 }" @click="changeTab(2)">更新专栏信息</a>
      </li>
    </ul>
    <h4>编辑个人资料</h4>
    <uploader :action="`api/upload`"
      class="d-flex align-items-center justify-content-center bg-light text-secondary circle mx-auto my-3"
      :beforeUpload="uploadCheck" :uploaded="uploadedData" @file-uploaded-success="onFileUploadedSuccess">
      <h2>点击上传图像</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <div class="uploaded-area">
          <img :src="((dataProps.uploadedData as ResponseType).data as ImageProps).fitUrl" />
          <h3>点击重新上传</h3>
        </div>
      </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit" v-if="activeIndex === 1">
      <label class="form-label">用户名</label>
      <validate-input :rules="nameRules" v-model="nickName" placeholder="请输入用户名" type="text" />
      <label class="form-label">用户信息描述</label>
      <validate-input :rules="descriptionRules" v-model="description" placeholder="请输出用户描述" tag="textarea" />
      <template #submit>
        <button class="btn btn-primary btn-large">提交修改</button>
      </template>
    </validate-form>
    <validate-form @form-submit="onFormSubmit" v-if="activeIndex === 2">
      <label class="form-label">专栏标题</label>
      <validate-input :rules="nameRules" v-model="title" placeholder="请输入专栏标题" type="text" />
      <label class="form-label">专栏信息描述</label>
      <validate-input :rules="descriptionRules" v-model="columnDescription" placeholder="其输入专栏描述" tag="textarea" />
      <template #submit>
        <button class="btn btn-primary btn-large">提交修改</button>
      </template>
    </validate-form>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted, ref } from "vue";
import {
  ColumnProps,
  GlobalDataProps,
  ImageProps,
  ResponseType,
  RuleProps,
  UserProps,
} from "../type/Types";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Uploader from "../base/Uploader.vue";
import validateForm from "../base/ValidateForm.vue";
import validateInput from "../base/ValidateInput.vue";
import createMessage from "../base/createMessage";
import { beforeUploadedCheck } from "../libs/helper";
import { generateFitUrl } from "../libs/helper";

const store = useStore<GlobalDataProps>();
const router = useRouter();
const activeIndex = ref(1);
const nickName = ref("");
const description = ref("");
const title = ref("");
const columnDescription = ref("");
let uploadedData = ref();
let imageId = "";
let userAvatar = {};
let columnAvatar = {};

const changeTab = (index: number) => {
  activeIndex.value = index;
  imageId = "";
};

const uploadCheck = (file: File) => {
  const result = beforeUploadedCheck(file, {
    format: ["image/jpeg", "image/png"],
    size: 1,
  });
  const { passed, error } = result;
  if (error === "format") {
    createMessage("上传图片只能是 JPG/PNG 格式!!", "error");
  }
  if (error === "size") {
    createMessage("上传图片大小不能超过 1M !!", "error");
  }
  return passed;
};

const nameRules: RuleProps[] = [{ type: "required", message: "信息不能为空" }];

const descriptionRules: RuleProps[] = [{ type: "required", message: "描述信息不能为空" }];

onMounted(() => {
  store.dispatch("fetchCurrentUser").then((rawData: ResponseType<UserProps>) => {
    const currentUser = rawData.data;
    // console.log(currentUser);
    const { nickName: name, description: desc, avatar } = currentUser;
    nickName.value = name as string;
    description.value = desc as string;
    if (avatar) {
      generateFitUrl(avatar as ImageProps, 200, 200, ["m_fill"]);
      userAvatar = { data: avatar };
      uploadedData.value = { data: avatar };
    }
  });
  // 加载专栏的信息
  store
    .dispatch("fetchColumn", store.state.user.column)
    .then((rawData: ResponseType<ColumnProps>) => {
      const currentColumn = rawData.data;
      //console.log(currentColumn);
      const { title: columnTitle, description: columnDesc, avatar } = currentColumn;
      title.value = columnTitle;
      columnDescription.value = columnDesc;
      if (avatar) {
        generateFitUrl(avatar as ImageProps, 200, 200, ["m_fill"]);
        columnAvatar = { data: avatar };
      }
    });
});

watch(activeIndex, () => {
  if (activeIndex.value === 1) {
    uploadedData.value = userAvatar;
  } else {
    uploadedData.value = columnAvatar;
  }
});

const onFileUploadedSuccess = (rawData: ResponseType<ImageProps>) => {
  if (rawData.data._id) {
    imageId = rawData.data._id;
  }
};

const onFormSubmit = (result: boolean) => {
  if (result) {
    let param: UserProps | ColumnProps;
    let action: string;
    if (activeIndex.value === 1) {
      action = "updateUser";
      param = {
        _id: store.state.user._id,
        nickName: nickName.value,
        description: description.value,
        isLogin: true,
      };
    } else {
      action = "updateColumn";
      param = {
        _id: store.state.user.column as string,
        title: title.value,
        description: columnDescription.value,
      };
    }
    if (imageId) {
      param.avatar = imageId;
    }
    store.dispatch(action, { id: param._id, payload: param }).then(() => {
      createMessage("修改成功, 2秒后跳转到首页", "success", 2000);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    });
  }
};
</script>

<style scoped>
.w-690 {
  width: 690px;
  margin: 0 auto;
}

.update-profile-page {
  position: relative;
}
</style>
