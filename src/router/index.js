import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/repos/:username/:repo',
    name: 'RepoDetails',
    component: () => import ('../components/RepoDetails.vue')
  },
  {
    path: '/:catchAll(.*)',
    name: 'not-found',
    component: () => import ('../views/NotFoundView.vue')
  }
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
