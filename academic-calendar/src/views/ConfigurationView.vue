<template>
    <div class="container-xxl bd-gutter mt-3 my-md-4 bd-layout">
        <SideBar :options="options"/>

        <div id="main-body" class="bd-main order-1">
            <div id="create-user">
                <TextTitle1>Criação de Usuários</TextTitle1>
            </div>
            <div id="campus-configurations">
                <TextTitle1>Campus</TextTitle1>
                <div id="create-campus">
                    <TextTitle2>Criação de Campus</TextTitle2>
                </div>
                <div id="list-campus">
                    <TextTitle2>Lista de Campi</TextTitle2>
                    <BaseUnorderedList>
                        <BaseListItem v-for="campus in organizationInfoStore.campi" :key="`campus-${campus.id}`">
                            <FloatingInput 
                                :id="`campus-${campus.id}`"
                                v-model="campus.name" 
                                label="Nome do campus"
                                type="text"
                                maxlength="500"
                            />
                            <template name:post-item-section>
                                <ButtonGroup>
                                    <BaseButton type="button" @click.native="editCampus(campus)">Alterar</BaseButton>
                                    <BaseButton type="button" @click.native="openDeleteCampusModal(campus)">Excluir</BaseButton>
                                </ButtonGroup>
                            </template>
                        </BaseListItem>
                    </BaseUnorderedList>
                </div>
            </div>
            <div id="import-national-holidays">
                <TextTitle1>Importar Feriados Nacionais</TextTitle1>
            </div>
            <div id="import-regional-holidays">
                <TextTitle1>Importar Feriados Regionais</TextTitle1>
            </div>
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
<style>
    #main-body {
        float: right;
    }
</style>
<script>
    import SideBar from '@/components/SideBar.vue';
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

    import * as bootstrap from 'bootstrap'
    import axios from 'axios'

    import { mapStores } from "pinia"
	import { useUserAuthInfoStore } from "@/stores/userAuthInfo"
	import { useOrganizationInfoStore } from "@/stores/organizationInfo"
    import refreshUserAuthToken from '@/assets/scripts/refreshUserAuthToken.js'

    export default {
        data: function() {
            return {
                options: [
                    {link: "#create-user", display: "Criar Usuários"},
                    {link: "#campus-configurations", display: "Campus", subMenu: [
                        {link: "#create-campus", display: "Criação de Campus"},
                        {link: "#list-campus", display: "Lista de Campi"}
                    ]},
                    {link: "#import-national-holidays", display: "Importar Feriados Nacionais"},
                    {link: "#import-regional-holidays", display: "Importar Feriados Regionais"},
                ],
                successToast: {
                    el: null,
                    msg: ""
                },
                errorToast: {
                    el: null,
                    msg: ""
                },
                selectedCampus: null,
                deleteCampusModal: null
            }
        },
        computed: {
            ...mapStores(useUserAuthInfoStore, useOrganizationInfoStore)
        },
        components: {
            SideBar,
            TextTitle1,
            TextTitle5,
            TextTitle2,
            BaseUnorderedList,
            BaseListItem,
            BaseButton,
            ButtonGroup,
            FloatingInput,
            BaseToastContainer,
            BaseToast,
            BaseModal
        },
        mounted: function() {
            if(!this.userAuthInfoStore.isAuthenticated) {
                this.$router.push({ name: 'login', params: { next: '/configuration' }});
            }
            else {
                this.successToast.el = bootstrap.Toast.getOrCreateInstance("#sucess-toast");
                this.errorToast.el = bootstrap.Toast.getOrCreateInstance("#fail-toast");
                this.deleteCampusModal = bootstrap.Modal.getOrCreateInstance("#deleteCampus");
            }
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
            }
        }
    }
</script>