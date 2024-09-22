<template>
    <div class="modal" tabindex="-1" >
        <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">
                        <slot name="modal-title"></slot>
                    </div>
                    <BaseButton type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div class="modal-body">
                    <slot name="modal-body"></slot>
                </div>
                <div class="modal-footer">
                    <slot name="modal-footer"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "@/assets/main_bootstrap.scss";
    import BaseButton from "@/components/BaseButton.vue";

    export default {
        components: {
            BaseButton
        }
    }

</script>