import { createRouter, createWebHistory } from 'vue-router';


import login from '../views/login/index.vue';
import liveList from '../views/liveList/index.vue';
import livePlay from '../views/videoPlay/index.vue';

// 导入其他需要的组件和配置
const routes = [
  { path: '/', component: login },
  { path: '/liveList', component: liveList },
  { path: '/livePlay', component: livePlay },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
