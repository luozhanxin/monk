import { shallowMount, VueWrapper, flushPromises } from "@vue/test-utils";
import { describe, it, expect, beforeAll, vi } from "vitest";
import UploaderFile from "@/components/UploaderFile.vue";
import axios from "axios";

const mockAxios = axios as vi.importActual<typeof axios>;
let wrapper: VueWrapper<any>;
const testFile = new File(["xyz"], "test.png", { type: "image/png" });
vi.mock("axios");

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
    expect(wrapper.get("button span").text()).toBe("点击上传");
    expect(wrapper.get("input").isVisible()).toBeFalsy();
  });
  it("upload process should works fine", async () => {
    // change e.target.files
    mockAxios.post.mockResolvedValueOnce({ status: "success" });
    const fileInput = wrapper.find("input").element as HTMLInputElement;
    const files = [testFile] as any;
    // hack
    Object.defineProperty(fileInput, "files", {
      value: files,
      writable: false,
    });
    // create a file
    await wrapper.get("input").trigger("change");
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(wrapper.get("button span").text()).toBe("正在上传");
    // button 为 disabled
    expect(wrapper.get("button").attributes("disabled")).toBeTruthy();
    // 列表长度修改，并且有正确的 class
    expect(wrapper.findAll("li").length).toBe(1);
    const firstItem = wrapper.get("li:first-child");
    expect(firstItem.classes()).toContain("uploading");
    await flushPromises();
    expect(wrapper.get("button span").text()).toBe("上传成功");
    // 有正确的 class，并且文件名称相对应
    expect(firstItem.classes()).toContain("upload-success");
    expect(firstItem.get(".filename").text()).toBe(testFile.name);
  });
  it("should return error text when post is rejected", async () => {
    mockAxios.post.mockRejectedValueOnce({ error: "error" });
    await wrapper.get("input").trigger("change");
    expect(mockAxios.post).toHaveBeenCalledTimes(2);
    expect(wrapper.get("button span").text()).toBe("正在上传");
    await flushPromises();
    expect(wrapper.get("button span").text()).toBe("上传失败");
  });
});
