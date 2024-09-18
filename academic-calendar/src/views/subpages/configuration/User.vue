<template>
    <div>
        <TextTitle1>Usuários</TextTitle1>
        <div id="user-creation">
            <TextTitle3>Criação de Usuários</TextTitle3>
            <BaseForm @submit="createUser">
                <FloatingInput 
                    id="new-user-email-input"
                    v-model="newUser.email" 
                    label="Email do usuário"
                    type="email"
                    maxlength="150"
                    :required="true"
                />

                <FloatingInput 
                    id="new-user-name-input"
                    v-model="newUser.name" 
                    label="Nome completo do usuário"
                    type="text"
                    maxlength="150"
                    :required="true"
                    ref="nameInput"
                >
                    <FormInputFeedback type="invalid">
                        <div v-for="msg in newUserInputFeedbacks.name" :key="`name-input-error-${msg}`">
                            {{ msg }}
                        </div>
                    </FormInputFeedback>
                </FloatingInput>

                <FloatingInput 
                    id="new-user-password-input"
                    v-model="newUser.password" 
                    label="Senha do usuário"
                    type="password"
                    maxlength="150"
                    :required="true"
                    ref="passwordInput"
                >
                    <FormInputFeedback type="invalid">
                        <div v-for="msg in newUserInputFeedbacks.password" :key="`password-input-error-${msg}`">
                            {{ msg }}
                        </div>
                    </FormInputFeedback>
                </FloatingInput>

                <FloatingInput 
                    id="new-user-confirm-password-input"
                    v-model="newUser.confirm_password" 
                    label="Confirme a senha"
                    type="password"
                    maxlength="150"
                    :required="true"
                />
                <BaseButton type="submit" class="btn-outline-primary" ><i class="bi bi-plus-lg"></i> Criar Usuário</BaseButton>
            </BaseForm>
        </div>
        <HorizontalLine />
        <div id="user-list">
            <TextTitle3>Lista de Usuários</TextTitle3>
            <BaseUnorderedList>
                <BaseListItem v-for="user in users" :key="`user-${user.id}`">
                    {{ user.first_name }} {{ user.last_name }} <VerticalRule /> {{ user.email }}

                    <template v-slot:post-item-section>
                        <BaseButton type="button" class="btn btn-outline-danger" @click.native="openDeleteModal(user)"><i class="bi bi-trash3"></i> </BaseButton>
                    </template>
                    
                </BaseListItem>
            </BaseUnorderedList>
        </div>

        <BaseToastContainer class="position-fixed bottom-0 end-0 p-3">
            <BaseToast 
                title="Sucesso" 
                :message="successToast.msg" 
                id="user-sucess-toast" 
                class="text-bg-success" />

            <BaseToast 
                title="Erro" 
                :message="errorToast.msg" 
                id="user-fail-toast" 
                class="text-bg-danger" />    

        </BaseToastContainer>

        <BaseModal id="deleteUser">
			<template v-slot:modal-title>
				<TextTitle5>
					Confirmação de exclusão
				</TextTitle5>
			</template>

			<template v-slot:modal-body>
				Tem certeza que deseja excluir esse usuário?
                <br/>
                Essa ação não é reversível.
			</template>

			<template v-slot:modal-footer>
				<div>
					<BaseButton type="button"  class="btn btn-danger" @click.native="deleteUser(selectedUser)">
						Confirmar
					</BaseButton>
				</div>
			</template>
		</BaseModal>
    </div>
