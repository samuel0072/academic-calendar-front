<template>
    <button :type="type" @click="$emit( 'baseButtonClick' )" class="btn"> {{ label }} </button>
</template>
<style scoped>
    .btn {
        color: var(--color-text);
    }
</style>

<script>
    import "@/assets/main_bootstrap.scss";
    import * as bootstrap from 'bootstrap';

    export default {
        name: 'BaseButton',
        props: {
            label: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            }
        }
    }
</script>