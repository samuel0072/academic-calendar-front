<template>
    <button :type="type" class="btn" >
        <slot>
        </slot>
     </button>
</template>

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