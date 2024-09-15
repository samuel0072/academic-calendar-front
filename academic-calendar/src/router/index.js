import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '../views/LoginView.vue'
import CalendarList from '../views/CalendarListView.vue'
import CalendarDetail from '../views/CalendarDetail.vue'
import Error404 from '../views/Error404.vue'
import SemesterCreation from '../views/SemesterCreation.vue'
import EditSemester from '../views/EditSemester.vue'
import EventFileExplanation from '../views/EventFileExplanation.vue'
import HolidayFileExplanation from '../views/HolidayFileExplanation.vue'
import ConfigurationView from '../views/ConfigurationView.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: CalendarList
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/calendars',
      name: 'calendars',
      component: CalendarList
    },
    {
      path: '/calendar/:id/view',
      name: 'calendar-view',
      component: CalendarDetail
    },
    {
      path: '/calendar/:calendar_id/create-semester',
      name: 'semester-creation',
      component: SemesterCreation
    },
    {
      path: '/semester/:id/edit',
      name: 'semester-update',
      component: EditSemester
    },
    {
      path: '/event-file/explanation',
      name: 'event-file-explanation',
      component: EventFileExplanation
    },
    {
      path: '/holiday-file/explanation',
      name: 'holiday-file-explanation',
      component: HolidayFileExplanation
    },
    {
      path: '/configuration',
      name: 'configuration',
      component: ConfigurationView
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: Error404
    }
  ]
})

export default router

export function useRouter() {
  return router
}