<template>
    <select class="form-select" @change="$emit('change', $event.target.value)">
        <option v-for="option in options" :value="option.value"> {{ option.label }} </option>
    </select>
</template>

<script>
    import "@/assets/main_bootstrap.scss";

    export default {
        props: {
            options: {
                required: true,
                type: Array
            },
            value: String
        },
        model: {
            prop: 'value',
            event: 'change'
        },
    }
</script>