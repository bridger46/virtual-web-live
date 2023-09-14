import { createRouter, createWebHistory } from 'vue-router';

import livePlay from '../views/videoPlay/index.vue';

// 导入其他需要的组件和配置
const routes = [
  { path: '', component: livePlay },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
