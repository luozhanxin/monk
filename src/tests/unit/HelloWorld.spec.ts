import { describe, it, expect, vi } from "vitest";
import { shallowMount, flushPromises } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";
import Hello from "@/components/Hello.vue";
import axios from "axios";
vi.mock("axios");

describe("HelloWorld", () => {
  it("renders properly", () => {
    const wrapper = shallowMount(HelloWorld, {
      props: { msg: "Hello" },
    });
    expect(wrapper.text()).toContain("Hello");
    expect(wrapper.findComponent(Hello).exists()).toBeTruthy();
  });

  it("should update thte count when clicking the button", async () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      prop: { msg },
    });
    // DOM 异步过程
    await wrapper.get("button").trigger("click");
    expect(wrapper.get("button").text()).toBe("2");
  });

  it("should add todo when fill the input and click the add button", async () => {
    const msg = "new message";
    const todoContent = "buy milk";
    const wrapper = shallowMount(HelloWorld, {
      props: { msg },
    });
    await wrapper.get("input").setValue(todoContent);
    expect(wrapper.get("input").element.value).toBe(todoContent);
    await wrapper.get(".addTodo").trigger("click");
    expect(wrapper.findAll("li")).toHaveLength(1);
    expect(wrapper.get("li").text()).toBe(todoContent);
    expect(wrapper.emitted()).toHaveProperty("send");
    const events = wrapper.emitted("send");
    expect(events[0]).toEqual([todoContent]);
  });

  // only 只执行这个测试
  it.only("should load user message when click the load button", async () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      props: { msg },
    });
    axios.get.mockResolvedValueOnce({ data: { username: "viking" } });
    await wrapper.get(".loadUser").trigger("click");
    expect(axios.get).toHaveBeenCalled();
    expect(wrapper.find(".loading").exists()).toBeTruthy();
    await flushPromises();
    // 界面更新完毕
    expect(wrapper.find(".loading").exists()).toBeFalsy();
    expect(wrapper.get(".userName").text()).toBe("viking");
  });
});
