<template>
    <input 
        type="color" 
        class="form-control form-control-color" 
        :value="value"
        @input="$emit('input', $event.target.value)" 
        title="Escolha uma cor">
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
        }
    }
</script>