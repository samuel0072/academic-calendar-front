import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import LoadingView from '../views/LoadingView.vue'
import LogoutView from '../views/LogoutView.vue'
import RefreshView from '../views/RefreshView.vue'
import AboutView from '../views/AboutView.vue'
import CalendarList from '../views/CalendarListView.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AboutView
    },
    {
      path: '/loading',
      name: 'loading-page',
      component: LoadingView
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutView
    },
    {
      path: '/refresh',
      name: 'refresh',
      component: RefreshView
    },
    {
      path: '/calendars',
      name: 'calendars',
      component: CalendarList
    }
  ]
})

export default router

export function useRouter() {
  return router
}