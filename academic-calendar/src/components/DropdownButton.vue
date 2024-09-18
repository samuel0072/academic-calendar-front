<template>
    <DropdownMenu> 
        <template>
            <div class="btn-group" role="group">
                <BaseButton type="button" @click.native="handleClick(defaultValue)"> {{ defaultLabel }} </BaseButton>
                <BaseButton type="button" class="dropdown-toggle dropdown-toggle-split">
                    <span class="visually-hidden">Toggle Dropdown</span>
                </BaseButton>
            </div>
        </template>
        <template v-slot:options>
            <DropdownItem v-for="option in options" :key="option.value">
                <BaseButton type="button" @click.native="handleClick(option.value)"> {{ option.label }}</BaseButton>
            </DropdownItem>
        </template>
    </DropdownMenu>
</template>
<script>
    import BaseButton from "@/components/BaseButton.vue"
    import DropdownMenu from "@/components/DropdownMenu.vue"
    import DropdownItem from "@/components/DropdownItem.vue";

    export default {
        props: {
            defaultLabel: {
                required: true
            },
            options: {
                required: true
            },
            defaultValue: {
                required: true
            }
        },
        components: {
            BaseButton,
            DropdownMenu,
            DropdownItem
        },
        methods: {
            handleClick(value) {
                this.$emit('click', value)
            }
        }
    }
</script>