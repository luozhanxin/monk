<template>
  <uploader-file
    class="styled-uploader"
    action="http://local.test:7001"
    :showUploadList="false"
    :beforeUpload="commonUploadCheck"
    @success="
      (data) => {
        handleUploadSuccess(data.resp);
      }
    "
  >
    <div class="uploader-container">
      <FileImageOutlined />
      <h4>上传图片</h4>
    </div>
    <template #loading>
      <div class="uploader-container">
        <LoadingOutlined />
        <h4>上传中</h4>
      </div>
    </template>
    <template #uploaded>
      <div class="uploader-container">
        <FileImageOutlined />
        <h4>上传图片</h4>
      </div>
    </template>
  </uploader-file>
</template>

<script lang="ts">
import { FileImageOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { defineComponent } from "vue";
import UploaderFile from "./UploaderFile.vue";
import { commonUploadCheck } from "@/help";
export default defineComponent({
  components: { FileImageOutlined, LoadingOutlined, UploaderFile },
  setup(props, context) {
    const handleUploadSuccess = (resp: any) => {
      context.emit("success", resp);
    };
    return {
      commonUploadCheck,
      handleUploadSuccess,
    };
  },
});
</script>

<style scoped>
.uploader-container {
  text-align: center;
  padding: 10px;
  width: 100%;
  border: 2px dotted #efefef;
  color: #ccc;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  transition: all 0.25s ease-in-out;
  cursor: pointer;
}
.uploader-container:hover {
  border: 2px dotted #1890ff;
  color: #1890ff;
}
.uploader-container h4 {
  color: #999;
  transition: all 0.25s ease-in-out;
}
.uploader-container:hover h4 {
  color: #1890ff;
}
.uploader-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
