import { defineStore } from "pinia";

export interface TemplateProps {
  id: number;
  title: string;
  coverImg: string;
  author: string;
  copiedCount: number;
}

export interface TemplatesProps {
  data: TemplateProps[];
}

const testData: TemplateProps[] = [
  {
    id: 1,
    coverImg: "",
    title: "test",
    author: "author",
    copiedCount: 3,
  },
];

export const useTemplateStore = defineStore("template", {
  state: (): TemplatesProps => ({
    data: testData,
  }),
  getters: {
    getTemplateById: (state) => (id: number) => {
      return state.data.find((t) => t.id === id);
    },
  },
  actions: {},
});
