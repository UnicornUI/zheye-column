<template>
  <div class="update-profile-page w-690">
    <ul class="nav nav-tabs my-4">
      <li class="nav-item">
        <a href="#" class="nav-link" :class="{active: activeIndex === 1 }" @click="changeTab(1)">更新个人资料</a>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link" :class="{active: activeIndex === 2 }" @click="changeTab(2)">更新专栏信息</a>
      </li>
    </ul>
    <h4>编辑个人资料</h4>
    <uploader
      action="/api/upload" 
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4 circle"
      :beforeUploader="uploadCheck"
      :uploaded="uploadedData"
      @file-uploaded-success="onFileUploadedSuccess"
    >
      <h2>点击上传图像</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <div class="uploaded-area">
          <img :src="((dataProps.uploadedData) as ResponseType).data as ImageProps).url" />
          <h3>点击重新上传</h3>
        </div>
      </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit">
    </validate-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { GlobalDataProps, ImageProps, ResponseType } from "../type/Types";
import { useStore }  from "vuex";
import Uploader from "../base/Uploader.vue";
import createMessage from "../base/createMessage";
import { beforeUploadedCheck } from "../libs/helper";

const store = useStore<GlobalDataProps>();
const activeIndex = ref(1);
const uploadedData = ref();
let imageId = "";

const changeTab = (index: number) => {
    activeIndex.value = index;
}

const uploadCheck = (file: File) => {
  const result = beforeUploadedCheck(file, {
      format: ["image/jpeg", "image/png"],
      size:1
  });
  const { passed, error } = result;
  if (error === "format") {
    createMessage("上传图片只能是 JPG/PNG 格式!!", "error");
  }
  if (error === "size") {
    createMessage("上传图片大小不能超过 1M !!", "error");
  }
  return passed;
}

onMounted(() => {
  if (store.state.user.avatar) {
    uploadedData.value = { data: store.state.user.avatar }   
  }
})

const onFileUploadedSuccess = (rawData: ResponseType<ImageProps>) => {
  if(rawData.data._id) {
      imageId = rawData.data._id;
    }
}

const onFormSubmit = () => {

}

</script>

<style scoped>

.w-690 {
    width: 690px;
    margin: 0 auto;
}

</style>


