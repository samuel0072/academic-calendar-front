<template>
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <!-- img src="..." class="rounded me-2" alt="..." -->
            <strong class="me-auto">{{ title }}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
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
                required: true,
                type: String
            },
            message: {
                required: true,
                type: String
            }
        }
    }
</script>