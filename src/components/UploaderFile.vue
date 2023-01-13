<template>
  <div class="file-upload">
    <div class="upload-area" @click="triggerUpload" :disabled="isUploading">
      <slot v-if="isUploading" name="loading"
        ><button disabled>正在上传</button></slot
      >
      <slot
        name="uploaded"
        v-else-if="lastFileData && lastFileData.loaded"
        :uploadedData="lastFileData.data"
      >
        <button>点击上传</button>
      </slot>
      <slot v-else name="default"><button>点击上传</button></slot>
    </div>
    <input
      ref="fileInput"
      type="file"
      :style="{ display: 'none' }"
      @change="handleFileChange"
    />
    <ul class="upload-list">
      <li
        :class="`uploaded-file upload-${file.status}`"
        v-for="file in uploadedFiles"
        :key="file.uid"
      >
        <span v-if="file.status === 'loading'"><LoadingOutlined /></span>
        <span v-else class="file-icon"><FileOutlined /></span>
        <span class="filename">{{ file.name }}</span>
        <button class="delete-icon" @click="removeFile(file.uid)">
          <DeleteOutlined />
        </button>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, computed, type PropType } from "vue";
import {
  DeleteOutlined,
  LoadingOutlined,
  FileOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { last } from "lodash-es";
type UploadStatus = "ready" | "loading" | "success" | "error";
type CheckUpload = (file: File) => boolean | Promise<File>;
export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status: UploadStatus;
  raw: File;
  resp?: any;
}
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true,
    },
    beforeUpload: {
      type: Function as PropType<CheckUpload>,
    },
    drag: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    DeleteOutlined,
    LoadingOutlined,
    FileOutlined,
  },
  setup(props) {
    const fileInput = ref<null | HTMLInputElement>(null);
    const uploadedFiles = ref<UploadFile[]>([]);
    const isUploading = computed(() => {
      return uploadedFiles.value.some((file) => file.status === "loading");
    });
    const lastFileData = computed(() => {
      const lastFile = last(uploadedFiles.value);
      if (lastFile) {
        return {
          loaded: lastFile.status === "success",
          data: lastFile.resp,
        };
      }
      return false;
    });
    const removeFile = (id: string) => {
      uploadedFiles.value = uploadedFiles.value.filter(
        (file) => file.uid !== id
      );
    };
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };
    const postFile = (uploadedFile: File) => {
      const formData = new FormData();
      formData.append(uploadedFile.name, uploadedFile);
      const fileObj = reactive<UploadFile>({
        uid: uuidv4(),
        size: uploadedFile.size,
        name: uploadedFile.name,
        status: "loading",
        raw: uploadedFile,
      });
      uploadedFiles.value.push(fileObj);
      axios
        .post(props.action, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((resp) => {
          fileObj.status = "success";
          fileObj.resp = resp.data;
        })
        .catch(() => {
          fileObj.status = "error";
        })
        .finally(() => {
          if (fileInput.value) {
            fileInput.value.value = "";
          }
        });
    };
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (files) {
        const uploadedFile = files[0];
        if (props.beforeUpload) {
          const result = props.beforeUpload(uploadedFile);
          if (result && result instanceof Promise) {
            result
              .then((processedFile) => {
                if (processedFile instanceof File) {
                  postFile(processedFile);
                } else {
                  throw new Error(
                    "beforeUpload Promise should return File object"
                  );
                }
              })
              .catch((e) => {
                console.log(e);
              });
          } else if (result === true) {
            postFile(uploadedFile);
          }
        } else {
          postFile(uploadedFile);
        }
      }
    };
    return {
      fileInput,
      isUploading,
      uploadedFiles,
      lastFileData,
      triggerUpload,
      removeFile,
      handleFileChange,
    };
  },
});
</script>

<style scoped>
.upload-loading {
  color: yellow;
}

.upload-success {
  color: green;
}

.upload-error {
  color: red;
}

.upload-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.upload-list li {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  font-size: 14px;
  line-height: 1.8;
  margin-top: 5px;
  box-sizing: border-box;
  border-radius: 4px;
  min-width: 200px;
  position: relative;
}

.upload-list > li:first-child {
  margin-top: 10px;
}
</style>
