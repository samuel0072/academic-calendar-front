<template>
    <div class="empty-state rounded border d-flex align-items-center justify-content-center">
        <div class="text-center">
            {{ msg }}
        </div>
        <div v-if="displayButton">
        <!-- TODO: Adequar ao novo componente do botão -->
            <BaseButton type="button" @click.native="$emit('btn-click')" >
                {{ buttonLabel }}
            </BaseButton>
        </div>
    </div>
</template>
<style scoped>
    .empty-state {
        width: 500px;
        height: 200px;
        border-style: dashed !important;
    }
</style>
<script>
    import BaseButton from "@/components/BaseButton.vue"
    
    export default {
        props: {
            msg: {
                type: String,
                required: true
            },
            displayButton: {
                type: Boolean,
                required: false,
                default: false
            },
            buttonLabel: {
                type: String,
                required: false
            }
        },
        components: {
            'BaseButton': BaseButton
        }
    }

</script>