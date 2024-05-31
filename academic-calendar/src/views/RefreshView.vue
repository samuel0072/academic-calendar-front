<template>
    <div>
        <button @click="refreshToken"> Refresh </button>
    </div>
</template>
<script> 
    import refreshUserAuthToken from '@/assets/scripts/refreshUserAuthToken.js';

    export default {
        methods: {
            refreshToken() {
                var authToken = localStorage.getItem('authToken')
                var refreshToken = localStorage.getItem('refreshToken')
                refreshUserAuthToken(authToken, refreshToken)
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