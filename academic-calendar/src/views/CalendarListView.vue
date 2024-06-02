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
                    console.log(this.calendars)
                }).catch( (error) => {
                    console.log(error)
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
            'EmptyState': EmptyState
        }
    }
</script>