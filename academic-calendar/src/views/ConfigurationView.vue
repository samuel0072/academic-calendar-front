<template>
    <div class="container-xxl bd-gutter mt-3 my-md-4 bd-layout">
        <SideBar :options="options"/>

        <div id="main-body" class="bd-main order-1">
            <div id="create-user">
                <TextTitle1>Criação de Usuários</TextTitle1>
            </div>
            <div id="campus-configurations">
                <TextTitle1>Campus</TextTitle1>
                <div id="create-campus">
                    <TextTitle2>Criação de Campus</TextTitle2>
                </div>
                <div id="list-campus">
                    <TextTitle2>Lista de Campi</TextTitle2>
                </div>
            </div>
            <div id="import-national-holidays">
                <TextTitle1>Importar Feriados Nacionais</TextTitle1>
            </div>
            <div id="import-regional-holidays">
                <TextTitle1>Importar Feriados Regionais</TextTitle1>
            </div>
        </div>

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
    import TextTitle2 from '@/components/text-components/TextTitle2.vue'
	import TextTitle5 from '@/components/text-components/TextTitle5.vue'

    export default {
        data: function() {
            return {
                options: [
                    {link: "#create-user", display: "Criar Usuários"},
                    {link: "#campus-configurations", display: "Campus", subMenu: [
                        {link: "#create-campus", display: "Criação de Campus"},
                        {link: "#list-campus", display: "Lista de Campi"}
                    ]},
                    {link: "#import-national-holidays", display: "Importar Feriados Nacionais"},
                    {link: "#import-regional-holidays", display: "Importar Feriados Regionais"},
                ]
            }
        },
        components: {
            SideBar,
            TextTitle1,
            TextTitle5,
            TextTitle2
        }
    }
</script>