<template>
  <a-layout>
    <a-layout-sider width="300" style="background: white">
      <div class="sidebar-container">
        组件列表
        <components-list
          :list="defaultTextTemplates"
          @onItemClick="addItem"
        ></components-list>
      </div>
    </a-layout-sider>
    <a-layout style="padding: 0 24px 24px">
      <a-layout-content class="preview-container">
        <p>画布区域</p>
        <div class="preview-list" id="canvas-area">
          <edit-wrapper
            v-for="component in components"
            :key="component.id"
            :id="component.id"
            @setActive="setActive"
            :active="component.id === (currentElement && currentElement.id)"
          >
            <component :is="component.name" v-bind="component.props">
            </component>
          </edit-wrapper>
        </div>
      </a-layout-content>
    </a-layout>
    <a-layout-sider
      width="300"
      style="background: white"
      class="settings-panel"
    >
      组件属性
      <props-table
        v-if="currentElement && currentElement.props"
        :props="currentElement.props"
      ></props-table>
    </a-layout-sider>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useEditor } from "@/stores/editor";
import EditWrapper from "@/components/EditWrapper.vue";
import MText from "@/components/MText.vue";
import PropsTable from "@/components/PropsTable.vue";
import ComponentsList from "@/components/ComponentsList.vue";
import { defaultTextTemplates } from "@/defaultTemplates";
export default defineComponent({
  components: {
    MText,
    ComponentsList,
    EditWrapper,
    PropsTable,
  },
  setup() {
    const store = useEditor();
    const components = computed(() => store.components);
    const currentElement = computed<any>(() => store.getCurrentElement);
    const addItem = (props: any) => {
      store.addComponent(props);
    };
    const setActive = (id: string) => {
      store.setActive(id);
    };
    return {
      components,
      defaultTextTemplates,
      currentElement,
      addItem,
      setActive,
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
