<template>
    <select class="form-select" 
        @input="$emit('input', $event.target.value)" 
        :value="value" 
        ref="mainSelect"
        multiple >
        <option v-for="option in options" 
            :value="option.value" 
            :selected="option.selected"> 
            {{ option.label }} 
        </option>
    </select>
</template>

<script>
//precisa rever a forma de selecionar os elementos na renderização
    import "@/assets/main_bootstrap.scss";

    export default {
        props: {
            options: {
                required: true,
                type: Array
            },
            value: Array
        },
        model: {
            prop: 'value',
            event: 'input'
        },
        mounted: function() {
            // // Nesse tipo de select o código abaixo tem que ser usado para selecionar as opções na primeira vez que o componente é renderizado
            this.$refs.mainSelect.childNodes.forEach((option) => {
                if(this.selectedValue.includes(option._value)) {
                    option.selected = true
                }
            })
        },
        methods: {
            validate(type) {
                if(type === "valid") {
                    this.$refs.mainSelect.classList.add("is-valid")
                }
                else if(type === "invalid") {
                    this.$refs.mainSelect.classList.add("is-invalid")
                }                
            },
            resetValidation() {
                this.$refs.mainSelect.classList.remove("is-valid")
                this.$refs.mainSelect.classList.remove("is-invalid")
            }
        }
    }
</script>