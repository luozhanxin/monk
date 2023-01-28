import { v4 as uuidv4 } from "uuid";
import { defineStore } from "pinia";
import type { TextComponentProps, ImageComponentProps } from "monk-components";
export interface EditorProps {
  // 页面所有组件
  components: ComponentData[];
  // 当前被选中的组件 id
  currentElement: string;
}

export interface ComponentData {
  // 元素的属性
  props: Partial<TextComponentProps & ImageComponentProps>;
  // id ,uuid v4 生成
  id: string;
  // 业务组件名称 m-text,m-image
  name: "m-text" | "m-image" | "m-shape";
  // 图层是否隐藏
  isHidden?: boolean;
  // 图层是否锁定
  isLocked?: boolean;
  // 图层名称
  layerName: string;
}

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: "m-text",
    layerName: "图层1",
    props: {
      text: "hello",
      fontSize: "12px",
      color: "#000000",
      lineHeight: "1",
      textAlign: "left",
      fontFamily: "",
    },
  },
  {
    id: uuidv4(),
    name: "m-text",
    layerName: "图层2",
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
    layerName: "图层3",
    props: {
      text: "hello3",
      fontSize: "24px",
      textAlign: "right",
    },
  },
  {
    id: uuidv4(),
    layerName: "图层4",
    name: "m-image",
    props: {
      imageSrc: "https://monk-1251844408.cos.ap-nanjing.myqcloud.com/a.jpeg",
      width: "200",
    },
  },
];

export const useEditor = defineStore("editor", {
  state: () => ({
    components: testComponents,
    currentElement: "",
  }),
  actions: {
    addComponent(component: ComponentData) {
      this.components.push(component);
    },
    setActive(currentId: string) {
      this.currentElement = currentId;
    },
    updateComponent({ key, value, id, isRoot }) {
      const updateComponent = this.components.find(
        (component) => component.id === (id || this.currentElement)
      );
      if (updateComponent) {
        if (isRoot) {
          (updateComponent as any)[key] = value;
        } else {
          updateComponent.props[key as keyof TextComponentProps] = value;
        }
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
