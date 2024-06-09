import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import { useUserAuthInfoStore } from '@/stores/userAuthInfo.js'
//import { env } from 'node:process';

import App from './App.vue'
import router from './router'

import './assets/main.css'

Vue.use(PiniaVuePlugin)

new Vue({
  router,
  pinia: createPinia(),
  render: (h) => h(App),
  created: function() {
    
    var authToken = localStorage.getItem("authToken")
    var refreshtoken = localStorage.getItem("refreshToken")

    if( authToken === undefined || authToken === null || authToken.length === 0) {
      //se estiver vazio, manda o usuário pra tela de login com o parametro next igual ao path atual
      this.$router.push({ name:"login", query: { next: this.$route.path } })
    }
    else {
      // senão, carrega o token na store
      var store = useUserAuthInfoStore()
      store.changeAuthenticateState(true)
      store.setAuthToken(authToken, false)
      store.setRefreshToken(refreshtoken, false)
    }
    
    
  }
}).$mount('#app')

//colocar aqui o lifeclycle created pra jogar o cara pra loading page
//colocar o lifecycle mounted pra jogar o cara pra home page
//remover essa porcaria acima
//o fluxo vai ser 
//-> cara chega na aplicação 
//-> recupera o token de autenticação dele no sessionStorage
//-> se ele não tiver token, joga pra página de login
//-> se ele tiver, verifica se o token expirou
// -> se expirou, joga pra página de login
// -> se não, usa vite para guardar num storage 
// injeta o token no Authentication header como um Bearer  nos requets
// precisa colocar um erroHandler global para quando a API retornar erro 401(que é quando ele está desautenticado)
//https://v2.vuejs.org/v2/guide/instance#Instance-Lifecycle-Hooks
//https://v2.vuejs.org/v2/cookbook/client-side-storage.html?redirect=true
//https://v2.vuejs.org/v2/cookbook/using-axios-to-consume-apis
//fazer um proxy em prpdução https://stackoverflow.com/questions/71618204/is-there-any-solution-to-solve-cors-error-in-vite-js
//https://stackoverflow.com/questions/66247988/how-to-store-jwt-tokens-in-httponly-cookies-with-drf-djangorestframework-simplej
//botar esse interceptor https://github.com/axios/axios#interceptors
//https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-vue-app-with-vue-i18n