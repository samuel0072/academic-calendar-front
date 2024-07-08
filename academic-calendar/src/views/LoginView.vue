<!-- script src = "./scripts/LoginView.js"></script -->

<template>
    <div>
        <form @submit.prevent="login">
            <div>
                <label for="username">Digite seu username</label>
                <input id="username" type="text" v-model="username" required/>
            </div>
            <div>
                <label for="password">Digite sua senha</label>
                <input id="password" type="password" v-model="password" required />
            </div>
            <div v-if="!loading">
                <BaseButton type="submit"> Entrar </BaseButton>
            </div>
            <div v-else>
                carregando...
            </div>

            <div v-if="errored">
                {{ errorMsg }}
            </div>
            
        </form>
        
    </div>
    
</template>

<script>
import { useUserAuthInfoStore } from '../stores/userAuthInfo.js'
import { mapStores } from 'pinia'
import axios from 'axios';
import BaseButton from '@/components/BaseButton.vue';

export default {
    data: function() {
        return {
            username: "",
            password: "",
            loading: false,
            errored: false,
            errorMsg : ""
        }
    },
	methods: {
		login () {
            this.loading = true
            this.errored = false

            const store = useUserAuthInfoStore()

            axios.post('api/auth/jwt_token', {
                username: this.username,
                password: this.password
            })
            .then( response => {
                store.changeAuthenticateState(true)
                store.setAuthToken(response.data.access)
                store.setRefreshToken(response.data.refresh)
                
                if(this.$route.query.next !== null && this.$route.query.next !== undefined) {
                    this.$router.push({path: this.$route.query.next})
                }
                else {
                    this.$router.push({name: 'home'})
                }
                
            })
            .catch(error => {
                this.errored = true
                if(error.request.status == 401) {
                    this.errorMsg = error.response.data.detail
                }
                else {
                    this.errorMsg = "Could not contact the authentication server. Try again later."
                }
                
            })
            .finally(() => this.loading = false)
            
            
		}
	},
    computed: {
        ...mapStores(useUserAuthInfoStore)
    },
    components: {
        'BaseButton': BaseButton
    }
}
</script>