</template>
<script>
    import TextTitle1 from '@/components/text-components/TextTitle1.vue'
    import TextTitle3 from '@/components/text-components/TextTitle3.vue'
    import TextTitle5 from '@/components/text-components/TextTitle5.vue'
    import BaseUnorderedList from '@/components/BaseUnorderedList.vue'
    import BaseListItem from '@/components/BaseListItem.vue'
    import BaseButton from "@/components/BaseButton.vue"
    import BaseForm from '@/components/BaseForm.vue'
    import FloatingInput from '@/components/FloatingInput.vue'
    import HorizontalLine from '@/components/HorizontalLine.vue'
    import BaseToastContainer from '@/components/BaseToastContainer.vue'
    import BaseToast from '@/components/BaseToast.vue'
    import FormInputFeedback from '@/components/FormInputFeedback.vue'
    import BaseModal from '@/components/BaseModal.vue'
    import VerticalRule from '@/components/VerticalRule.vue'

    import * as bootstrap from 'bootstrap'
    import axios from 'axios'

    import { mapStores } from "pinia"
	import { useUserAuthInfoStore } from "@/stores/userAuthInfo"
	import { useOrganizationInfoStore } from "@/stores/organizationInfo"
    import refreshUserAuthToken from '@/assets/scripts/refreshUserAuthToken.js'

    export default {
        data: function() {
            return {
                users: [],
                newUser: {
                    email: "",
                    name: "",
                    password: "",
                    confirm_password: ""
                },
                successToast: {
                    el: null,
                    msg: ""
                },
                errorToast: {
                    el: null,
                    msg: ""
                },
                newUserInputFeedbacks: {
                    name: "",
                    password: ""
                },
                selectedUser: null,
                deleteModal: null
            }
        },
        methods: {
            getUsers() {
                axios.get('api/academic-calendar/user/list', {
                    headers: {
                        Authorization: `Bearer ${this.userAuthInfoStore.token}`
                    }
                })
                .then((res) => {
                    this.users = res.data
                })
                .catch((error) => {
                    if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.getUsers)
                            //TODO Exibir um toast quando o usuário for redirecionado pro login
                        }
                        else if(error.request.status === 500){
                            this.errorToast.msg = "Não foi possível se conectar com o servidor."
                            this.errorToast.el.show()
                        }
                    }
                    else if(error.request) {
                        if(error.code === "ERR_NETWORK") {
                            this.errorToast.msg = "Esse cliente não consegue se conectar com a internet."
                            this.errorToast.el.show()
                        }
                    }
                    else {
                        console.log(error)
                        this.errorToast.msg = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
                        this.errorToast.el.show()
                    }
                })
            },
            createUser() {
                var payload = this.newUser
                payload.first_name = this.userNameSlitted[0]
                payload.last_name = this.userNameSlitted.slice(1).join(" ")

                this.$refs.passwordInput.resetValidation()
                this.$refs.nameInput.resetValidation()

                axios.post(`api/academic-calendar/user/create`, this.newUser, 
                {
                    headers: {
                        'Authorization': `Bearer ${this.userAuthInfoStore.token}`
                    }
                }).then( (res) => {
                    this.users.push(res.data)

                    this.successToast.msg = "O usuário foi criado com sucesso!"
                    this.successToast.el.show();
                }).catch( (error) => {
                    if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.createUser)
                        }
                        else if(error.request.status === 422 ){
                            if(Object.hasOwn(error.response.data, 'username')) {
                                this.errorToast.msg = "Esse usuário não pode ser criado com esse e-mail. Por favor, utilize outro e-mail."
                                this.errorToast.el.show()
                            }
                            if(Object.hasOwn(error.response.data, 'password')) {
                                this.newUserInputFeedbacks.password = error.response.data["password"]
                                this.$refs.passwordInput.validate("invalid")
                            }
                            if(Object.hasOwn(error.response.data, 'first_name')) {
                                this.newUserInputFeedbacks.name = error.response.data["first_name"]
                                this.$refs.nameInput.validate("invalid")
                            }
                            if(Object.hasOwn(error.response.data, 'last_name')) {
                                this.newUserInputFeedbacks.name = error.response.data["last_name"]
                                this.$refs.nameInput.validate("invalid")
                            }
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
            },
            openDeleteModal(user) {
                this.selectedUser = user
                this.deleteModal.show()
            },
            deleteUser(user) {
                axios.delete(`api/academic-calendar/user/${user.id}/delete`, {
                    headers: {
                        Authorization: `Bearer ${this.userAuthInfoStore.token}`
                    }
                }).then( (_) => {
                    var index = this.users.findIndex((u) => user.id === u.id)
                    this.users.splice(index, 1);

                    this.successToast.msg = "O usuário foi excluído com sucesso!"
                    this.successToast.el.show()
                    this.deleteModal.hide()
                    this.selectedUser = null;

                }).catch( (error) => {
                    if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.deleteUser, [user])
                        }
                        if(error.request.status === 422) {
                            this.errorToast.msg  = "Você não pode excluir seu próprio usuário."
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
        mounted: function() {
            this.getUsers()
            this.successToast.el = bootstrap.Toast.getOrCreateInstance("#user-sucess-toast");
            this.errorToast.el = bootstrap.Toast.getOrCreateInstance("#user-fail-toast");
            this.deleteModal = bootstrap.Modal.getOrCreateInstance("#deleteUser");
        },
        computed: {
            ...mapStores(useUserAuthInfoStore, useOrganizationInfoStore),
            userNameSlitted() {
                return this.newUser.name.split(" ")
            }
        },
        components: {
            TextTitle1,
            TextTitle3,
            TextTitle5,
            BaseUnorderedList,
            BaseListItem,
            BaseButton,
            BaseForm,
            FloatingInput,
            HorizontalLine,
            BaseToastContainer,
            BaseToast,
            FormInputFeedback,
            BaseModal,
            VerticalRule
        }
    }
</script>