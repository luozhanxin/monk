import { defineStore } from "pinia";

export interface GlobalStatus {
  loading: boolean;
  error: any;
  opName?: string;
}

export interface GlobalDataProps {
  // 全局状态，loading，error 等等
  status: GlobalStatus;
}

export const useGlobalStore = defineStore("global", {
  state: () => ({
    status: {
      loading: false,
      error: { status: false, message: "" },
      opName: "",
    } as GlobalStatus,
  }),
});
