<template></template>
<script>
export default {
    mounted: function() {
        localStorage.removeItem("authToken")
        localStorage.removeItem("refreshToken")

        this.$router.push({ name: "login" })
    }
}
</script>