<template>
    <aside>
        <ul>
            <li v-for="option in options" :key="option.link">
                <a 
                :href="option.link" 
                @mouseover="addLinkActiveBorder(option.link)" 
                @mouseout="removeLinkActiveBorder(option.link)" 
                :id="option.link"> 
                    {{ option.display }} 
                </a>

                <ul v-if="option.hasOwnProperty('subMenu')">
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
        position: -webkit-sticky;
        position: sticky;
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
</style>
<script>
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
        }
    }
</script>