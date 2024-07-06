<template>
    <div>
    Página
    </div>
</template>
<script>
    import axios from 'axios'
    import { mapStores } from 'pinia'
    import { useUserAuthInfoStore } from '@/stores/userAuthInfo'

    export default {
        methods: {
            getEvents() {
                axios.get(`/api/academic-calendar/calendar/${this.$route.params.id}/events`, {
                    headers: {
                        'Authorization': 'Bearer ' + this.userAuthInfoStore.token
                    }
                })
            }
        },
        mounted: function() {
            this.getEvents();
        },
        computed: {
            ...mapStores(useUserAuthInfoStore)
        }
    }
</script>