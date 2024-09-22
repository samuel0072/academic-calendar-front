<template>
    <input 
        ref="input"
        :id="id" 
        :type="type" 
        class="form-control" 
        :placeholder="placeholder" 
        :value="value"
        @input="$emit('input', $event.target.value)" >
</template>

<script>
    import "@/assets/main_bootstrap.scss";
    import * as bootstrap from 'bootstrap';

    export default {
        name: 'BaseInput',
        props: {
            type: {
                type: String,
                required: true
            },
            id: {
                type: String,
                required: true
            },
            placeholder: {
                type: String,
                required: false
            },
            value: String
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