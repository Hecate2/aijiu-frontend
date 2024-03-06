import { createRouter, createWebHistory } from 'vue-router'
import OrgView from '../views/Org/OrgView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'org',
      component: OrgView
    }
  ]
})

export default router
