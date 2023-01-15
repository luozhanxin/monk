<template>
  <img
    :style="styleProps"
    class="m-image-component"
    @click.prevent="handleClick"
    :src="src"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useComponentCommon from "@/hooks/useComponentCommon";
import {
  transformToComponentProps,
  type ImageComponentProps,
  imageDefaultProps,
  imageStylePropsName,
} from "@/defaultProps";
const defaultProps = transformToComponentProps(imageDefaultProps);
export default defineComponent({
  name: "m-image",
  props: {
    ...defaultProps,
  },
  setup(props) {
    const { styleProps, handleClick } = useComponentCommon<ImageComponentProps>(
      props,
      imageStylePropsName
    );
    return {
      styleProps,
      handleClick,
    };
  },
});
</script>
