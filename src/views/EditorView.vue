<template>
  <a-layout>
    <a-layout-sider width="300" style="background: white">
      <div class="sidebar-container">
        组件列表
        <components-list
          :list="defaultTextTemplates"
          @onItemClick="addItem"
        ></components-list>
        <style-uploader></style-uploader>
      </div>
    </a-layout-sider>
    <a-layout style="padding: 0 24px 24px">
      <a-layout-content class="preview-container">
        <p>画布区域</p>
        <div class="preview-list" id="canvas-area">
          <div class="body-container" :style="page.props">
            <edit-wrapper
              v-for="component in components"
              :key="component.id"
              :id="component.id"
              @setActive="setActive"
              :active="component.id === (currentElement && currentElement.id)"
            >
              <component
                :is="component.name"
                v-bind="component.props"
                v-show="!component.isHidden"
              >
              </component>
            </edit-wrapper>
          </div>
        </div>
      </a-layout-content>
    </a-layout>
    <a-layout-sider
      width="300"
      style="background: white"
      class="settings-panel"
    >
      <a-tabs type="card" v-model:activeKey="activePanel">
        <a-tab-pane key="component" tab="组件属性">
          <div v-if="currentElement">
            <edit-group
              v-if="!currentElement.isLocked"
              :props="currentElement.props"
              @change="handleChange"
            ></edit-group>
            <div v-else>
              <a-empty>
                <template #description>
                  <p>该元素被锁定，无法编辑</p>
                </template>
              </a-empty>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="layer" tab="图层设置">
          <layer-list
            :list="components"
            :selectedId="currentElement && currentElement.id"
            @change="handleChange"
            @select="setActive"
          ></layer-list>
        </a-tab-pane>
        <a-tab-pane key="page" tab="页面设置">
          <props-table :props="page.props" @change="pageChange"></props-table>
        </a-tab-pane>
      </a-tabs>
    </a-layout-sider>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useEditor } from "@/stores/editor";
import EditWrapper from "@/components/EditWrapper.vue";
import LayerList from "@/components/LayerList.vue";
import EditGroup from "@/components/EditGroup.vue";
import ComponentsList from "@/components/ComponentsList.vue";
import { defaultTextTemplates } from "@/defaultTemplates";
import StyleUploader from "@/components/StyleUploader.vue";
import PropsTable from "@/components/PropsTable.vue";
export type TabType = "component" | "layer" | "page";
export default defineComponent({
  components: {
    ComponentsList,
    EditWrapper,
    StyleUploader,
    LayerList,
    EditGroup,
    PropsTable,
  },
  setup() {
    const store = useEditor();
    const components = computed(() => store.components);
    const page = computed(() => store.page);
    const activePanel = ref<TabType>("component");
    const currentElement = computed<any>(() => store.getCurrentElement);
    const addItem = (component: any) => {
      store.addComponent(component);
    };
    const setActive = (id: string) => {
      store.setActive(id);
    };
    const handleChange = (e: any) => {
      store.updateComponent(e);
    };
    const pageChange = (e: any) => {
      store.updatePage(e);
    };
    return {
      components,
      defaultTextTemplates,
      currentElement,
      activePanel,
      page,
      addItem,
      setActive,
      handleChange,
      pageChange,
    };
  },
});
</script>

<style scoped>
.sidebar-container {
  padding: 20px;
}
.preview-container {
  padding: 24px;
  margin: 0;
  min-height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 200px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  margin-top: 50px;
  max-height: 80vh;
}

.settings-panel .ant-tabs-top-content {
  max-height: calc(100vh - 68px - 56px);
  overflow-y: auto;
}
</style>
