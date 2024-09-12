<script setup>
import HelloWorld from './components/HelloWorld.vue'
import BaseToastContainer from '@/components/BaseToastContainer.vue'
import BaseToast from '@/components/BaseToast.vue'
</script>

<template>
  <div id="app">
    <header>
      <nav>
        <router-link to="/calendars">Calendars</router-link>
        <router-link to="/login">Login</router-link>
        <router-link to="/configuration">Configurações</router-link>

      </nav>
    </header>
      <div>
        <router-view />
      </div>

      <BaseToastContainer class="position-fixed bottom-0 end-0 p-3" id="global-toast-container">
            <BaseToast 
                title="Sucesso" 
                message="" 
                id="global-sucess-toast" 
                class="text-bg-success" />

            <BaseToast 
                title="Erro" 
                message="" 
                id="global-fail-toast" 
                class="text-bg-danger" />    

      </BaseToastContainer>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  
}
nav {
  overflow: hidden;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  margin-left: -1rem;
}
.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
