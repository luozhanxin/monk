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
import type { ComponentData } from "@/stores/editor";
import { v4 as uuidv4 } from "uuid";
import { imageDefaultProps } from "monk-components";
import type { UploadResp } from "@/extraType";
import { message } from "ant-design-vue";
import { getImageDimensions } from "@/helper";

export default defineComponent({
  name: "components-list",
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  emits: ["on-item-click"],
  components: {},
  setup(props, context) {
    const onItemClick = (props: any) => {
      const componentData: ComponentData = {
        name: "m-text",
        id: uuidv4(),
        props,
      };
      context.emit("on-item-click", componentData);
    };
    const onImageUploaded = (resp: UploadResp) => {
      const componentData: ComponentData = {
        name: "m-image",
        id: uuidv4(),
        props: {
          ...imageDefaultProps,
        },
      };
      message.success("上传成功");
      componentData.props.src = resp.data.url;
      getImageDimensions(resp.data.url).then(({ width }) => {
        const maxWidth = 373;
        componentData.props.width = width > maxWidth ? maxWidth : width;
        context.emit("on-item-click", resp);
      });
    };
    return {
      onItemClick,
      onImageUploaded,
    };
  },
});
</script>
