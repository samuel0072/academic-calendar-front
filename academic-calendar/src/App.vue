<template>
    <div id="app">
        <NavBar id="page-header" v-if="userAuthInfoStore.isAuthenticated">
            <div>
                <router-link to="/calendars">Calendários</router-link>
            </div>
            <DropdownMenu>
                <Avatar/>
                <template v-slot:options>
                    <DropdownItem>
                        <router-link to="/configuration" class="dropdown-item"> <i class="bi bi-gear"></i> Configurações</router-link>
                    </DropdownItem>
                    <DropdownItem>
                        <BaseButton type="button" @click.native="logout" class="dropdown-item"><i class="bi bi-box-arrow-right"></i> Sair</BaseButton>
                    </DropdownItem>
                </template>
            </DropdownMenu>
        </NavBar>
        <Page id="main-content">
            <router-view />
            
        </Page>
        
        
        <BaseButton 
            type="button" 
            id="navigate-to-top" 
            class="bg-secondary" 
            @click.native="scrollPageToTop"
            v-if="userAuthInfoStore.isAuthenticated"> 
            <i class="bi bi-chevron-up"></i> 
            <span class="visually-hidden">Ir para o topo da página</span>
        </BaseButton>

        <BaseToastContainer class="position-fixed bottom-0 end-0 p-3" id="global-toast-container">
            <BaseToast 
            title="" 
            message="Sucesso" 
            id="global-sucess-toast" 
            class="text-bg-success" />

            <BaseToast 
            title="" 
            message="Erro" 
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
        max-width: calc(100vw - 1rem);
        padding: 0;
    }
    header {
        line-height: 1.5;
        max-height: 3rem;
        padding: 1rem;

    }
    nav {
        overflow: hidden;
        /* position: sticky;
        position: -webkit-sticky; */
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

    nav a:first-of-type {
        border: 0;
    }

    #navigate-to-top {
        position: fixed !important;
        bottom: 5% !important;
        right: 5% !important;
        border-radius: 100%;
    }
</style>

<script>
import BaseToastContainer from '@/components/BaseToastContainer.vue'
import BaseToast from '@/components/BaseToast.vue'
import NavBar from '@/components/NavBar.vue';
import Page from '@/components/Page.vue';
import Avatar from '@/components/Avatar.vue';
import DropdownMenu from '@/components/DropdownMenu.vue';
import DropdownItem from '@/components/DropdownItem.vue';
import logoutUser from '@/assets/scripts/logoutUser.js';
import BaseButton from './components/BaseButton.vue';

import { useUserAuthInfoStore } from '@/stores/userAuthInfo.js'
import { mapStores } from 'pinia'

export default {
    components: {
        BaseToastContainer,
        BaseToast,
        NavBar,
        Page,
        Avatar,
        DropdownMenu,
        DropdownItem,
        BaseButton
    },
    computed: {
        ...mapStores(useUserAuthInfoStore)
    },
    methods: {
        logout() {
            logoutUser()
        },
        scrollPageToTop() {
            window.document.documentElement.scroll({
                top: 0
            })
        }
    }
}
</script>