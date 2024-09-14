<template>
    <div class="container-xxl bd-gutter mt-3 my-md-4 bd-layout">
        <SideBar :options="options"/>

        <PageSection id="main-body" class="bd-main order-1">
            <PageSection id="create-user">
                <TextTitle1>Criação de Usuários</TextTitle1>
            </PageSection>
            <PageSection id="campus-configurations">
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
                        />
                        <BaseButton type="submit">Criar</BaseButton>
				    </BaseForm>
                </div>
                <div id="list-campus">
                    <TextTitle2>Lista de Campi</TextTitle2>
                    <BaseUnorderedList v-if="organizationInfoStore.campi.length > 0">
                        <BaseListItem v-for="campus in organizationInfoStore.campi" :key="`campus-${campus.id}`">
                            <FloatingInput 
                                :id="`campus-${campus.id}`"
                                v-model="campus.name" 
                                label="Nome do campus"
                                type="text"
                                maxlength="150"
                            />
                            <template name:post-item-section>
                                <ButtonGroup>
                                    <BaseButton type="button" @click.native="editCampus(campus)">Alterar</BaseButton>
                                    <BaseButton type="button" @click.native="openDeleteCampusModal(campus)">Excluir</BaseButton>
                                </ButtonGroup>
                            </template>
                        </BaseListItem>
                    </BaseUnorderedList>

                    <EmptyState v-else
                        msg="Não há campus para exibir"/>
                </div>
            </PageSection>
            <PageSection id="import-holidays">
                <TextTitle1>Importar Feriados</TextTitle1>
                <PageSection>
                    <PageSection>
                        <p>
                            <SimpleText>É possível importar vários feriados de uma única vez através de um arquivo Excel(.xlsx)</SimpleText>
                        </p>
                        <p>
                            <SimpleText>Baixe aqui um exemplo de uma planilha: </SimpleText>
                            <BaseAnchor href="/public/feriados_planilha_exemplo.xlsx" download>Clique aqui para baixar</BaseAnchor>
                        </p>
                        <p>
                            <SimpleText>Explicação de cada coluna da planilha e exemplos: </SimpleText>
                            <router-link :to="{ name: 'holiday-file-explanation'}">Clique aqui acessar</router-link>
                        </p>
                    </PageSection>
				
                    <BaseForm @submit="importHolidays" id="holiday-import-form" novalidate>
                        <div class="mb-3">
                            <BaseLabel for="holiday-type"> Escolha o tipo de feriado: </BaseLabel>
                            <BaseSelectInput 
                                id="holiday-type" 
                                :options="holidayTypes" 
                                v-model="holidayImportingInfo.holidayType"
                            />
                        </div>
                        <div v-if="holidayImportingInfo.holidayType != 'H'">
                            <BaseLabel for="selected-event-campi"> Esses eventos são válidos para os campi: </BaseLabel>
                            <MultipleSelectInput 
                                id="selected-event-campi" 
                                :options="campiOptions" 
                                v-model="holidayImportingInfo.campi"
                            />
                        </div>
                        <div class="mb-3">
                            <BaseLabel for="holiday-importing-file">Selecione um arquivo Excel</BaseLabel>
                            <BaseInput 
                                @change.native="handleHolidayFileChange"
                                id="holiday-importing-file"
                                type="file"
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                required
                            >
                            </BaseInput>
                        </div>
                        <BaseButton type="submit">Importar feriados</BaseButton>
                    </BaseForm>
                    <BaseCallout v-if="holidayImportingInfo.isErrored" class="callout-danger">
                            <TextTitle3>Atenção aos erros abaixo:</TextTitle3>
                            <SimpleText v-for="message in holidayImportingInfo.errorMsgs" :key="`holiday-error-msg-${message}`">
                                {{ message }}
                            </SimpleText>
                    </BaseCallout>
                </PageSection>
            </PageSection>
        </PageSection>

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
    import TextTitle3 from '@/components/text-components/TextTitle3.vue'
	import TextTitle5 from '@/components/text-components/TextTitle5.vue'
    import SimpleText from '@/components/text-components/SimpleText.vue'
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
    import BaseInput from '@/components/BaseInput.vue'
	import BaseAnchor from "@/components/BaseAnchor.vue"
	import BaseCallout from "@/components/BaseCallout.vue"
    import BaseSelectInput from '@/components/BaseSelectInput.vue'
    import BaseLabel from '@/components/BaseLabel.vue'
    import PageSection from '@/components/PageSection.vue'
    import MultipleSelectInput from '@/components/MultipleSelectInput.vue'

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
                    {link: "#import-holidays", display: "Importar Feriados"}
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
                deleteCampusModal: null,
                newCampus: {
                    name: ""
                },
                holidayTypes: [
                    { label: "Regional", value: "RH"},
                    { label: "Nacional", value: "H"},
                ],
                holidayImportingInfo: {
                    holidayType: "H",
                    file: null,
                    isErrored: false,
                    errorMsgs: [],
                    campi: []
                }
            }
        },
        computed: {
            ...mapStores(useUserAuthInfoStore, useOrganizationInfoStore),
            holidayImportingRoute() {
                if(this.holidayImportingInfo.holidayType === "H") {
                    return 'import_national_holidays'
                }
                else {
                    return 'import_regional_holidays'
                }
            },
            campiOptions() {
                var campi = []
                this.organizationInfoStore.campi.forEach( (campus) => {
					campi.push({
						value: campus.id,
						label: campus.name
					})
				})
                return campi;
            }
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
            BaseModal,
            EmptyState,
            BaseForm,
            BaseInput,
            BaseAnchor,
            BaseCallout,
            BaseSelectInput,
            BaseLabel,
            TextTitle3,
            SimpleText,
            PageSection,
            MultipleSelectInput
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
                            refreshUserAuthToken(this.editCampus, [campus])
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
            },
            handleHolidayFileChange(event) {
				this.holidayImportingInfo.file = event.target.files[0];
			},
            importHolidays() {
				if (!this.holidayImportingInfo.file) {
					this.errorToast.msg = "É necessário escolher um arquivo."
					this.errorToast.el.show()	
				} else if((this.holidayImportingInfo.holidayType === 'RH') && (this.holidayImportingInfo.campi.length == 0)){
					this.errorToast.msg = "É necessário escolher um campus."
					this.errorToast.el.show()
				}
                else {
                    this.holidayImportingInfo.isErrored = false

					const formData = new FormData();
					formData.append('file', this.holidayImportingInfo.file);

                    if(this.holidayImportingInfo.holidayType === 'RH') {
                        formData.append('campi', JSON.stringify(this.holidayImportingInfo.campi));
                    }
					
					axios.post(`/api/academic-calendar/${this.holidayImportingRoute}`, formData, 
					{
						headers: {
							Authorization: "Bearer " + this.userAuthInfoStore.token
						}
					}
                    ).then((_) => {
                        this.successToast.msg = "Feriados importados com sucesso!"

                        this.successToast.el.show()

                    }).catch((error) => {
                        if(error.response) {
                            if(error.request.status === 401) {
                                refreshUserAuthToken(this.importHolidays)
                                //TODO Exibir um toast quando o usuário for redirecionado pro login
                            }
                            else if(error.request.status === 422 ){
                                this.holidayImportingInfo.isErrored = true
                                this.holidayImportingInfo.errorMsgs = error.response.data.errors
                            }
                            else if(error.request.status === 400 ){
                                this.errorToast.msg = "Verifique se você selecionou um arquivo no formato Excel(.xlsx)."
                                this.errorToast.el.show()
                            }
                            else if(error.request.status === 404 ){
                                this.$router.push({ name: 'not-found' })
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
                }
			}
        }
    }
</script>