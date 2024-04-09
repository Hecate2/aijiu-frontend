import { createRouter, createWebHistory } from 'vue-router'
import AijiuMachines from '../views/AijiuMachine/AijiuMachinesView.vue'
import OrgView from '../views/Orgs/OrgsView.vue'
import LoginView from '../views/Login/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/aijiumachines', name: 'aijiumachines', component: AijiuMachines},    
    {path: '/orgs', name: 'orgs', component: OrgView},
    {path: '/login', name: 'login', component: LoginView}
  ]
})

export default router
