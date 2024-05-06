import AijiuMachinesView from '../views/AijiuMachine/AijiuMachinesView.vue'
import OrgView from '../views/Orgs/OrgsView.vue'
import LoginView from '../views/Login/LoginView.vue'
import DashboardView from '../views/Dashboard/DashboardView.vue'

const routes = [
    {path: '/dashboard', name: '总览', component: DashboardView},
    {path: '/aijiumachines', name: '灸疗仪', component: AijiuMachinesView},    
    {path: '/orgs', name: '组织', component: OrgView},
    {path: '/login', name: '登录', component: LoginView}
]

export default routes