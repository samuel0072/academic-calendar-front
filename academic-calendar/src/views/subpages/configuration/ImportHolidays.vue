<template>
    <div>
        <TextTitle1>Importar Feriados</TextTitle1>
        <div>
            <div>
                <p>
                    <SimpleText>É possível importar vários feriados de uma única vez através de um arquivo Excel(.xlsx)</SimpleText>
                </p>
                <p>
                    <SimpleText>Baixe aqui um exemplo de uma planilha: </SimpleText>
                    <BaseAnchor href="/feriados_planilha_exemplo.xlsx" download>Clique aqui para baixar</BaseAnchor>
                </p>
                <p>
                    <SimpleText>Explicação de cada coluna da planilha e exemplos: </SimpleText>
                    <router-link :to="{ name: 'holiday-file-explanation'}">Clique aqui acessar</router-link>
                </p>
            </div>
        
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
                <BaseButton type="submit" class="btn-outline-primary"> <i class="bi bi-box-arrow-up"></i>  Importar feriados</BaseButton>
            </BaseForm>
            <BaseCallout v-if="holidayImportingInfo.isErrored" class="callout-danger">
                    <TextTitle3>Atenção aos erros abaixo:</TextTitle3>
                    <SimpleText v-for="message in holidayImportingInfo.errorMsgs" :key="`holiday-error-msg-${message}`">
                        {{ message }}
                    </SimpleText>
            </BaseCallout>
        </div>

        <BaseToastContainer class="position-fixed bottom-0 end-0 p-3">
            <BaseToast 
                title="Sucesso" 
                :message="successToast.msg" 
                id="importing-holiday-sucess-toast" 
                class="text-bg-success" />

            <BaseToast 
                title="Erro" 
                :message="errorToast.msg" 
                id="importing-holiday-fail-toast" 
                class="text-bg-danger" />    

        </BaseToastContainer>
    </div>
</template>

<script>
    import TextTitle1 from '@/components/text-components/TextTitle1.vue'
    import TextTitle3 from '@/components/text-components/TextTitle3.vue'
    import SimpleText from '@/components/text-components/SimpleText.vue'
    import BaseButton from "@/components/BaseButton.vue"
    import BaseForm from '@/components/BaseForm.vue'
    import BaseInput from '@/components/BaseInput.vue'
	import BaseAnchor from "@/components/BaseAnchor.vue"
	import BaseCallout from "@/components/BaseCallout.vue"
    import BaseSelectInput from '@/components/BaseSelectInput.vue'
    import BaseLabel from '@/components/BaseLabel.vue'
    import MultipleSelectInput from '@/components/MultipleSelectInput.vue'
    import BaseToastContainer from '@/components/BaseToastContainer.vue'
    import BaseToast from '@/components/BaseToast.vue'

    import * as bootstrap from 'bootstrap'
    import axios from 'axios'

    import { mapStores } from "pinia"
	import { useUserAuthInfoStore } from "@/stores/userAuthInfo"
	import { useOrganizationInfoStore } from "@/stores/organizationInfo"
    import refreshUserAuthToken from '@/assets/scripts/refreshUserAuthToken.js'

    export default {
        data: function() {
            return {
                successToast: {
                    el: null,
                    msg: ""
                },
                errorToast: {
                    el: null,
                    msg: ""
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
            TextTitle1,
            BaseButton,
            BaseForm,
            BaseInput,
            BaseAnchor,
            BaseCallout,
            BaseSelectInput,
            BaseLabel,
            TextTitle3,
            SimpleText,
            MultipleSelectInput,
            BaseToastContainer,
            BaseToast
        },
        mounted: function() {
            this.successToast.el = bootstrap.Toast.getOrCreateInstance("#importing-holiday-sucess-toast");
            this.errorToast.el = bootstrap.Toast.getOrCreateInstance("#importing-holiday-fail-toast");
        },
        methods: {
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