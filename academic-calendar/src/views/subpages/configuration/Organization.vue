<template>
    <div>
        <TextTitle1>Organização</TextTitle1>
        <TextTitle3> {{ organizationInfoStore.name }} </TextTitle3>
        
        <BaseForm @submit="updateData">
            <TextTitle5>Edição de cálculo de tempo</TextTitle5>
            <div class="mb-3">
                <FloatingInput 
                label="Tempo mínimo válido para um dia"
                type="text"
                maxlength="6"
                required="true"
                id="min-minutes-per-day"
                title="Digite o número de horas no formato HHH:MM"
                pattern="^\d{1,3}(:[0-5][0-9]$)"
                v-model="organization.minMinutesPerDayDisplay"
                ></FloatingInput>
            </div>
            <div class="mb-3">
                <FloatingInput 
                label="Tempo por aula"
                type="text"
                maxlength="6"
                required="true"
                id="minutes-per-lesson"
                title="Digite o número no formato HHH:MM"
                pattern="^\d{1,3}(:[0-5][0-9]$)"
                v-model="organization.minutesPerLessonDisplay"
                ></FloatingInput>
            </div>
            

            <BaseButton type="submit" class="btn-outline-primary">Atualizar</BaseButton>
        </BaseForm>

        <BaseToastContainer class="position-fixed bottom-0 end-0 p-3">
            <BaseToast 
                title="Sucesso" 
                :message="successToast.msg" 
                id="org-config-sucess-toast" 
                class="text-bg-success" />

            <BaseToast 
                title="Erro" 
                :message="errorToast.msg" 
                id="org-config-fail-toast" 
                class="text-bg-danger" />    

        </BaseToastContainer>
    </div>
</template>

<script>
    import TextTitle1 from '@/components/text-components/TextTitle1.vue'
    import TextTitle3 from '@/components/text-components/TextTitle3.vue'
    import TextTitle5 from '@/components/text-components/TextTitle5.vue'
    import SimpleText from '@/components/text-components/SimpleText.vue'
    import BaseButton from "@/components/BaseButton.vue"
    import BaseForm from '@/components/BaseForm.vue'
    import BaseToastContainer from '@/components/BaseToastContainer.vue'
    import BaseToast from '@/components/BaseToast.vue'
    import FormInputFeedback from '@/components/FormInputFeedback.vue'
    import FloatingInput from '@/components/FloatingInput.vue'

    import * as bootstrap from 'bootstrap'

    import { mapStores } from "pinia"
	import { useUserAuthInfoStore } from "@/stores/userAuthInfo"
	import { useOrganizationInfoStore } from "@/stores/organizationInfo"
    import refreshUserAuthToken from '@/assets/scripts/refreshUserAuthToken.js'

    import Organization from '@/models/organization.js'
    import OrganizationService from '@/services/organization.js'

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
                organization: Organization,
                orgService: OrganizationService
            }
        },
        computed: {
            ...mapStores(useUserAuthInfoStore, useOrganizationInfoStore),
        },
        components: {
            TextTitle1,
            BaseButton,
            BaseForm,
            TextTitle3,
            SimpleText,
            BaseToastContainer,
            BaseToast,
            FormInputFeedback,
            FloatingInput,
            TextTitle5
        },
        mounted: function() {
            this.successToast.el = bootstrap.Toast.getOrCreateInstance("#org-config-sucess-toast");
            this.errorToast.el = bootstrap.Toast.getOrCreateInstance("#org-config-fail-toast");

            this.orgService = new OrganizationService();
            this.orgService.getOrgInfo().then( (org) => { this.organization = org} )
        },
        methods: {
            async updateData() {
                this.organization.minutesPerLesson = this.transformHourToMinutes(this.organization.minutesPerLessonDisplay)
                this.organization.minMinutesPerDay = this.transformHourToMinutes(this.organization.minMinutesPerDayDisplay)

                try {
                    await this.orgService.updateMinInfo(this.organization)
                    this.successToast.msg = "Métricas atualizadas com sucesso."
                    this.successToast.el.show()
                }
                catch(error) {
                    if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.updateData)
                            
                        }
                        else if(error.request.status === 422 ){
                            this.errorToast.msg = "Não foi possível atualizar os dados. Recarregue a página e tente novamente."
                            this.errorToast.el.show()
                        }
                        else if(error.request.status === 400 ){
                            this.errorToast.msg = "Não foi possível atualizar os dados. Recarregue a página e tente novamente."
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
                }
            },
            transformHourToMinutes(hour) {
                hour = hour.split(':')
                const minutesInHour = 60

                return Number(hour[0]) * minutesInHour + Number(hour[1]); 
            }
        }
    }
</script>