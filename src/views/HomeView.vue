<template>
  <main>
    <div class="main">
      <h1>This is an main page</h1>
      <hello msg="hello"></hello>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Hello from "../components/Hello";
export default defineComponent({
  components: {
    Hello,
  },
});
</script>
