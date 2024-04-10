import { RouterView, createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import AijiuMachinesView from '@/views/AijiuMachine/AijiuMachinesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes.concat([{ path: "/:pathMatch(.*)*", redirect: '/aijiumachines' }])
})

export default router
