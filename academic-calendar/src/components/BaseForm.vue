<template>
    <form @submit.prevent="$emit('submit')" ref="form">
        <slot></slot>
    </form>
</template>

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