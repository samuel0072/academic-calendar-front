<template>
    <div>
        <div class="row">
            <div class="col">
                <TextTitle1>Crie um semestre</TextTitle1>
            </div>
            <div class="col d-flex justify-content-end">
                <BaseButton type="button" class="btn-close" aria-label="Close" @click.native="$router.back()" />
            </div>
        </div>
        

        <BaseForm @submit="createSemester" >
            <FloatingInput 
                ref="description"
                v-model="description"
                label="Nome para o semestre"
                type="text"
                maxlength="500"
                required
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
                required
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
                required
                id="semester-end-date">
                <FormInputFeedback type="invalid">
                    {{ inputFeedbacks.endDate }}
                </FormInputFeedback>
            </FloatingInput>

            <FloatingInput 
                ref="lessonsStartDate"
                v-model="lessonsStartDate"
                label="Data que as aulas começam"
                type="date"
                required
                id="semester-lessons-start-date">
                <FormInputFeedback type="invalid">
                    {{ inputFeedbacks.lessonsStartDate }}
                </FormInputFeedback>
            </FloatingInput>

            <FloatingInput 
                ref="lessonsEndDate"
                v-model="lessonsEndDate"
                label="Data que as aulas terminam"
                type="date"
                required
                id="semester-lessons-end-date">
                <FormInputFeedback type="invalid">
                    {{ inputFeedbacks.lessonsEndDate }}
                </FormInputFeedback>
            </FloatingInput>

            <BaseButton type="submit" class="btn-outline-primary"> <i class="bi bi-plus-lg"></i> Criar </BaseButton>
        </BaseForm>

        <BaseToastContainer class="position-fixed bottom-0 end-0 p-3">

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
                lessonsStartDate: "",
                lessonsEndDate: "",
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
                    endDate: "",
                    lessonsStartDate: "",
                    lessonsEndDate: ""
                }
            }
        },
        methods: {
            createSemester() {
                var payload = {
                    "description": this.description,
                    "start_date": this.startDate,
                    "end_date": this.endDate,
                    "lessons_start_date": this.lessonsStartDate,
                    "lessons_end_date": this.lessonsEndDate,
                    "academic_calendar": this.$route.params.calendar_id
                }

                axios.post('/api/academic-calendar/semester/create', payload, {
                    headers: {
						Authorization: `Bearer ${this.userAuthInfoStore.token}`,
					},
                }).then((_) => {
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
                            this.inputFeedbacks.lessonsEndDate = ""
                            this.inputFeedbacks.lessonsStartDate = ""
                            
                            this.$refs.description.resetValidation()
                            this.$refs.startDate.resetValidation()
                            this.$refs.endDate.resetValidation()
                            this.$refs.lessonsStartDate.resetValidation()
                            this.$refs.lessonsEndDate.resetValidation()

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

                            if(Object.hasOwn(error.response.data, 'lessons_start_date')) {

                                error.response.data["lessons_start_date"].forEach( (msg) => {
                                    this.inputFeedbacks.lessonsStartDate += `${msg}\n`
                                })

                                this.$refs.lessonsStartDate.validate('invalid')
                            }

                            if(Object.hasOwn(error.response.data, 'lessons_end_date')) {

                                error.response.data["lessons_end_date"].forEach( (msg) => {
                                    this.inputFeedbacks.lessonsEndDate += `${msg}\n`
                                })

                                this.$refs.lessonsEndDate.validate('invalid')
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
			this.errorToast.el = bootstrap.Toast.getOrCreateInstance("#fail-toast");
            this.globalSucessToast.el = bootstrap.Toast.getOrCreateInstance("#global-sucess-toast");
        }
    }

</script>