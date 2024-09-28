<template>
    <select 
        class="form-select" 
        v-model="selectedValues"
        ref="mainSelect"
        :disabled="disabled"
        multiple >
        
        <option v-for="option in options" 
            :value="option.value" 
            :key="option.value"> 
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
                selectedValues: []
            }
        },
        props: {
            options: {
                required: true,
                type: Array
            },
            value: Array,
            disabled: {
                required: false,
                default: false
            }
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        watch: {
            value(newValues) {
                this.selectedValues = newValues
            },
            selectedValues(newValues) {
                this.$emit('change', newValues);
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