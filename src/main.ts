import { createApp } from "vue";
import { createPinia } from "pinia";
import Antd from "ant-design-vue";
import MonkComponents from "monk-components";
import "monk-components/dist/monk-components.css";
import "ant-design-vue/dist/antd.css";
import "cropperjs/dist/cropper.css";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(MonkComponents);
app.use(router);
app.use(Antd);

app.mount("#app");
