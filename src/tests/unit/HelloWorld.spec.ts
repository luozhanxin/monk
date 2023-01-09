import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";
import Hello from "@/components/Hello.vue";

describe("HelloWorld", () => {
  it("renders properly", () => {
    const wrapper = shallowMount(HelloWorld, {
      props: { msg: "Hello" },
    });
    expect(wrapper.text()).toContain("Hello");
    console.log(wrapper.findComponent(Hello).props());
  });
});
