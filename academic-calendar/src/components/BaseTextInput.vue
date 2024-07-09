<template>
    <input 
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
    }
</script>