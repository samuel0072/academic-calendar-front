<template>
    <div class="container-xxl bd-gutter mt-3 my-md-4 bd-layout">
        <SideBar :options="options"/>

        <PageSection id="main-body" class="bd-main order-1">
            <PageSection id="create-user">
                <TextTitle1>Criação de Usuários</TextTitle1>
            </PageSection>
            <PageSection id="campus-configurations">
                <CampusPage />
            </PageSection>
            <PageSection id="import-holidays">
                <ImportHolidayPage />
            </PageSection>
        </PageSection>

        <BaseToastContainer class="position-fixed bottom-0 end-0 p-3">
            <BaseToast 
                title="Sucesso" 
                :message="successToast.msg" 
                id="sucess-toast" 
                class="text-bg-success" />

            <BaseToast 
                title="Erro" 
                :message="errorToast.msg" 
                id="fail-toast" 
                class="text-bg-danger" />    

        </BaseToastContainer>
    </div>
</template>
<style>
    #main-body {
        float: right;
    }
</style>
<script>
    import SideBar from '@/components/SideBar.vue';
    import TextTitle1 from '@/components/text-components/TextTitle1.vue'
    import BaseToastContainer from '@/components/BaseToastContainer.vue'
    import BaseToast from '@/components/BaseToast.vue'
    import PageSection from '@/components/PageSection.vue'

    import CampusPage from "@/views/subpages/configuration/Campus.vue"
    import ImportHolidayPage from "@/views/subpages/configuration/ImportHolidays.vue"

    import * as bootstrap from 'bootstrap'

    import { mapStores } from "pinia"
	import { useUserAuthInfoStore } from "@/stores/userAuthInfo"
	import { useOrganizationInfoStore } from "@/stores/organizationInfo"

    export default {
        data: function() {
            return {
                options: [
                    {link: "#create-user", display: "Criar Usuários"},
                    {link: "#campus-configurations", display: "Campus", subMenu: [
                        {link: "#create-campus", display: "Criação de Campus"},
                        {link: "#list-campus", display: "Lista de Campi"}
                    ]},
                    {link: "#import-holidays", display: "Importar Feriados"}
                ],
                successToast: {
                    el: null,
                    msg: ""
                },
                errorToast: {
                    el: null,
                    msg: ""
                },
                selectedCampus: null,
                deleteCampusModal: null,
                newCampus: {
                    name: ""
                },
                holidayTypes: [
                    { label: "Regional", value: "RH"},
                    { label: "Nacional", value: "H"},
                ],
                holidayImportingInfo: {
                    holidayType: "H",
                    file: null,
                    isErrored: false,
                    errorMsgs: [],
                    campi: []
                }
            }
        },
        computed: {
            ...mapStores(useUserAuthInfoStore, useOrganizationInfoStore),
            holidayImportingRoute() {
                if(this.holidayImportingInfo.holidayType === "H") {
                    return 'import_national_holidays'
                }
                else {
                    return 'import_regional_holidays'
                }
            },
            campiOptions() {
                var campi = []
                this.organizationInfoStore.campi.forEach( (campus) => {
					campi.push({
						value: campus.id,
						label: campus.name
					})
				})
                return campi;
            }
        },
        components: {
            SideBar,
            TextTitle1,
            BaseToastContainer,
            BaseToast,
            PageSection,
            CampusPage,
            ImportHolidayPage
        },
        mounted: function() {
            if(!this.userAuthInfoStore.isAuthenticated) {
                this.$router.push({ name: 'login', params: { next: '/configuration' }});
            }
            else {
                this.successToast.el = bootstrap.Toast.getOrCreateInstance("#sucess-toast");
                this.errorToast.el = bootstrap.Toast.getOrCreateInstance("#fail-toast");
            }
        }
    }
</script>