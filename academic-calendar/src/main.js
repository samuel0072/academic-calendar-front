import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import { useUserAuthInfoStore } from '@/stores/userAuthInfo.js'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import getOrgCampi from '@/assets/scripts/campi.js'

Vue.use(PiniaVuePlugin)

new Vue({
  router,
  pinia: createPinia(),
  render: (h) => h(App),
  created: function() {
    
    var authToken = localStorage.getItem("authToken")
    var refreshtoken = localStorage.getItem("refreshToken")

    if( authToken === undefined || authToken === null || authToken.length === 0) {
      this.$router.push({ name:"login"})
    }
    else {
      var authStore = useUserAuthInfoStore()
      authStore.changeAuthenticateState(true)
      authStore.setAuthToken(authToken, false)
      authStore.setRefreshToken(refreshtoken, false)
      getOrgCampi()
    }
  }
}).$mount('#app')