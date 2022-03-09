import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import(/* webpackChunkName: "orders" */ '../views/OrdersView.vue')
  }
];

// Vite wants import.meta, Vue CLI wants process.env, make them play together with tsconfig: `"types": ["vite/client"]`
const baseUrl: string = import.meta.env?.BASE_URL ?? process.env?.BASE_URL;

const router = createRouter({
  history: createWebHistory(baseUrl),
  routes
});

export default router;
