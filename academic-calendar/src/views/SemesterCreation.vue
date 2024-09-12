<template>
    <div>
        <TextTitle1>Crie um semestre</TextTitle1>
        <BaseButton type="button" class="btn-close" aria-label="Close" @click.native="$router.back()" />

        <BaseForm @submit="createSemester" >
            <FloatingInput 
                ref="description"
                v-model="description"
                label="Nome para o semestre"
                type="text"
                maxlength="500"
                id="semester-description">
                <FormInputFeedback type="invalid">
                    {{ inputFeedbacks.description }}
                </FormInputFeedback>
            </FloatingInput>

            <FloatingInput 
                ref="startDate"
                v-model="startDate"
                label="Data de início"
                type="date"
                maxlength="500"
                id="semester-start-date">
                <FormInputFeedback type="invalid">
                    {{ inputFeedbacks.startDate }}
                </FormInputFeedback>
            </FloatingInput>

            <FloatingInput 
                ref="endDate"
                v-model="endDate"
                label="Data de fim"
                type="date"
                id="semester-end-date">
                <FormInputFeedback type="invalid">
                    {{ inputFeedbacks.endDate }}
                </FormInputFeedback>
            </FloatingInput>

            <BaseButton type="submit"> Criar </BaseButton>
        </BaseForm>

        <BaseToastContainer class="position-fixed bottom-0 end-0 p-3">
            <BaseToast 
                title="Sucesso" 
                :message="sucessToast.msg" 
                id="sucess-toast" 
                class="text-bg-success" />

            <BaseToast 
                title="Erro" 
                :message="errorToast.msg" 
                id="fail-toast" 
                class="text-bg-danger" />    

        </BaseToastContainer>
    </div>
</template>
<script>
    import { mapStores } from "pinia"
    import { useUserAuthInfoStore } from "@/stores/userAuthInfo"
    import refreshUserAuthToken from '@/assets/scripts/refreshUserAuthToken.js'

    import axios from "axios"
	import * as bootstrap from 'bootstrap'

    import BaseButton from "@/components/BaseButton.vue"
    import BaseForm from '@/components/BaseForm.vue'
    import FloatingInput from '@/components/FloatingInput.vue'
    import FormInputFeedback from '@/components/FormInputFeedback.vue'
    import TextTitle1 from '@/components/text-components/TextTitle1.vue'
    import BaseToastContainer from '@/components/BaseToastContainer.vue'
    import BaseToast from '@/components/BaseToast.vue'
    import IconCloseButton from "@/components/icons/IconCloseButton.vue"

    export default {
        data() {
            return {
                description: "",
                startDate: "",
                endDate: "",
                sucessToast: {
					el: null,
					msg: ""
				},
				errorToast: {
					el: null,
					msg: ""
				},
                globalSucessToast: {
                    el: null
                },
                inputFeedbacks: {
                    description: "",
                    startDate: "",
                    endDate: ""
                }
            }
        },
        methods: {
            createSemester() {
                var payload = {
                    "description": this.description,
                    "start_date": this.startDate,
                    "end_date": this.endDate,
                    "academic_calendar": this.$route.params.calendar_id
                }

                axios.post('/api/academic-calendar/semester/create', payload, {
                    headers: {
						Authorization: `Bearer ${this.userAuthInfoStore.token}`,
					},
                }).then((_) => {
                    this.sucessToast.msg = "Semestre criado com sucesso."
                    this.globalSucessToast.el.show()

                    this.$router.push({ name: 'calendar-view', params: {'id': this.$route.params.calendar_id } })
                }).catch((error) => {
                    if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.createSemester)
                        }
                        else if(error.request.status === 422) {
                            this.inputFeedbacks.description = ""
                            this.inputFeedbacks.startDate = ""
                            this.inputFeedbacks.endDate = ""
                            
                            this.$refs.description.resetValidation()
                            this.$refs.startDate.resetValidation()
                            this.$refs.endDate.resetValidation()

                            if(Object.hasOwn(error.response.data, 'non_field_errors')) {
                                this.errorToast.msg = "";

                                error.response.data["non_field_errors"].forEach( (msg) => {
									this.errorToast.msg += `${msg}\n`
								})
                                
                                this.errorToast.el.show()
                            }

                            if(Object.hasOwn(error.response.data, 'description')) {

                                error.response.data["description"].forEach( (msg) => {
									this.inputFeedbacks.description += `${msg}\n`
								})
                                
                                this.$refs.description.validate('invalid')
                            }

                            if(Object.hasOwn(error.response.data, 'start_date')) {

                                error.response.data["start_date"].forEach( (msg) => {
									this.inputFeedbacks.startDate += `${msg}\n`
								})
                                
                                this.$refs.startDate.validate('invalid')
                            }

                            if(Object.hasOwn(error.response.data, 'end_date')) {

                                error.response.data["end_date"].forEach( (msg) => {
									this.inputFeedbacks.endDate += `${msg}\n`
								})
                                
                                this.$refs.endDate.validate('invalid')
                            }
                        }
                        else if(error.request.status === 404) {
                            this.$router.push({name: "not-found"})
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
        },
        components: {
            BaseButton,
            BaseForm,
            FloatingInput,
            FormInputFeedback,
            TextTitle1,
            BaseToastContainer,
            BaseToast,
            IconCloseButton
        },
        computed: {
            ...mapStores(useUserAuthInfoStore)
        },
        mounted() {
            this.sucessToast.el = bootstrap.Toast.getOrCreateInstance("#sucess-toast");
			this.errorToast.el = bootstrap.Toast.getOrCreateInstance("#fail-toast");
            this.globalSucessToast.el = bootstrap.Toast.getOrCreateInstance("#global-sucess-toast");
        }
    }

</script>