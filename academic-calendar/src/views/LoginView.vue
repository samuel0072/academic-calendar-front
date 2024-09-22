<template>
    <CenteredSubPage>
        <div class="subpage1">
            <TextTitle1>Fazer Login</TextTitle1>
            <BaseForm @submit="login">
                <InputGroup >
                    <InputGroupText>
                        <i class="bi bi-at"></i>
                    </InputGroupText>
                    <FloatingInput 
                        id="email-input"
                        label="Digite seu e-mail"
                        type="email"
                        v-model="username"
                        :required="true"
                        maxlength="150"
                        />
                </InputGroup>

                <InputGroup >
                    <InputGroupText>
                        <i class="bi bi-shield-lock"></i>
                    </InputGroupText>
                        <FloatingInput 
                        id="password-input"
                        label="Digite sua senha"
                        type="password"
                        v-model="password"
                        :required="true"
                        />
                </InputGroup>

                <BaseButton type="submit" class="btn-outline-primary" > Entrar </BaseButton>
                
            </BaseForm>
        </div>
        
        <BaseToastContainer class="position-fixed bottom-0 end-0 p-3">

        <BaseToast 
            title="Erro" 
            :message="errorToast.msg" 
            id="fail-toast" 
            class="text-bg-danger" />    

        </BaseToastContainer>
    </CenteredSubPage>
    
    
</template>

<style scoped>
.subpage1 {
    width: 25vw;
}
</style>

<script>
import { useUserAuthInfoStore } from '../stores/userAuthInfo.js'
import { mapStores } from 'pinia'
import axios from 'axios';
import * as bootstrap from 'bootstrap'

import getOrgCampi from '@/assets/scripts/campi.js'

import BaseButton from '@/components/BaseButton.vue'
import BaseForm from '@/components/BaseForm.vue'
import FloatingInput from '@/components/FloatingInput.vue'
import TextTitle1 from '@/components/text-components/TextTitle1.vue'
import BaseToastContainer from '@/components/BaseToastContainer.vue'
import BaseToast from '@/components/BaseToast.vue'
import CenteredSubPage from '@/components/CenteredSubPage.vue'
import InputGroup from '@/components/InputGroup.vue'
import InputGroupText from '@/components/InputGroupText.vue';

export default {
    data: function() {
        return {
            username: "",
            password: "",
            errorToast: {
                el: null,
                msg: ""
            },
        }
    },
    mounted: function() {
        this.errorToast.el = bootstrap.Toast.getOrCreateInstance("#fail-toast");
    },
	methods: {
		login () {
            axios.post('api/auth/jwt_token', {
                username: this.username,
                password: this.password
            })
            .then( response => {
                this.userAuthInfoStore.changeAuthenticateState(true)
                this.userAuthInfoStore.setAuthToken(response.data.access)
                this.userAuthInfoStore.setRefreshToken(response.data.refresh)
                
                this.$router.push({name: 'home'})

                getOrgCampi()
                
            })
            .catch(error => {
                if(error.response) {
                    if(error.request.status === 401) {
                        this.errorToast.msg  = "Não foi possível se autenticar com as credênciais informadas. Tente novamente."
                        this.errorToast.el.show()
                    }
                    else if(error.request.status === 500){
                        this.errorToast.msg  = "Não foi possível se conectar com o servidor."
                        this.errorToast.el.show()
                    }
                }
                else if(error.request) {
                    if(error.code === "ERR_NETWORK") {
                        this.errorToast.msg  = "Esse cliente não consegue se conectar com a internet."
                        this.errorToast.el.show()
                    }
                }
                else {
                    console.log(error)
                    this.errorToast.msg  = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
                    this.errorToast.el.show()
                }
            })
		}
	},
    computed: {
        ...mapStores(useUserAuthInfoStore)
    },
    components: {
        BaseButton,
        BaseForm,
        FloatingInput,
        TextTitle1,
        BaseToastContainer,
        BaseToast,
        CenteredSubPage,
        InputGroup,
        InputGroupText
    }
}
</script>