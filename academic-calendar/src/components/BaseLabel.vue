<template>
    <label :for="inputId" class="form-label">
        <slot></slot> 
    </label>
</template>

<script>
    import "@/assets/main_bootstrap.scss";
    import * as bootstrap from 'bootstrap';

    export default {
        name: 'SearchInput',
        props: {
            inputId: {
                type: String,
                required: true
            }
        }
    }
</script>