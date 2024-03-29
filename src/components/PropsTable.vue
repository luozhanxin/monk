<template>
  <div class="props-table">
    <div v-for="(value, key) in finalProps" :key="key" class="prop-item">
      <span class="label" v-if="value?.text">{{ value.text }}</span>
      <div class="prop-component">
        <component
          v-if="value"
          :is="value.component"
          :[value.valueProp]="value.value"
          :value="value.value"
          v-bind="value.extraProps"
          v-on="value.events"
        >
          <template v-if="value.options">
            <component
              :is="value.subComponent"
              v-for="(option, k) in value.options"
              :key="k"
              :value="option.value"
            >
              <render-vnode :vNode="option.text"></render-vnode>
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { TextComponentProps } from "monk-components";
import { defineComponent, computed } from "vue";
import { reduce } from "lodash-es";
import { mapPropsToForms } from "@/propsMap";
import type { PropType, VNode } from "vue";
import RenderVnode from "./RenderVnode";
import ColorPicker from "./ColorPicker.vue";
import ImageProcess from "./ImageProcess.vue";
import ShadowPicker from "@/components/ShadowPicker.vue";
import BackgroundProcesser from "@/components/BackgroundProcesser.vue";
import { AllComponentProps } from "monk-components";
interface FormProps {
  component: string;
  subComponent?: string;
  extraProps?: {
    [key: string]: any;
  };
  text?: string;
  options?: { text: string | VNode; value: any }[];
  // 转换函数
  initalTransform?: (v: any) => any;
  valueProp?: string;
  eventName?: string;
  events: { [key: string]: (e: any) => void };
  value: string;
}
export default defineComponent({
  name: "props-table",
  props: {
    props: {
      type: Object as PropType<AllComponentProps>,
    },
  },
  components: {
    RenderVnode,
    ColorPicker,
    ImageProcess,
    ShadowPicker,
    BackgroundProcesser,
  },
  emits: ["change"],
  setup(props, context) {
    const finalProps = computed(() => {
      return reduce(
        props.props,
        (result, value, key) => {
          const newKey = key as keyof TextComponentProps;
          const item = mapPropsToForms[newKey];
          if (item) {
            const {
              valueProp = "value",
              eventName = "change",
              initalTransform,
              afterTransform,
            } = item;
            const newItem: FormProps = {
              ...item,
              value: initalTransform ? initalTransform(value) : value,
              valueProp,
              eventName,
              events: {
                [eventName]: (e: any) => {
                  context.emit("change", {
                    key,
                    value: afterTransform ? afterTransform(e) : e,
                  });
                },
              },
            };
            result[newKey] = newItem;
          }
          return result;
        },
        {} as { [key: string]: FormProps }
      );
    });

    return {
      finalProps,
    };
  },
});
</script>

<style scoped>
.prop-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}
.label {
  width: 28%;
}

.prop-component {
  width: 70%;
}
</style>
