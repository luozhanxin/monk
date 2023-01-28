<template>
  <div class="inline-edit" @click.stop="handleClick" ref="wrapper">
    <input
      v-model="innerValue"
      v-if="isEditing"
      placeholder="文本不能为空"
      ref="inputRef"
    />
    <slot v-else :text="innerValue"
      ><span>{{ innerValue }}</span></slot
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick } from "vue";
import useKeyPress from "../hooks/useKeyPress";
import useClickOutside from "../hooks/useClickOutside";
export default defineComponent({
  name: "inline-edit",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  emits: ["change"],
  setup(props, context) {
    const innerValue = ref<string>(props.value);
    watch(
      () => props.value,
      (newValue) => {
        innerValue.value = newValue;
      }
    );
    const wrapper = ref<null | HTMLElement>(null);
    const inputRef = ref<null | HTMLElement>(null);
    const isEditing = ref(false);
    let cacheOldValue = "";
    const isOutside = useClickOutside(wrapper);
    const handleClick = () => {
      isEditing.value = true;
    };
    watch(isEditing, async (isEditing) => {
      if (isEditing) {
        cacheOldValue = innerValue.value;
        await nextTick();
        if (inputRef.value) {
          inputRef.value.focus();
        }
      }
    });
    watch(isOutside, (newValue) => {
      if (newValue && isEditing.value) {
        isEditing.value = false;
        context.emit("change", innerValue.value);
      }
      isOutside.value = false;
    });
    useKeyPress("Enter", () => {
      if (isEditing.value) {
        isEditing.value = false;
        context.emit("change", innerValue.value);
      }
    });
    useKeyPress("Escape", () => {
      if (isEditing.value) {
        isEditing.value = false;
        innerValue.value = cacheOldValue;
      }
    });
    return {
      handleClick,
      wrapper,
      inputRef,
      innerValue,
      isEditing,
    };
  },
});
</script>

<style scoped>
.inline-edit {
}
</style>
