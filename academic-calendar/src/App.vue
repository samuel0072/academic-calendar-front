<template>
    <div id="app">
        <NavBar id="page-header">
            <div>
                <router-link to="/calendars">Calendarios</router-link>
            </div>
            <DropdownMenu>
                <Avatar/>
                <template v-slot:options>
                    <DropdownItem>
                        <router-link to="/configuration" class="dropdown-item">Configurações</router-link>
                    </DropdownItem>
                    <DropdownItem>
                        <router-link to="/configuration" class="dropdown-item">Sair</router-link>
                    </DropdownItem>
                </template>
            </DropdownMenu>
        </NavBar>
        <Page id="main-content">
            <router-view />
        </Page>

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

    #app {
        top: 0;
        position: absolute;
        min-width: calc(100vw - 1rem);
        padding: 0;
    }
    header {
        line-height: 1.5;
        max-height: 3rem;
        padding: 1rem;

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

    /* nav a.router-link-exact-active:hover {
        background-color: transparent;
    } */

    /* nav a {
        display: inline-block;
        padding: 0 1rem;
        border-left: 1px solid var(--color-border);
    } */

    nav a:first-of-type {
        border: 0;
    }
</style>

<script setup>
import BaseToastContainer from '@/components/BaseToastContainer.vue'
import BaseToast from '@/components/BaseToast.vue'
import NavBar from '@/components/NavBar.vue';
import Page from '@/components/Page.vue';
import Avatar from '@/components/Avatar.vue';
import DropdownMenu from '@/components/DropdownMenu.vue';
import DropdownItem from '@/components/DropdownItem.vue';
</script>