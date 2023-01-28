<template>
  <div class="background-processer">
    <style-uploader v-if="!value" @success="onImageUploaded"></style-uploader>
    <image-process
      v-else
      :value="value"
      @change="handleUploadUrl"
      :showDelete="true"
    ></image-process>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ImageProcess from "./ImageProcess.vue";
import StyleUploader from "./StyleUploader.vue";
import { message } from "ant-design-vue";
import type { UploadResp } from "../extraType";
export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  components: {
    ImageProcess,
    StyleUploader,
  },
  emits: ["change"],
  setup(props, context) {
    const onImageUploaded = (data: { resp: UploadResp; file: File }) => {
      const { resp } = data;
      message.success("上传成功");
      context.emit("change", resp.data.url);
    };
    const handleUploadUrl = (url: string) => {
      context.emit("change", url);
    };

    return {
      onImageUploaded,
      handleUploadUrl,
    };
  },
});
</script>
