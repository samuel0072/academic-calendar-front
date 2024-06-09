<template>
    <div>
        <div class="modal" tabindex="-1" :id="modal_id">
            <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-title">
                            <slot name="modal-title"></slot>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <IconCloseButton />
                        </button>
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
    </div>
    
</template>

<script>
    import "@/assets/main_bootstrap.scss";
    import * as bootstrap from 'bootstrap';
    import IconCloseButton from "@/components/icons/IconCloseButton.vue";

    export default {
        props: {
            modal_id: {
                type: String,
                required:true
            }
        },
        components: {
            'IconCloseButton': IconCloseButton
        }
    }

</script>