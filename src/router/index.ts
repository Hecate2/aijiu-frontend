import { createRouter, createWebHistory } from 'vue-router'
import OrgView from '../views/Org/OrgView.vue'
import LoginView from '../views/Login/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/orgs', name: 'orgs', component: OrgView},
    {path: '/login', name: 'login', component: LoginView}
  ]
})

export default router
