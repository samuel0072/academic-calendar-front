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
                <button type="button" class="" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Launch demo modal
                </button>
                <BaseModal modal_id="exampleModal">
                    <template v-slot:modal-title>
                        <h5>Crie um novo calendário acadêmico</h5>
                    </template>
                    <template v-slot:modal-body>
                        <h1>Here might be a page title</h1>
                    </template>
                    <template v-slot:modal-footer>
                        <h1>Here might be a page title</h1>
                    </template>
                </BaseModal>

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
    
    export default {
        data: function() {
            return {
                calendars: [],
                loading: true
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
            'BaseModal': BaseModal
        }
    }
</script>