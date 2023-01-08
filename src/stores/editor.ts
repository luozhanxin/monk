import { v4 as uuidv4 } from "uuid";
import { defineStore } from "pinia";
import type { TextComponentProps } from "../defaultProps";
export interface EditorProps {
  // 页面所有组件
  components: ComponentData[];
  // 当前被选中的组件 id
  currentElement: string;
}

export interface ComponentData {
  // 元素的属性
  props: {
    [key: string]: any;
  };
  // id ,uuid v4 生成
  id: string;
  // 业务组件名称 m-text,m-image
  name: string;
}

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: "m-text",
    props: {
      text: "hello",
      fontSize: "12px",
      color: "red",
      lineHeight: "1",
      textAlign: "left",
      fontFamily: "",
    },
  },
  {
    id: uuidv4(),
    name: "m-text",
    props: {
      text: "hello2",
      fontSize: "20px",
      fontWeight: "bold",
      lineHeight: "2",
      textAlign: "left",
    },
  },
  {
    id: uuidv4(),
    name: "m-text",
    props: {
      text: "hello3",
      fontSize: "24px",
      textAlign: "right",
    },
  },
];

export const useEditor = defineStore("editor", {
  state: () => ({
    components: testComponents,
    currentElement: "",
  }),
  actions: {
    addComponent(props: Partial<TextComponentProps>) {
      const newComponent: ComponentData = {
        id: uuidv4(),
        name: "m-text",
        props,
      };
      this.components.push(newComponent);
    },
    setActive(currentId: string) {
      this.currentElement = currentId;
    },
    updateComponent({ key, value }) {
      const updateComponent = this.components.find(
        (component) => component.id === this.currentElement
      );
      if (updateComponent) {
        updateComponent.props[key as keyof TextComponentProps] = value;
      }
    },
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find(
        (component) => component.id === state.currentElement
      );
    },
  },
});
