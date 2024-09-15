<template>
    <div>
        <div class="row">
            <div class="col-4">
                <SideBar id="config-nav"  :options="options"/>
            </div>
            <div class="col-8">
                <div id="main-body" class="bd-main">
                    <Card id="user-configurations">
                        <UserPage />
                    </Card>
                    <Card id="campus-configurations">
                        <CampusPage />
                    </Card>
                    <Card id="import-holidays">
                        <ImportHolidayPage />
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
</style>
<script>
    import SideBar from '@/components/SideBar.vue';
    import TextTitle1 from '@/components/text-components/TextTitle1.vue'
    import Card from '@/components/Card.vue'

    import CampusPage from "@/views/subpages/configuration/Campus.vue"
    import ImportHolidayPage from "@/views/subpages/configuration/ImportHolidays.vue"
    import UserPage from "@/views/subpages/configuration/User.vue"

    import * as bootstrap from 'bootstrap'

    import { mapStores } from "pinia"
	import { useUserAuthInfoStore } from "@/stores/userAuthInfo"
	import { useOrganizationInfoStore } from "@/stores/organizationInfo"

    export default {
        data: function() {
            return {
                options: [
                    {link: "#user-configurations", display: "Usuários", subMenu: [
                    {link: "#user-creation", display: "Criação de Usuários"},
                    {link: "#user-list", display: "Lista de Usuários"}
                    ]},
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
            Card,
            CampusPage,
            ImportHolidayPage,
            UserPage
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