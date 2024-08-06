<template>
    <select class="form-select" v-model="selectedValue" ref="mainSelect">
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
        data: function() {
            return {
                selectedValue: this.value
            }
        },
        props: {
            options: {
                required: true,
                type: Array
            },
            value: {
                required: false,
                type: Array|String|Number
            },
            multiple: {
                required: false,
                default: false
            }
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        watch: {
            selectedValue(value) {
                this.$emit('change', value)
            }
        },
        mounted: function() {
            if(this.multiple) {
                this.$refs.mainSelect.setAttribute('multiple', '');
                this.selectedValue = this.value        
                
                // Nesse tipo de select o código abaixo tem que ser usado para selecionar as opções na primeira vez que o componente é renderizado
                this.$refs.mainSelect.childNodes.forEach((option) => {
                    if(this.selectedValue.includes(option._value)) {
                        option.selected = true
                    }
                })
            }
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