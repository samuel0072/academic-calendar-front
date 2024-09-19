<template>
    <div>
        <TextTitle1>Campus</TextTitle1>
        <div id="create-campus">
            <TextTitle2>Criação de Campus</TextTitle2>
            <BaseForm @submit="createCampus" id="campus-creation-form" >
                <FloatingInput 
                        id="new-campus-name"
                        v-model="newCampus.name" 
                        label="Nome do campus"
                        type="text"
                        maxlength="150"
                        :required="true"
                />
                <BaseButton type="submit"  class="btn-outline-primary" ><i class="bi bi-plus-lg"></i> Criar Campus</BaseButton>
            </BaseForm>
        </div>
        <HorizontalLine />
        <div id="list-campus">
            <TextTitle2>Lista de Campi</TextTitle2>
            <BaseUnorderedList v-if="organizationInfoStore.campi.length > 0">
                <BaseListItem v-for="campus in organizationInfoStore.campi" :key="`campus-${campus.id}`">
                    <BaseForm @submit="editCampus(campus)">
                        <div class="input-group">
                            <FloatingInput 
                                :id="`campus-${campus.id}`"
                                v-model="campus.name" 
                                label="Nome do campus"
                                type="text"
                                maxlength="150"
                                :required="true"
                            />
                            <BaseButton type="submit" class="btn-outline-primary" ><i class="bi bi-pencil-square"></i></BaseButton>
                            <BaseButton type="button" class="btn-outline-danger" @click.native="openDeleteCampusModal(campus)"><i class="bi bi-trash3"></i></BaseButton>
                        </div>
                    </BaseForm>
                </BaseListItem>
            </BaseUnorderedList>

            <EmptyState v-else
                msg="Não há campus para exibir"/>
        </div>

        <BaseToastContainer class="position-fixed bottom-0 end-0 p-3">
            <BaseToast 
                title="Sucesso" 
                :message="successToast.msg" 
                id="sucess-toast" 
                class="text-bg-success" />

            <BaseToast 
                title="Erro" 
                :message="errorToast.msg" 
                id="fail-toast" 
                class="text-bg-danger" />    

        </BaseToastContainer>

        <BaseModal id="deleteCampus">
			<template v-slot:modal-title>
				<TextTitle5>
					Confirmação de exclusão
				</TextTitle5>
			</template>

			<template v-slot:modal-body>
				Tem certeza que deseja excluir esse campus?
                <br/>
                Essa ação não é reversível.
			</template>

			<template v-slot:modal-footer>
				<div>
					<BaseButton type="button"  class="btn btn-danger" @click.native="deleteCampus(selectedCampus)">
						Confirmar
					</BaseButton>
				</div>
			</template>
		</BaseModal>
    </div>
</template>

<script>
    import { mapStores } from "pinia"
	import { useUserAuthInfoStore } from "@/stores/userAuthInfo"
	import { useOrganizationInfoStore } from "@/stores/organizationInfo"
    import refreshUserAuthToken from '@/assets/scripts/refreshUserAuthToken.js'

    import TextTitle1 from '@/components/text-components/TextTitle1.vue'
    import TextTitle2 from '@/components/text-components/TextTitle2.vue'
    import TextTitle5 from '@/components/text-components/TextTitle5.vue'
    import BaseUnorderedList from '@/components/BaseUnorderedList.vue'
	import BaseListItem from '@/components/BaseListItem.vue'
    import BaseButton from "@/components/BaseButton.vue"
    import ButtonGroup from "@/components/ButtonGroup.vue"
    import FloatingInput from '@/components/FloatingInput.vue'
    import BaseToastContainer from '@/components/BaseToastContainer.vue'
    import BaseToast from '@/components/BaseToast.vue'
    import BaseModal from '@/components/BaseModal.vue'
    import EmptyState from '@/components/EmptyState.vue'
    import BaseForm from '@/components/BaseForm.vue'
    import HorizontalLine from '@/components/HorizontalLine.vue'

    import * as bootstrap from 'bootstrap'
    import axios from 'axios'

    export default {
        data: function() {
            return {
                newCampus: {
                    name: ""
                },
                successToast: {
                    el: null,
                    msg: ""
                },
                errorToast: {
                    el: null,
                    msg: ""
                },
                selectedCampus: null
            }
        },
        mounted: function() {
            this.successToast.el = bootstrap.Toast.getOrCreateInstance("#sucess-toast");
            this.errorToast.el = bootstrap.Toast.getOrCreateInstance("#fail-toast");
            this.deleteCampusModal = bootstrap.Modal.getOrCreateInstance("#deleteCampus");
        },
        computed: {
            ...mapStores(useUserAuthInfoStore, useOrganizationInfoStore),
        },
        methods: {
            editCampus(campus) {
                axios.put(`api/academic-calendar/campus/${campus.id}/edit`, {
                    name: campus.name
                }, 
                {
                    headers: {
                        'Authorization': 'Bearer ' + this.userAuthInfoStore.token
                    }
                }).then( (_) => {
                    this.successToast.msg = "O campus foi atualizado com sucesso!"
                    this.successToast.el.show();

                }).catch( (error) => {
                    this.errorToast.msg = ""
                    if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.editCampus, [campus])
                        }
                        else if(error.request.status === 422 ){
                            if(Object.hasOwn(error.response.data, 'name')) {
                                error.response.data["name"].forEach( (msg) => {
									this.errorToast.msg += `${msg}\n`
								})
                                this.errorToast.el.show()
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
            openDeleteCampusModal(campus) {
                this.selectedCampus = campus
                this.deleteCampusModal.show()
            },
            deleteCampus(campus) {
                axios.delete(`api/academic-calendar/campus/${campus.id}/delete`, {
                    headers: {
                        'Authorization': 'Bearer ' + this.userAuthInfoStore.token
                    }
                }).then( (_) => {
                    this.organizationInfoStore.deleteCampus(campus.id)
                    this.successToast.msg = "O campus foi excluído com sucesso!"
                    this.successToast.el.show()
                    this.deleteCampusModal.hide()
                    this.selectedCampus = null;

                }).catch( (error) => {
                    if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.deleteCampus, [campus])
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
            createCampus() {
                if(this.newCampus.name.length === 0) {
                    this.errorToast.msg = "O nome do campus não pode ficar em branco."
                    this.errorToast.el.show()
                }
                else {
                    axios.post(`api/academic-calendar/campus/create`, {
                            name: this.newCampus.name
                        }, 
                        {
                            headers: {
                                'Authorization': 'Bearer ' + this.userAuthInfoStore.token
                        }
                    }).then( (res) => {
                        this.organizationInfoStore.addCampus(res.data)
                        this.successToast.msg = "O campus foi criado com sucesso!"
                        this.successToast.el.show();
                    }).catch( (error) => {
                        
                        if(error.response) {
                            if(error.request.status === 401) {
                                refreshUserAuthToken(this.createCampus, [campus])
                            }
                            else if(error.request.status === 422 ){
                                if(Object.hasOwn(error.response.data, 'name')) {
                                    this.errorToast.msg = ""
                                    error.response.data["name"].forEach( (msg) => {
                                        this.errorToast.msg += `${msg}\n`
                                    })
                                    this.errorToast.el.show()
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
                }
                
            },
        },
        components: {
            TextTitle1,
            TextTitle2,
            TextTitle5,
            BaseUnorderedList,
            BaseListItem,
            BaseButton,
            ButtonGroup,
            FloatingInput,
            BaseToastContainer,
            BaseToast,
            BaseModal,
            EmptyState,
            BaseForm,
            HorizontalLine
        }
    }
</script>