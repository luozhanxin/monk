<template>
  <a-layout :style="{ background: '#fff' }">
    <header-layout></header-layout>
    <a-layout-content class="main-layout">
      <uploader-file
        action="`http://local.test:7001/api/upload`"
        drag
        listType="picture"
      >
        <div class="uploader-container">
          <h4>上传图片</h4>
        </div>
        <template #loading>
          <div class="uploader-container">
            <h4>上传中</h4>
          </div>
        </template>
        <template #uploaded="{ uploadedData }">
          <div class="uploaded-area">
            <img :src="uploadedData.data.url" />
            <h4>点击重新上传</h4>
          </div>
        </template>
      </uploader-file>
      <router-view></router-view>
    </a-layout-content>
    <footer-layout></footer-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeaderLayout from "./components/layout/HeaderLayout.vue";
import FooterLayout from "./components/layout/FooterLayout.vue";
import UploaderFile from "./components/UploaderFile.vue";

export default defineComponent({
  name: "App",
  components: {
    HeaderLayout,
    FooterLayout,
    UploaderFile,
  },
});
</script>
