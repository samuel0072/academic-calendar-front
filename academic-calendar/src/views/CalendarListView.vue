<template>
    <div>
        <div v-if="loading">
            Obtendo os caléndários...
        </div>
        <div v-else>
            <div v-if="!loading && calendars.length === 0">
                <EmptyState msg="Não há calendários para exibir" :displayButton="true" buttonLabel="Crie um calendário"/>
            </div>
            <div v-else>
                <BaseModal :modal_id="calendarCreationModalId">
                    <template v-slot:modal-title>
                        <h5>Crie um novo calendário acadêmico</h5>
                    </template>

                    <template v-slot:modal-body>
                        <div>
                            <form id="calendar_creation_form" @submit.prevent="createCalendar" class="needs-validation">
                                <div class="form-floating mb-3">
                                    <input 
                                        v-model="calendarFormValues.description" 
                                        type="text" 
                                        class="form-control" 
                                        :id="calendarFormIds.descriptionInput" 
                                        required 
                                        placeholder="" 
                                        maxlength="500"/>
                                    <label for="calendar_description_input">Nome do calendário</label>
                                    <div class="invalid-feedback">
                                        Esse nome não é válido. Tente informar um nome com até 500 caracteres.
                                    </div>
                                </div>
                                <div class="form-floating mb-3">
                                    <input 
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
                                    <input 
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
                            <BaseButton type="submit" form="calendar_creation_form" label="Criar" />
                        </div>
                    </template>
                </BaseModal>

                <button type="button" class="btn" data-bs-toggle="modal" :data-bs-target="'#' + calendarCreationModalId">
                    Crie um calendário
                </button>

                <button @click="getCalendars">Obter calendários</button>

                <CalendarList :calendars="calendars" />
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapStores } from 'pinia'
    import { useUserAuthInfoStore } from '@/stores/userAuthInfo'
    import CalendarList  from '@/components/CalendarList.vue'
    import EmptyState from '@/components/EmptyState.vue'
    import refreshUserAuthToken from '@/assets/scripts/refreshUserAuthToken.js'
    import BaseModal from '@/components/BaseModal.vue'
    import BaseButton from '@/components/BaseButton.vue'
    import * as bootstrap from 'bootstrap';
    
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
                calendarCreationModalId: 'calendarCreationModal'
            }
        },
        methods: {
            getCalendars() {
                axios.get('api/academic-calendar/search_calendar', {
                    headers: {
                        'Authorization': 'Bearer ' + this.userAuthInfoStore.token
                    }
                }).then( (response) => {
                    this.loading = false
                    this.calendars = response.data
                }).catch( (error) => {
                    if(error.request.status == 401) {
                        refreshUserAuthToken(this.getCalendars)
                    }
                    else {
                        //tratar erros que podem vim do servidor
                    }
                })
                .finally( () => {
                    this.loading = false
                })
            },
            createCalendar() {
                
                //var calendarCreationModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('#' + this.calendarCreationModalId));

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
                    this.calendars.push(response.data)
                    //calendarCreationModal.hide();
                    alert("Calendário Criado com sucesso!");
                }).catch( (error) => {
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
                            console.log("Não foi possível se conectar com o servidor")
                        }
                    }
                    else if(error.request) {
                        if(error.code === "ERR_NETWORK") {
                            alert("Esse cliente não consegue se conectar com a internet.");
                        }
                    }
                    else {
                        console.log(error)
                        alert("Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente.")
                    }
                    
                })
                .finally( () => {
                    this.loading = false
                })
            }
        },
        mounted: function() {
            this.getCalendars()
        },
        computed: {
            ...mapStores(useUserAuthInfoStore)
        },
        components: {
            'CalendarList': CalendarList,
            'EmptyState': EmptyState,
            'BaseModal': BaseModal,
            'BaseButton': BaseButton
        }
    }
</script>