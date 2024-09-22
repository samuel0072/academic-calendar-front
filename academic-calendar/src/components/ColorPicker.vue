<template>
    <input 
        ref="input"
        type="color" 
        class="form-control form-control-color" 
        :value="value"
        @input="$emit('input', $event.target.value)" 
        title="Escolha uma cor">
        <!-- TODO: botar o title no tranlation ou colocar como uma prop? -->
</template>
<script>
    export default {
        props: {
            value: {
                required: false,
                type: String,
                default: '#FFFFFF'
            }
        },
        model: {
            prop: 'value',
            event: 'input'
        },
        methods: {
            validate(type) {
                if(type === "valid") {
                    this.$refs.input.classList.add("is-valid")
                }
                else if(type === "invalid") {
                    this.$refs.input.classList.add("is-invalid")
                }                
            },
            resetValidation() {
                this.$refs.input.classList.remove("is-valid")
                this.$refs.input.classList.remove("is-invalid")
            }
        }
       
    }
</script>