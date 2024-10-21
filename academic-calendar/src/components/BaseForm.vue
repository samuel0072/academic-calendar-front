<template>
    <form @submit.prevent="$emit('submit')" ref="form" class="pt-2 pb-2">
        <slot></slot>
    </form>
</template>
<style scoped>
 form {
    width: 100%;
 }
</style>
<script>
    export default {
        props: {
            type: {
                required: false,
                default: "basic"
            }
        },
        mounted: function() {
            if(this.type === "feedback") {
                this.$refs.form.classList.add("needs-validation")
            }
        },
        methods: {
            validate() {
                this.$refs.form.classList.add("was-validated")
            },
            resetValidation() {
                this.$refs.form.classList.remove("was-validated")
            }
        }
    }
</script>