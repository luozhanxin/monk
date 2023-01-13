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
    expect(wrapper.get("button").text()).toBe("正在上传");
    // button 为 disabled
    expect(wrapper.get("button").attributes()).toHaveProperty("disabled");
    // 列表长度修改，并且有正确的 class
    expect(wrapper.findAll("li").length).toBe(1);
    const firstItem = wrapper.get("li:first-child");
    expect(firstItem.classes()).toContain("upload-loading");
    await flushPromises();
    expect(wrapper.get("button").text()).toBe("点击上传");
    // 有正确的 class，并且文件名称相对应
    expect(firstItem.classes()).toContain("upload-success");
    expect(firstItem.get(".filename").text()).toBe(testFile.name);
  });
  it("should return error text when post is rejected", async () => {
    mockAxios.post.mockRejectedValueOnce({ error: "error" });
    await wrapper.get("input").trigger("change");
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(wrapper.get("button").text()).toBe("正在上传");
    await flushPromises();
    expect(wrapper.get("button").text()).toBe("点击上传");
    // 列表长度增加，并且列表最后一项有正确的 class 名
    expect(wrapper.findAll("li").length).toBe(2);
    const lastItem = wrapper.get("li:last-child");
    expect(lastItem.classes()).toContain("upload-error");
    await lastItem.get(".delete-icon").trigger("click");
    expect(wrapper.findAll("li").length).toBe(1);
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
    expect(wrapper.findAll("li").length).toBe(0);
    expect(callback).toHaveBeenCalled();
  });
  it("before upload check using Promise", async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { url: "dummy.url" } });
    const failedPromise = (file: File) => {
      return Promise.reject("wrong type");
    };
    const successPromise = (file: File) => {
      const newFile = new File([file], "new_name.docx", { type: file.type });
      return Promise.resolve(newFile);
    };
    const successPromiseWithWrongType = () => {
      return Promise.resolve("abcd");
    };
    const wrapper = shallowMount(UploaderFile, {
      props: {
        action: "test.url",
        beforeUpload: failedPromise,
      },
    });
    const fileInput = wrapper.get("input").element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapper.get("input").trigger("change");
    await flushPromises();
    expect(mockAxios.post).not.toHaveBeenCalled();
    expect(wrapper.findAll("li").length).toBe(0);
    // success promise with wrong file
    await wrapper.setProps({ beforeUpload: successPromiseWithWrongType });
    await wrapper.get("input").trigger("change");
    await flushPromises();
    expect(mockAxios.post).not.toHaveBeenCalled();

    // success promise with file
    await wrapper.setProps({ beforeUpload: successPromise });
    await wrapper.get("input").trigger("change");
    await flushPromises();
    const firstItem = wrapper.get("li:first-child");
    expect(firstItem.classes()).toContain("upload-success");
    expect(firstItem.get(".filename").text()).toBe("new_name.docx");
  });
  it("testing drag and drop function", async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { url: "dummy.url" } });
    const wrapper = shallowMount(UploaderFile, {
      props: {
        action: "test.url",
        drag: true,
      },
    });
    const uploadArea = wrapper.get(".upload-area");
    await uploadArea.trigger("dragover");
    expect(uploadArea.classes()).toContain("is-dragover");
    await uploadArea.trigger("dragleave");
    expect(uploadArea.classes()).not.toContain("is-dragover");

    await uploadArea.trigger("drop", { dataTransfer: { files: [testFile] } });
    expect(mockAxios.post).toHaveBeenCalled();
    await flushPromises();
    expect(wrapper.findAll("li").length).toBe(1);
  });
  it("testing manual upload process", async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { url: "dummy.url" } });
    const wrapper = shallowMount(UploaderFile, {
      props: {
        action: "test.url",
        drag: true,
        autoUpload: false,
      },
    });
    const fileInput = wrapper.get("input").element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapper.get("input").trigger("change");
    expect(wrapper.findAll("li").length).toBe(1);
    const firstItem = wrapper.get("li:first-child");
    expect(firstItem.classes()).toContain("upload-ready");
    // 获取实例
    wrapper.vm.uploadFiles();
    expect(mockAxios.post).toHaveBeenCalled();
    await flushPromises();
    expect(firstItem.classes()).toContain("upload-success");
  });
  it("PictureList mode should works fine", async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { url: "dummy.url" } });
    window.URL.createObjectURL = vi.fn(() => {
      return "test.url";
    });
    const wrapper = mount(UploaderFile, {
      props: {
        action: "test.url",
        listType: "picture",
      },
    });
    expect(wrapper.get("ul").classes()).toContain("upload-list-picture");
    const fileInput = wrapper.get("input").element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapper.get("input").trigger("change");
    await flushPromises();
    expect(wrapper.findAll("li").length).toBe(1);
    expect(wrapper.find("li:first-child img").exists()).toBeTruthy();
    const firstImg = wrapper.get("li:first-child img");
    expect(firstImg.attributes("src")).toEqual("test.url");
  });
  afterEach(() => {
    mockAxios.post.mockReset();
  });
});
