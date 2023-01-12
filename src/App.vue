<template>
  <a-layout :style="{ background: '#fff' }">
    <header-layout></header-layout>
    <a-layout-content class="main-layout">
      <uploader-file
        action="`http://local.test:7001/api/upload`"
      ></uploader-file>
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
