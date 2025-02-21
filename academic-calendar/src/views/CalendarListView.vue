<template>
    <div>
        <BaseModal :id="calendarCreationModalId">
            <template v-slot:modal-title>
            <!-- TODO: criar componente title -->
                <h5>Crie um novo calendário acadêmico</h5>
            </template>

            <template v-slot:modal-body>
                <div>
                    <!-- TODO: usar componente form -->
                    <form id="calendar_creation_form" @submit.prevent="createCalendar" class="needs-validation">
                        <!-- TODO: usar componente FloatingInput -->
                        <div class="form-floating mb-3">
                            <BaseInput 
                                v-model="calendarFormValues.description" 
                                type="text" 
                                class="form-control" 
                                :id="calendarFormIds.descriptionInput" 
                                required 
                                placeholder="" 
                                maxlength="500"/>
                            <label for="calendar_description_input">Nome do calendário</label>
                            <!-- TODO: criar componente InputFeedback -->
                            <div class="invalid-feedback">
                                Esse nome não é válido. Tente informar um nome com até 500 caracteres.
                            </div>
                        </div>
                        <div class="form-floating mb-3">
                            <BaseInput 
                                v-model="calendarFormValues.start_date" 
                                type="date" 
                                class="form-control" 
                                :id="calendarFormIds.startDateInput" 
                                required />
                            <label for="calendar_start_date_input">Data de ínicio do calendário</label>
                            <div class="invalid-feedback">
                                Essa data não é válida. Verifique se é menor que a data de fim.
                            </div>
                        </div>
                        <div class="form-floating mb-3">
                            <BaseInput 
                                v-model="calendarFormValues.end_date" 
                                type="date" 
                                class="form-control" 
                                :id="calendarFormIds.endDateInput" 
                                required />
                            <label for="calendar_end_date_input">Data final do calendário</label>
                            <div class="invalid-feedback">
                                Essa data não é válida. Verifique se é maior que a data de ínicio.
                            </div>
                        </div>
                    </form>
                </div>
            </template>

            <template v-slot:modal-footer>
                <div>
                    <BaseButton type="submit" form="calendar_creation_form"  class="btn btn-primary">
                        <i class="bi bi-plus-lg"></i> Criar
                    </BaseButton>
                </div>
            </template>
        </BaseModal>

        <BaseToastContainer class="position-fixed bottom-0 end-0 p-3">
            <BaseToast 
                :title="sucessToastTitle" 
                :message="sucessToastMsg" 
                id="sucess-toast" 
                class="text-bg-success" />

            <BaseToast 
                :title="errorToastTitle" 
                :message="errorToastMsg" 
                id="fail-toast" 
                class="text-bg-danger" />    

        </BaseToastContainer>

        <div v-if="loading">
        <!-- TODO: criar um componente próprio -->
            Obtendo os caléndários...
        </div>
        <div v-else>
            <ToolBar>
                <ToolBarItem>
                    <BaseButton type="button" data-bs-toggle="modal" :data-bs-target="'#' + calendarCreationModalId">
                        <i class="bi bi-plus-lg"></i> Crie um calendário
                    </BaseButton> 
                </ToolBarItem>
                <ToolBarItem class="col-10">
                    <SearchInput id="searchInput" @search-triggered="getCalendars($event)"/>
                </ToolBarItem>
                
            </ToolBar>
            <div v-if="calendars.length === 0">
                <EmptyState 
                    msg="Não há calendários para exibir" 
                    :displayButton="false" 
                />
            </div>
            <div v-else>
                <!-- TODO: aplicar componente basebutton -->
                              
                <BaseUnorderedList>
                    <BaseListItem v-for="calendar in calendars" :key="calendar.id">
                        <TextTitle5>
                            <BaseAnchor :href="$router.resolve({ name: 'calendar-view', params: {id: calendar.id}}).href">
                                {{ calendar.description }}
                            </BaseAnchor>
                        </TextTitle5>
                        <SimpleText>
                            Com início em {{ calendar.start_date.toLocaleDateString() }} e fim em {{ calendar.end_date.toLocaleDateString() }}
                        </SimpleText>
                    </BaseListItem>
                </BaseUnorderedList>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapStores } from 'pinia'
    import { useUserAuthInfoStore } from '@/stores/userAuthInfo'
    import EmptyState from '@/components/EmptyState.vue'
    import refreshUserAuthToken from '@/assets/scripts/refreshUserAuthToken.js'
    import BaseModal from '@/components/BaseModal.vue'
    import BaseButton from '@/components/BaseButton.vue'
    import BaseToastContainer from '@/components/BaseToastContainer.vue'
    import BaseToast from '@/components/BaseToast.vue'
    import BaseInput from '@/components/BaseInput.vue'
    import SearchInput from '@/components/SearchInput.vue'
    import * as bootstrap from 'bootstrap';
    import BaseUnorderedList from '@/components/BaseUnorderedList.vue'
    import BaseListItem from '@/components/BaseListItem.vue'
    import SimpleText from '@/components/text-components/SimpleText.vue'
    import TextTitle5 from '@/components/text-components/TextTitle5.vue'
    import BaseAnchor from '@/components/BaseAnchor.vue'
    import ToolBar from '@/components/ToolBar.vue'
    import ToolBarItem from '@/components/ToolBarItem.vue'
    //
    //Não foi possível criar esse calendário. Tente novamente.

    export default {
        data: function() {
            return {
                calendars: [],
                loading: true,
                calendarFormValues: {
                    description: "",
                    start_date: "",
                    end_date: ""
                },
                calendarFormIds: {
                    descriptionInput: 'calendar_description_input',
                    startDateInput: 'calendar_start_date_input',
                    endDateInput: 'calendar_end_date_input'
                },
                calendarCreationModalId: 'calendarCreationModal',
                sucessToastTitle: 'Sucesso',
                sucessToastMsg: '',
                errorToastTitle: 'Erro',
                errorToastMsg: '',
                inputValue: 'Teste',
                creationModal: null
            }
        },
        methods: {
            getCalendars(searchValue=null) {
                axios.get('api/academic-calendar/search_calendar', {
                    headers: {
                        'Authorization': 'Bearer ' + this.userAuthInfoStore.token
                    },
                    params: {
                        description: searchValue
                    }
                }).then( (response) => {
                    this.loading = false

                    this.calendars = []

                    response.data.forEach( (calendar) => {
                        calendar.start_date = new Date(`${calendar.start_date}T00:00:00` )
                        calendar.end_date = new Date(`${calendar.end_date}T00:00:00` )
                        this.calendars.push(calendar)
                    })

                }).catch( (error) => {
                    if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.getCalendars, [searchValue])
                        }
                        else if(error.request.status === 500){
                            this.errorToastMsg = "Não foi possível se conectar com o servidor."
                            toast.show()
                        }
                    }
                    else if(error.request) {
                        if(error.code === "ERR_NETWORK") {
                            this.errorToastMsg = "Esse cliente não consegue se conectar com a internet."
                            toast.show()
                        }
                    }
                    else {
                        console.log(error)
                        this.errorToastMsg = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
                        toast.show()
                    }
                })
                .finally( () => {
                    this.loading = false
                })
            },
            createCalendar() {
                
                var calendarCreationModal = bootstrap.Modal.getOrCreateInstance(`#${this.calendarCreationModalId}`);

                var descriptionInput = document.getElementById(this.calendarFormIds.descriptionInput);
                var startDateInput = document.getElementById(this.calendarFormIds.startDateInput);
                var endDateInput = document.getElementById(this.calendarFormIds.endDateInput);

                descriptionInput.classList.remove('is-invalid');
                startDateInput.classList.remove('is-invalid');
                endDateInput.classList.remove('is-invalid');

                axios.post('api/academic-calendar/calendar/create', this.calendarFormValues, {
                    headers: {
                        'Authorization': 'Bearer ' + this.userAuthInfoStore.token
                    }
                }).then( (response) => {
                    response.data.start_date = new Date(response.data.start_date )
                    response.data.end_date = new Date(response.data.end_date )
                    this.calendars.push(response.data)

                    var toast = bootstrap.Toast.getOrCreateInstance("#sucess-toast");
                    this.sucessToastMsg = "O calendário foi criado com sucesso!"

                    toast.show();
                    calendarCreationModal.hide();

                    this.$router.push({ name: 'calendar-view', params: { id: response.data.id} })

                }).catch( (error) => {
                    var toast = bootstrap.Toast.getOrCreateInstance("#fail-toast");
                    if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.createCalendar)
                        }
                        else if(error.request.status === 422 ){
                            if(Object.hasOwn(error.response.data, 'description')) {
                                descriptionInput.classList.add('is-invalid');
                            }
                            if(Object.hasOwn(error.response.data, 'start_date')) {
                                startDateInput.classList.add('is-invalid');
                            }
                            if(Object.hasOwn(error.response.data, 'end_date')) {
                                endDateInput.classList.add('is-invalid');
                            }
                        }
                        else if(error.request.status === 500){
                            this.errorToastMsg = "Não foi possível se conectar com o servidor."
                            toast.show()
                        }
                    }
                    else if(error.request) {
                        if(error.code === "ERR_NETWORK") {
                            this.errorToastMsg = "Esse cliente não consegue se conectar com a internet."
                            toast.show()
                        }
                    }
                    else {
                        console.log(error)
                        this.errorToastMsg = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
                        toast.show()
                    }
                    
                })
                .finally( () => {
                    this.loading = false
                })
            },
            viewCalendar(id) {
                this.$router.push({ name: 'calendar-view', params: { 'id': id} })
            },
            deleteCalendar(id) {
                //falta implementar esse método na API
                var toast = bootstrap.Toast.getOrCreateInstance("#fail-toast");
                this.errorToastMsg = "Não foi possível excluir esse calendário. Tente novamente."
                toast.show();
            }
        },
        mounted: function() {
            this.getCalendars()
            this.creationModal = bootstrap.Modal.getOrCreateInstance(`#${this.calendarCreationModalId}`)
        },
        computed: {
            ...mapStores(useUserAuthInfoStore)
        },
        components: {
            EmptyState,
            BaseModal,
            BaseButton,
            BaseToastContainer,
            BaseToast,
            BaseInput,
            SearchInput,
            BaseUnorderedList,
            BaseListItem,
            SimpleText,
            TextTitle5,
            BaseAnchor,
            ToolBar,
            ToolBarItem
        }
    }
</script>