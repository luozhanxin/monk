<template>
  <component
    :is="tag"
    :style="styleProps"
    class="m-text-component"
    @click="handleClick"
  >
    {{ text }}
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useComponentCommon from "../hooks/useComponentCommon";
import {
  transformToComponentProps,
  textDefaultProps,
  textStylePropNames,
} from "../defaultProps";
const defaultProps = transformToComponentProps(textDefaultProps);
export default defineComponent({
  name: "m-text",
  props: {
    tag: {
      type: String,
      default: "div",
    },
    ...defaultProps,
  },
  setup(props) {
    const { styleProps, handleClick } = useComponentCommon(
      props,
      textStylePropNames
    );
    return {
      styleProps,
      handleClick,
    };
  },
});
</script>

<style scoped>
h2.m-text-component,
p.m-text-component {
  margin-bottom: 0;
}
button.m-text-component {
  padding: 5px 10px;
  cursor: pointer;
}
.m-text-component {
  box-sizing: border-box;
  white-space: pre-wrap;
  position: relative !important;
}
</style>
