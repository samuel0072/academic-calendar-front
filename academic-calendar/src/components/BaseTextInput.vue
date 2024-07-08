<template>
    <div>
        <label :for="id" class="form-label"> {{label}} </label>
        <input 
            :id="id" 
            :type="type" 
            class="form-control" 
            :placeholder="placeholder" 
            :value="value"
            @input="$emit('input', $event.target.value)"
        >
    </div>

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
            label: {
                type: String,
                required: true
            },
            id: {
                type: String,
                required: true
            },
            placeholder: {
                type: String,
                required: true
            }
        },
        model: {
            prop: 'value',
            event: 'input'
        },
        props: {
            value: String
        }
    }
</script>