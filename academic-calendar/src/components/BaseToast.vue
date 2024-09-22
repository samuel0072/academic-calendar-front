<template>
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header" v-if="title.length > 0">
            <!-- img src="..." class="rounded me-2" alt="..." -->
            <strong class="me-auto">{{ title }}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body" v-if="message.length > 0">
            {{ message }}
        </div>
  </div>
</template>

<script>
    import "@/assets/main_bootstrap.scss";
    import * as bootstrap from 'bootstrap';

    export default {
        props: {
            title: {
                required: false,
                type: String,
                default: ""
            },
            message: {
                required: false,
                type: String,
                default: ""
            }
        }
    }
</script>