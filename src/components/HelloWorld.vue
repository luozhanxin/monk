<template>
  <h1>{{ msg }}</h1>
  <button @click="count++">{{ count }}</button>
  <hello msg="1234"></hello>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import Hello from "./Hello.vue";
export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  components: {
    Hello,
  },
  setup() {
    const count = ref(0);
    return {
      count,
    };
  },
});
</script>
