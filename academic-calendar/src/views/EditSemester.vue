<template>
    <div>
        <TextTitle1>Edite o semestre {{ semester.description  }}</TextTitle1>
        <BaseButton type="button" class="btn-close" aria-label="Close" @click.native="$router.back()">
            <IconCloseButton />
        </BaseButton>

        <BaseForm @submit="updateSemester" >
            <FloatingInput 
                ref="description"
                v-model="semester.description"
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
                v-model="semester.start_date"
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
                v-model="semester.end_date"
                label="Data de fim"
                type="date"
                id="semester-end-date">
                <FormInputFeedback type="invalid">
                    {{ inputFeedbacks.endDate }}
                </FormInputFeedback>
            </FloatingInput>

            <BaseButton type="submit"> Editar </BaseButton>
        </BaseForm>

        <BaseButton data-bs-toggle="modal" data-bs-target="#deleteSemester" type="button">
            Excluir
        </BaseButton>

        <BaseModal modal_id="deleteSemester">
			<template v-slot:modal-title>
				<TextTitle5>
					Confirmação de exclusão
				</TextTitle5>
			</template>

			<template v-slot:modal-body>
				Tem certeza que deseja excluir esse semestre?
                <br/>
                Essa ação não é reversível.
			</template>

			<template v-slot:modal-footer>
				<div>
					<BaseButton type="button"  class="btn btn-primary" @click.native="deleteSemester">
						Confirmar
					</BaseButton>
				</div>
			</template>
		</BaseModal>

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
    import TextTitle5 from '@/components/text-components/TextTitle5.vue'
    import BaseToastContainer from '@/components/BaseToastContainer.vue'
    import BaseToast from '@/components/BaseToast.vue'
    import IconCloseButton from "@/components/icons/IconCloseButton.vue"
    import BaseModal from '@/components/BaseModal.vue'

    export default {
        data() {
            return {
                sucessToast: {
					el: null,
					msg: ""
				},
				errorToast: {
					el: null,
					msg: ""
				},
                inputFeedbacks: {
                    description: "",
                    startDate: "",
                    endDate: ""
                },
                semester: {
                    description: "",
                    start_date: "",
                    end_date: ""
                },
                globalSucessToast: {
                    el: null
                },
                deleteModal: null
            }
        },
        methods: {
            updateSemester() {
                axios.put(`/api/academic-calendar/semester/${this.$route.params.id}/edit`, this.semester, {
                    headers: {
						Authorization: `Bearer ${this.userAuthInfoStore.token}`,
					},
                }).then((res) => {
                    this.sucessToast.msg = "Semestre editado com sucesso."
                    this.sucessToast.el.show()

                    //this.$router.push({ name: 'calendar-view', params: {'id': this.$route.params.calendar_id } })
                }).catch((error) => {
                    if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.updateSemester)
                        }
                        else if(error.request.status === 422) {
                            console.log(error)
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
            },
            getSemester() {
                axios.get(`/api/academic-calendar/semester/${this.$route.params.id}`, {
                    headers: {
						Authorization: `Bearer ${this.userAuthInfoStore.token}`,
					}
                }).then((res) => {
                    this.semester = res.data
                }).catch((error) => {
                     if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.getSemester)
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
            },
            deleteSemester() {
                axios.delete(`/api/academic-calendar/semester/${this.$route.params.id}/delete`, {
                    headers: {
						Authorization: `Bearer ${this.userAuthInfoStore.token}`,
					}
                }).then((_) => {
                    this.deleteModal.hide();
                    this.globalSucessToast.el.show();
                    this.$router.go(-1)
                }).catch((error) => {
                    if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.deleteSemester)
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
            IconCloseButton,
            BaseModal,
            TextTitle5
        },
        computed: {
            ...mapStores(useUserAuthInfoStore)
        },
        mounted() {
            this.deleteModal = bootstrap.Modal.getOrCreateInstance("#deleteSemester");
            this.sucessToast.el = bootstrap.Toast.getOrCreateInstance("#sucess-toast");
            this.globalSucessToast.el = bootstrap.Toast.getOrCreateInstance("#global-sucess-toast");
			this.errorToast.el = bootstrap.Toast.getOrCreateInstance("#fail-toast");
            this.getSemester();
        }
    }

</script>