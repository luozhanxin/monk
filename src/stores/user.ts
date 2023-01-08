import { defineStore } from "pinia";

export interface UserProps {
  isLogin: boolean;
  userName?: string;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {} as UserProps,
  }),
  getters: {},
  actions: {
    login() {},
  },
});
