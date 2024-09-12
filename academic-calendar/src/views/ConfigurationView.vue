<template>
    <div class="container-xxl bd-gutter mt-3 my-md-4 bd-layout">
        <SideBar :options="options"/>

        <div id="main-body" class="bd-main order-1">
            <div id="create-user">
                <h1>Criação de Usuários</h1>
            </div>
            <div id="campus-configurations">
                <h1>Campus</h1>
                <div id="create-campus">
                    <h1>Criação de Campus</h1>
                </div>
                <div id="list-campus">
                    <h1>Lista de Campi</h1>
                </div>
            </div>
            <div id="import-national-holidays">
                <h1>Importar Feriados Nacionais</h1>
            </div>
            <div id="import-regional-holidays">
                <h1>Importar Feriados Regionais</h1>
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
            SideBar
        }
    }
</script>