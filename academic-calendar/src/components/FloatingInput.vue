<template>
    <div class="form-floating">
        <BaseInput 
            ref="baseInput"
            :value="customValue"
            @input="$emit('input', $event)"
            :placeholder="placeholder"
            :maxlength="maxlength" 
            :id="id" 
            :type="type"/>
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
    import * as bootstrap from 'bootstrap';

    export default {
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
            maxlength: {
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
            type: {
                required: true,
                type: String
            },
            customValue: String
        },
        model: {
            prop: 'customValue',
            event: 'input'
        },
        watch: {
            inputValue(vlr) {
                //this.$emit('input', vlr);
            }
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