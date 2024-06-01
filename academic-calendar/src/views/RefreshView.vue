<template>
    <div>
        <button @click="refreshToken"> Refresh </button>
    </div>
</template>
<script> 
    import refreshUserAuthToken from '@/assets/scripts/refreshUserAuthToken.js';
    import { useUserAuthInfoStore } from '@/stores/userAuthInfo.js';

    export default {
        methods: {
            refreshToken() {
                var store = useUserAuthInfoStore()
                refreshUserAuthToken(store.refreshToken)
                .catch( (error ) => {
                    if(error.cause === "APIError") {
                        localStorage.removeItem("authToken")
                        localStorage.removeItem("refreshToken")
                    }
                    this.$router.push({ name: "login" })
                })
                
            }
        }
    }
</script>