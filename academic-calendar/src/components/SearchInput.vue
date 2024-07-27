<template>
    <form @submit.prevent="searchTrigger">
        <div class="input-group">
            <BaseInput :id="id" type="text" placeholder="Digite aqui para buscar..." v-model="searchValue"/>
            <!--  colocar esses title e placeholder como uma prop no no translation? -->
            <BaseButton type="submit"  title="buscar">
                <i>
                    <SearchIcon /> 
                </i>
            </BaseButton>
        </div>
    </form>
</template>

<style scoped>

i {
  display: flex;
  place-items: center;
  place-content: center;

  color: var(--color-text);
}

.btn {
    border-color: var(--color-border);
}

</style>


<script>
    import "@/assets/main_bootstrap.scss";
    import BaseInput from '@/components/BaseInput.vue'
    import BaseButton from '@/components/BaseButton.vue'
    import SearchIcon from '@/components/icons/IconMagnifyingGlass.vue'
    import * as bootstrap from 'bootstrap';

    export default {
        name: 'SearchInput',
        props: {
            id: {
                type: String,
                required: true
            }
        },
        data: function() {
            return {
                searchValue: ""
            }
        },
        components: {
            'BaseButton': BaseButton,
            'BaseInput': BaseInput,
            'SearchIcon': SearchIcon
        },
        methods: {
            searchTrigger() {
                this.$emit("search-triggered", this.searchValue)
            }
        }
    }
</script>