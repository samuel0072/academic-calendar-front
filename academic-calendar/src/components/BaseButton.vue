<template>
    <button :type="type" class="btn" >
        <slot>
        </slot>
     </button>
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
            type: {
                type: String,
                required: true
            }
        }
    }
</script>