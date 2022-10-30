<template>
  <!-- code... -->
  <div class="create-post-page container">
    <h4>{{ isEditMode ? "编辑文章" : "新建文章" }}</h4>
    <uploader
      action="api/upload"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
      :beforeUpload="uploadCheck"
      :uploaded="uploadedData"
      @file-uploaded-success="onFileUploadedSuccess"
    >
      <h2>点击上传头像</h2>
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
          <img
            :src="((dataProps.uploadedData as ResponseType).data as ImageProps).url"
          />
          <h3>点击重新上传</h3>
        </div>
      </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题: </label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        >
        </validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情: </label>
        <validate-input
          row="10"
          tag="textarea"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        >
        </validate-input>
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">
          {{ isEditMode ? "更新文章" : "发表文章" }}
        </button>
      </template>
    </validate-form>
  </div>
</template>

<script setup lang="ts">
// code...
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import Uploader from "../base/Uploader.vue";
import ValidateForm from "../base/ValidateForm.vue";
import ValidateInput from "../base/ValidateInput.vue";
import {
  GlobalDataProps,
  RuleProps,
  ResponseType,
  ImageProps,
  PostProps,
} from "../type/Types";
import createMessage from "../base/createMessage";
import { beforeUploadedCheck } from "../libs/helper";

//
const store = useStore<GlobalDataProps>();
const router = useRouter();
const route = useRoute();
// 路由中携带的当前文章的 Id
const queryId = route.query.id;
const isEditMode = !!queryId; // !! 可以将变量转换为 boolean 类型，
const uploadedData = ref();
const titleVal = ref("");
let imageId = "";
const titleRules: RuleProps[] = [
  { type: "required", message: "文章标题不能为空" },
];
const contentVal = ref("");
const contentRules: RuleProps[] = [
  { type: "required", message: "文章内容不能为空" },
];

onMounted(() => {
  if (isEditMode) {
    store
      .dispatch("fetchPost", queryId)
      .then((rawData: ResponseType<PostProps>) => {
        const currentPost = rawData.data;
        console.log(currentPost);
        const { image, title, content } = currentPost;
        titleVal.value = title;
        contentVal.value = content || "";
        if (image) {
          uploadedData.value = { data: image };
        }
      });
  }
});

const onFileUploadedSuccess = (rawData: ResponseType<ImageProps>) => {
  if (rawData.data._id) {
    imageId = rawData.data._id;
  }
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
    createMessage("上传图片大小不能超过1MB!!", "error");
  }
  return passed;
};

const onFormSubmit = (result: boolean) => {
  if (result) {
    const { column, _id } = store.state.user;
    if (column) {
      const newPost: PostProps = {
        title: titleVal.value,
        content: contentVal.value,
        column,
        author: _id,
      };
      if (imageId) {
        newPost.image = imageId;
      }
      const actionName = isEditMode ? "updatePost" : "createPost";
      const sendData = isEditMode
        ? {
            id: queryId,
            payload: newPost,
          }
        : newPost;
      store.dispatch(actionName, sendData).then(() => {
        createMessage("发表成功, 2秒后跳转到文章", "success", 2000);
        setTimeout(() => {
          return router.push({ name: "column", params: { id: column } });
        }, 2000);
      });
    }
  }
};
</script>

<style scoped>
/* code... */
</style>
