<template>
    <div class="input-group">
        <BaseTextInput :id="id" type="text" placeholder="Digite aqui para buscar..." label="" v-model="searchValue"/>
        <BaseButton type="submit"  title="buscar">
            <i>
                <SearchIcon /> 
            </i>
        </BaseButton>
    </div>
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
    import BaseTextInput from '@/components/BaseTextInput.vue'
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
            'BaseTextInput': BaseTextInput,
            'SearchIcon': SearchIcon
        }
    }
</script>