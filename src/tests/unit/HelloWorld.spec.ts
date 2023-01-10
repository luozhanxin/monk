import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { flushPromises, VueWrapper, mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { useCounterStore } from "@/stores/counter";
import HelloWorld from "@/components/HelloWorld.vue";
import Hello from "@/components/Hello.vue";
import axios from "axios";
import { message } from "ant-design-vue";
vi.mock("axios");
vi.mock("ant-design-vue", () => {
  return {
    message: {
      success: vi.fn(),
    },
  };
});
const mockedRoutes: string[] = [];
vi.mock("vue-router", () => {
  return {
    useRouter: () => ({
      push: (url: string) => mockedRoutes.push(url),
    }),
  };
});
const msg = "new message";
let store: any;
let wrapper: VueWrapper<any>;
const mockComponent = {
  template: "<div><slot></slot></div>",
};
const mockComponent2 = {
  template: "<div><slot></slot><slot name ='overlay'></slot></div>",
};

const globalComponents = {
  "a-button": mockComponent,
  "route-link": mockComponent,
  "a-dropdown-button": mockComponent2,
};

describe("HelloWorld", () => {
  beforeAll(() => {
    wrapper = mount(HelloWorld, {
      props: { msg },
      global: {
        components: globalComponents,
        plugins: [createTestingPinia()],
      },
    });
    store = useCounterStore();
  });
  it("renders properly", () => {
    expect(wrapper.text()).toContain("new message");
    expect(wrapper.findComponent(Hello).exists()).toBeTruthy();
  });

  it("should update thte count when clicking the button", async () => {
    // DOM 异步过程
    await wrapper.get("button").trigger("click");
    expect(wrapper.get("button").text()).toBe("2");
  });

  it("should add todo when fill the input and click the add button", async () => {
    const todoContent = "buy milk";
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
  it.skip("should load user message when click the load button", async () => {
    axios.get.mockResolvedValueOnce({ data: { username: "viking" } });
    await wrapper.get(".loadUser").trigger("click");
    // message success
    expect(message.success).toHaveBeenCalled();
    expect(axios.get).toHaveBeenCalled();
    expect(wrapper.find(".loading").exists()).toBeTruthy();
    await flushPromises();
    // 界面更新完毕
    expect(wrapper.find(".loading").exists()).toBeFalsy();
    expect(wrapper.get(".userName").text()).toBe("viking");
    // TODO: fix is 2
    expect(store.count).toBe(2);
  });

  it("should load error when return promise reject", async () => {
    axios.get.mockRejectedValueOnce("error");
    await wrapper.get(".loadUser").trigger("click");
    expect(axios.get).toHaveBeenCalledTimes(1);
    await flushPromises();
    expect(wrapper.find(".loading").exists()).toBe(false);
    expect(wrapper.find(".error").exists()).toBe(true);
  });

  afterEach(() => {
    axios.get.mockReset();
  });
});
