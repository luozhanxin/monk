<template>
  <ul :list="list" class="ant-list-items ant-list-bordered">
    <li
      class="ant-list-item"
      v-for="item in list"
      :key="item.id"
      :class="{ active: item.id === selectedId }"
      @click="handleClick(item.id)"
      draggable="true"
    >
      <a-tooltip :title="item.isHidden ? '显示' : '隐藏'">
        <a-button
          shape="circle"
          @click="handleChange(item.id, 'isHidden', !item.isHidden)"
        >
          <template v-slot:icon v-if="item.isHidden"><EyeOutlined /></template>
          <template v-slot:icon v-else><EyeInvisibleOutlined /></template>
        </a-button>
      </a-tooltip>

      <a-tooltip :title="item.isLocked ? '解锁' : '锁定'">
        <a-button
          shape="circle"
          @click="handleChange(item.id, 'isLocked', !item.isLocked)"
        >
          <template v-slot:icon v-if="item.isLocked"
            ><UnlockOutlined
          /></template>
          <template v-slot:icon v-else><LockOutlined /></template>
        </a-button>
      </a-tooltip>
      <inline-edit
        :value="item.layerName"
        @change="
          (value) => {
            handleChange(item.id, 'layerName', value);
          }
        "
      ></inline-edit>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import InlineEdit from "./InlineEdit.vue";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons-vue";
import type { ComponentData } from "../stores/editor";
export default defineComponent({
  props: {
    list: {
      type: Array as PropType<ComponentData[]>,
      required: true,
    },
    selectedId: {
      type: String,
      required: true,
      default: "",
    },
  },
  emits: ["select", "change"],
  components: {
    EyeInvisibleOutlined,
    EyeOutlined,
    LockOutlined,
    UnlockOutlined,
    InlineEdit,
  },
  setup(props, context) {
    const handleClick = (id: string) => {
      context.emit("select", id);
    };
    const handleChange = (id: string, key: string, value: boolean) => {
      const data = {
        id,
        key,
        value,
        isRoot: true,
      };
      context.emit("change", data);
    };
    return {
      handleChange,
      handleClick,
    };
  },
});
</script>

<style scoped>
.ant-list-item {
  padding: 10px 15px;
  transition: all 0.5s ease-out;
  cursor: pointer;
  justify-content: normal;
  border: 1px solid #fff;
  border-bottom-color: #f0f0f0;
}
.ant-list-item .handle {
  cursor: move;
  margin-left: auto;
}
.ant-list-item.active {
  border: 1px solid #1890ff;
}
.ant-list-item:hover {
  background: #e6f7ff;
}
.ant-list-item > * {
  margin-right: 10px;
}
.ant-list-item button {
  font-size: 12px;
}
</style>