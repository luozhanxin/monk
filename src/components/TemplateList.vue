<template>
  <div class="template-list-component">
    <a-row :gutter="16">
      <a-col :span="6" v-for="item in list" :key="item">
        <a-card hoverable>
          <template v-solt:cover>{{ item }} </template>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "template-list",
  props: {
    list: {
      type: Array,
      require: true,
    },
    type: {
      type: String,
      default: "work",
    },
  },
});
</script>
