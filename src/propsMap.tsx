import type { TextComponentProps } from "./defaultProps";
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
  [P in keyof TextComponentProps]?: PropToForm;
};

const fontFamilArr = [
  { text: "宋体", value: '"SimSun","STSong"' },
  { text: "黑体", value: '"SimHei","STHeiti"' },
  { text: "楷体", value: '"KaiTi","STKaiti"' },
  { text: "仿宋", value: '"FangSong","STFangsong"' },
];

const fontFamilyOptions = fontFamilArr.map((font) => {
  return {
    value: font.value,
    text: (
      <span style={{ fontFamily: font.value }}>{font.text}</span>
    ) as VNode,
  };
});

export const mapPropsToForms: PropsToForms = {
  text: {
    text: "文本",
    component: "a-textarea",
    extraProps: { row: 3 },
    afterTransform: (e: any) => e.target.value,
  },
  fontSize: {
    text: "字号",
    component: "a-input-number",
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => (e ? `${e}px` : ""),
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
};
