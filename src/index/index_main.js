import { createApp } from "vue";
import "../styles.css";
import App from "./Index.vue";
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import router from './router'; // 导入路由文件


const app = createApp(App)

app.use(router).mount('#app')
app.use(ElementPlus, {
    locale: zhCn,
})