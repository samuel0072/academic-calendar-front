<template>
    <div class="form-floating">
        <BaseInput 
            v-bind="$attrs"
            placeholder
            ref="baseInput"
            :value="customValue"
            @input="$emit('input', $event)"
            :id="id" 
             />
        <BaseLabel :for="id">
            {{label}}
        </BaseLabel>
        <slot>
        </slot>
    </div>
</template>

<script>
    import BaseInput from '@/components/BaseInput.vue'
    import BaseLabel from '@/components/BaseLabel.vue'

    import "@/assets/main_bootstrap.scss";

    export default {
        inheritAttrs: false,
        data: function(){
            return {
                inputValue: ""
            }
        },
        props: {
            placeholder: {
                required: false,
                type: String,
                default: ""
            },
            label: {
                required: true,
                type: String
            },
            id: {
                required: true,
                type: String
            },
            customValue: String
        },
        model: {
            prop: 'customValue',
            event: 'input'
        },
        components: {
            BaseInput,
            BaseLabel
        },
        methods: {
            validate(type) {
                this.$refs.baseInput.validate(type);
            },
            resetValidation() {
                this.$refs.baseInput.resetValidation();
            }
        }
    }
</script>