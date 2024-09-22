<template>
    <div ref="feedback">
        <slot></slot>
    </div>
</template>

<script>

    export default {
        mounted: function() {
            if(this.type === "valid") {
                this.$refs.feedback.classList.add("valid-feedback")
            }
            else {
                this.$refs.feedback.classList.add("invalid-feedback")
            }
        },
        props: {
            type: {
                required: true
            }
        }
    }

</script>