<template>
    <aside class="sticky-top">
        <TextTitle5 id="sidebar-title"> Navegação </TextTitle5>
        <HorizontalLine />
        <ul class="main-list">
            <li v-for="option in options" :key="option.link">
                <a 
                :href="option.link" 
                @mouseover="addLinkActiveBorder(option.link)" 
                @mouseout="removeLinkActiveBorder(option.link)" 
                :id="option.link"> 
                    {{ option.display }} 
                </a>

                <ul v-if="option.hasOwnProperty('subMenu')" class="sublist">
                    <li v-for="subOption in option.subMenu" :key="subOption.link" >
                        <a 
                        :href="subOption.link" 
                        :id="subOption.link" 
                        @mouseover="addLinkActiveBorder(subOption.link)"
                        @mouseout="removeLinkActiveBorder(subOption.link)" 
                        > 
                            {{ subOption.display }} 
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </aside>
</template>
<style scoped>
    aside {
        float: left;
        padding: .125rem .125rem .125rem .125rem;
        margin: 0.2rem 0.2rem 0.2rem 0.2rem;
    }
    li {
        list-style-type: none;
    }
    a {
        padding: .125rem 0 .125rem .75rem;
        border-left: .125rem solid transparent;
    }

    .active {
        border-color: white;
    }
    
    .main-list {
        padding-left: 0;
    }

    .sublist {
        padding-left: 1rem;
    }
</style>
<script>
    import TextTitle5 from '@/components/text-components/TextTitle5.vue'
    import HorizontalLine from '@/components/HorizontalLine.vue'
    export default {
        props: {
            options: {
                type: Array,
                required: true
            }
        },
        methods: {
            addLinkActiveBorder(elementId) {
                var anchor = document.getElementById(`${elementId}`)
                anchor.classList.add('active');
            },
            removeLinkActiveBorder(elementId) {
                var anchor = document.getElementById(`${elementId}`)
                anchor.classList.remove('active');
            }
        },
        components: {
            TextTitle5,
            HorizontalLine
        }
    }
</script>