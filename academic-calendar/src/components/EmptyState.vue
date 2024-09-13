<template>
    <div>
        <div>
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