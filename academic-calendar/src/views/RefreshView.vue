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
                var refreshToken = localStorage.getItem('refreshToken')
                refreshUserAuthToken(refreshToken)
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