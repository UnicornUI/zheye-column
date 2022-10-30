<template>
  <!-- code... -->
  <div class="file-upload">
    <div
      class="file-upload-container"
      @click.prevent="triggerUpload"
      v-bind="$attrs"
    >
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传...</button>
      </slot>
      <slot
        v-else-if="fileStatus === 'success'"
        name="uploaded"
        :uploadedData="uploadedData"
      >
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <input
      type="file"
      class="file-input d-none"
      ref="fileInput"
      @change="handleFileChange"
    />
  </div>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
import { ref, PropType, watch } from "vue";
import { axios } from "../libs/http";
type UploadStatus = "ready" | "loading" | "success" | "error";
type CheckFunction = (file: File) => boolean;

const props = defineProps({
  action: {
    type: String,
    required: true,
  },
  beforeUpload: {
    type: Function as PropType<CheckFunction>,
  },
  uploaded: {
    type: Object,
  },
});

const emits = defineEmits(["file-uploaded-success", "file-uploaded-error"]);
const fileInput = ref<null | HTMLInputElement>(null);
const fileStatus = ref<UploadStatus>(props.uploaded ? "success" : "ready");
const uploadedData = ref(props.uploaded);

watch(
  () => props.uploaded,
  (newValue) => {
    if (newValue) {
      fileStatus.value = "success";
      uploadedData.value = newValue;
    }
  }
);

const triggerUpload = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileChange = (e: Event) => {
  const currentTarget = e.target as HTMLInputElement;
  const files = currentTarget.files;
  if (files) {
    const uploadedFiles = Array.from(files);
    const uploadedFile = uploadedFiles[0];
    if (props.beforeUpload) {
      const result = props.beforeUpload(uploadedFile);
      if (!result) {
        return;
      }
    }
    fileStatus.value = "loading";
    const formData = new FormData();
    formData.append("file", uploadedFile);
    axios
      .post(props.action, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((resp) => {
        fileStatus.value = "success";
        uploadedData.value = resp.data;
        emits("file-uploaded-success", resp.data);
      })
      .catch((error) => {
        fileStatus.value = "error";
        emits("file-uploaded-error", { error });
      })
      .finally(() => {
        if (fileInput.value) {
          fileInput.value.value = "";
        }
      });
  }
};
</script>

<style scoped>
/* code... */
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
  overflow: hidden;
}

.create-port-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.uploaded-area {
  position: relative;
}
.uploaded-area:hover h3 {
  display: block;
}

.uploaded-area h3 {
  display: none;
  position: absolute;
  color: #999;
  text-align: center;
  width: 100%;
  top: 50%;
}
</style>
