<template>
  <a-layout :style="{ background: '#fff' }">
    <header-layout></header-layout>
    <a-layout-content class="main-layout">
      <router-view></router-view>
    </a-layout-content>
    <footer-layout></footer-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeaderLayout from "./components/layout/HeaderLayout.vue";
import FooterLayout from "./components/layout/FooterLayout.vue";

export default defineComponent({
  name: "App",
  components: {
    HeaderLayout,
    FooterLayout,
  },
});
</script>
