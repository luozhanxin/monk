import {
  shallowMount,
  VueWrapper,
  flushPromises,
  mount,
} from "@vue/test-utils";
import { describe, it, expect, beforeAll, vi, afterEach } from "vitest";
import UploaderFile from "@/components/UploaderFile.vue";
import axios from "axios";

const mockAxios = axios as vi.importActual<typeof axios>;
let wrapper: VueWrapper<any>;
const testFile = new File(["xyz"], "test.png", { type: "image/png" });
vi.mock("axios");

const mockComponent = {
  template: "<div><slot></slot></div>",
};
const mockComponents = {
  DeleteOutlined: mockComponent,
  LoadingOutlined: mockComponent,
  FileOutlined: mockComponent,
};
const setInputValue = (input: HTMLInputElement) => {
  const files = [testFile] as any;
  // hack
  Object.defineProperty(input, "files", {
    value: files,
    writable: false,
  });
};

describe("UploaderFile Component", () => {
  beforeAll(() => {
    wrapper = shallowMount(UploaderFile, {
      props: {
        action: "test.url",
      },
    });
  });

  it("basic layout before upload", () => {
    expect(wrapper.find("button").exists()).toBeTruthy();
    expect(wrapper.get("button").text()).toBe("点击上传");
    expect(wrapper.get("input").isVisible()).toBeFalsy();
  });
  it("upload process should works fine", async () => {
    // change e.target.files
    mockAxios.post.mockResolvedValueOnce({ status: "success" });
    const fileInput = wrapper.find("input").element as HTMLInputElement;
    setInputValue(fileInput);

    // create a file
    await wrapper.get("input").trigger("change");
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(wrapper.get("button").text()).toBe("正在上传...");
    // button 为 disabled
    expect(wrapper.get("button").attributes()).toHaveProperty("disabled");
    await flushPromises();
    expect(wrapper.get("button").text()).toBe("点击上传");
  });
  it("should return error text when post is rejected", async () => {
    mockAxios.post.mockRejectedValueOnce({ error: "error" });
    await wrapper.get("input").trigger("change");
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(wrapper.get("button").text()).toBe("正在上传...");
    await flushPromises();
    expect(wrapper.get("button").text()).toBe("点击上传");
  });
  it("should show the correct interface when using custom slot", async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { url: "dummy.url" } });
    mockAxios.post.mockResolvedValueOnce({ data: { url: "xyz.url" } });
    const wrapper = mount(UploaderFile, {
      props: {
        action: "test.url",
      },
      global: {
        stubs: mockComponents,
      },
      slots: {
        default: "<button>Custom button</button>",
        loading: '<div class="loading">custom loading</div>',
        uploaded: `<template #uploaded="{ uploadedData }">
        <div class="custom-loaded">{{ uploadedData.url }}</div>
        </template>`,
      },
    });
    expect(wrapper.get("button").text()).toBe("Custom button");
    const fileInput = wrapper.find("input").element as HTMLInputElement;
    setInputValue(fileInput);

    await wrapper.get("input").trigger("change");
    expect(wrapper.get(".loading").text()).toBe("custom loading");
    await flushPromises();
    expect(wrapper.get(".custom-loaded").text()).toBe("dummy.url");

    await wrapper.get("input").trigger("change");
    expect(wrapper.get(".loading").text()).toBe("custom loading");
    await flushPromises();
    expect(wrapper.get(".custom-loaded").text()).toBe("xyz.url");
  });
  it("before upload check", async () => {
    const callback = vi.fn();
    mockAxios.post.mockResolvedValueOnce({ data: { url: "dummy.url" } });
    const checkFileSize = (file: File) => {
      if (file.size > 2) {
        callback();
        return false;
      }
      return true;
    };
    const wrapper = shallowMount(UploaderFile, {
      props: {
        action: "test.url",
        beforeUpload: checkFileSize,
      },
    });
    const fileInput = wrapper.get("input").element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapper.get("input").trigger("change");
    expect(mockAxios.post).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalled();
  });
  afterEach(() => {
    mockAxios.post.mockReset();
  });
});
