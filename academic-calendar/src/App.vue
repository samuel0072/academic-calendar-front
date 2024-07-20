<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div id="app">
    <div>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/calendars">Calendars</router-link>
        <router-link to="/login">Login</router-link>

      </nav>
    </div>
      <div>
        <router-view />
      </div>

    
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
