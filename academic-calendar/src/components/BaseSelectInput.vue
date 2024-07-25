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
//precisa rever a forma de enviar o evento pois no tipo multiple não ta enviando como array
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
            }
        }
    }
</script>