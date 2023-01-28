import type { AllFormProps } from "./stores/editor";
import type { VNode } from "vue";
export interface PropToForm {
  component: string;
  subComponent?: string;
  extraProps?: {
    [key: string]: any;
  };
  text?: string;
  options?: { text: string | VNode; value: any }[];
  // 转换函数
  initalTransform?: (v: any) => any;
  afterTransform?: (v: any) => any;
  valueProp?: string;
  eventName?: string;
}

export type PropsToForms = {
  [P in keyof AllFormProps]?: PropToForm;
};

const fontFamilyArr = [
  { text: "宋体", value: '"SimSun","STSong"' },
  { text: "黑体", value: '"SimHei","STHeiti"' },
  { text: "楷体", value: '"KaiTi","STKaiti"' },
  { text: "仿宋", value: '"FangSong","STFangsong"' },
];

const fontFamilyOptions = fontFamilyArr.map((font) => {
  return {
    value: font.value,
    text: (
      <span style={{ fontFamily: font.value }}>{font.text}</span>
    ) as VNode,
  };
});

const defaultHandler = {
  component: "a-input",
  eventName: "change",
  valueProp: "value",
  initalTransform: (v: any) => v,
  afterTransform: (e: any) => e,
};

const pxToNumberHandler: PropToForm = {
  component: "a-input-number",
  initalTransform: (v: string) => parseInt(v),
  afterTransform: (e: number) => (e ? `${e}px` : ""),
}

export const mapPropsToForms: PropsToForms = {
  text: {
    text: "文本",
    component: "a-textarea",
    extraProps: { row: 3 },
    afterTransform: (e: any) => e.target.value,
  },
  fontSize: {
    text: "字号",
    ...pxToNumberHandler,
  },
  lineHeight: {
    text: "行高",
    component: "a-slider",
    extraProps: { min: 0, max: 3, step: 0.1 },
    initalTransform: (v: string) => parseFloat(v),
    afterTransform: (e: number) => e.toString(),
  },
  textAlign: {
    text: "对齐",
    component: "a-radio-group",
    subComponent: "a-radio-button",
    options: [
      { value: "left", text: "左" },
      { value: "center", text: "中" },
      { value: "right", text: "右" },
    ],
    afterTransform: (e: any) => e.target.value,
  },
  fontFamily: {
    component: "a-select",
    subComponent: "a-select-option",
    text: "字体",
    options: [{ value: "", text: "无" }, ...fontFamilyOptions],
  },
  color: {
    component: "color-picker",
    text: "字体颜色",
  },
  width: {
    text: "宽度",
    ...pxToNumberHandler,
  },
  src: {
    component: "image-process",
  },
  backgroundColor: {
    component: "color-picker",
    text: "背景颜色",
  },
  height: {
    text: "高度",
    ...pxToNumberHandler,
  },
  paddingLeft: {
    text: "左边距",
    ...pxToNumberHandler,
  },
  paddingRight: {
    text: "右边距",
    ...pxToNumberHandler,
  },
  paddingTop: {
    text: "右边距",
    ...pxToNumberHandler,
  },
  paddingBottom: {
    text: "下边距",
    ...pxToNumberHandler,
  },
  borderStyle: {
    ...defaultHandler,
    component: "a-select",
    subComponent: "a-select-option",
    text: "边框类型",
    options: [
      { value: "none", text: "无"},
      { value: "solid", text: "实线"},
      { value: "dashed", text: "破折线"},
      { value: "dotted", text: "点状线"},
    ],
  },
  borderColor: {
    ...defaultHandler,
    component: "color-picker",
    text: "边框颜色",
  },
  borderWidth: {
    ...pxToNumberHandler,
    component: "a-slider",
    text: "边框宽度",
    extraProps: { min: 0, max: 20 },
  },
  borderRadius: {
    ...pxToNumberHandler,
    component: "a-slider",
    text: "边框圆角",
    extraProps: { min: 0, max: 200 },
  },
  boxShadow: {
    component: "shadow-picker",
  },
  left: {
    ...pxToNumberHandler,
    text: "X轴坐标",
  },
  top: {
    ...pxToNumberHandler,
    text: "Y轴坐标",
  },
  actionType: {
    ...defaultHandler,
    component: "a-select",
    subComponent: "a-select-option",
    text: "点击",
    options: [
      { value: "", text: "无" },
      { value: "", text: "跳转到 URL" },
    ],
  },
  url: {
    ...defaultHandler,
    afterTransform: (e: any) => e.target.value,
    text: "链接",
  },
  backgroundImage: {
    ...defaultHandler,
    component: "background-processer",
    initalTransform(v: string) {
      if (v) {
        const reg = /\(["'](.+)["']\)/g;
        const matches = reg.exec(v)
        if (matches && matches.length > 1) {
          return matches[1];
        } else {
          return "";
        }
      } else {
        return "";
      }
    },
    afterTransform: (e: string) => (e ? `url("${e}")` : ""),
  },
};
