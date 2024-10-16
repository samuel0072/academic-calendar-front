<template>
    <div>
        <TextTitle1>Organização</TextTitle1>
        <TextTitle3> {{ organizationInfoStore.name }} </TextTitle3>
        
        <BaseForm>
            <TextTitle5>Edição de cálculo de tempo</TextTitle5>
            <FloatingInput 
                label="Tempo mínimo para uma componente"
                type="text"
                maxlength="6"
                required="true"
                id="min-minutes-per-day"
                pattern="^\d{2,3}(:[0-5][0-9]$)?"
            >

            </FloatingInput>
        </BaseForm>
    </div>
</template>

<script>
    import TextTitle1 from '@/components/text-components/TextTitle1.vue'
    import TextTitle3 from '@/components/text-components/TextTitle3.vue'
    import TextTitle5 from '@/components/text-components/TextTitle5.vue'
    import SimpleText from '@/components/text-components/SimpleText.vue'
    import BaseButton from "@/components/BaseButton.vue"
    import BaseForm from '@/components/BaseForm.vue'
    import BaseToastContainer from '@/components/BaseToastContainer.vue'
    import BaseToast from '@/components/BaseToast.vue'
    import FormInputFeedback from '@/components/FormInputFeedback.vue'
    import FloatingInput from '@/components/FloatingInput.vue'

    import * as bootstrap from 'bootstrap'
    import axios from 'axios'

    import { mapStores } from "pinia"
	import { useUserAuthInfoStore } from "@/stores/userAuthInfo"
	import { useOrganizationInfoStore } from "@/stores/organizationInfo"
    import refreshUserAuthToken from '@/assets/scripts/refreshUserAuthToken.js'

    export default {
        data: function() {
            return {
                successToast: {
                    el: null,
                    msg: ""
                },
                errorToast: {
                    el: null,
                    msg: ""
                }
            }
        },
        computed: {
            ...mapStores(useUserAuthInfoStore, useOrganizationInfoStore),
        },
        components: {
            TextTitle1,
            BaseButton,
            BaseForm,
            TextTitle3,
            SimpleText,
            BaseToastContainer,
            BaseToast,
            FormInputFeedback,
            FloatingInput,
            TextTitle5
        },
        mounted: function() {
            this.successToast.el = bootstrap.Toast.getOrCreateInstance("#importing-holiday-sucess-toast");
            this.errorToast.el = bootstrap.Toast.getOrCreateInstance("#importing-holiday-fail-toast");
        },
        methods: {
            
        }
    }
</script>