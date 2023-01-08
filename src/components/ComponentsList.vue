<template>
  <div class="create-component-list">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="component-item"
      @click="onItemClick(item)"
    >
      <m-text v-bind="item"></m-text>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import MText from "./MText.vue";

export default defineComponent({
  name: "components-list",
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  emits: ["on-item-click"],
  components: {
    MText,
  },
  setup(props, context) {
    const onItemClick = (data: any) => {
      context.emit("on-item-click", data);
    };
    return {
      onItemClick,
    };
  },
});
</script>
