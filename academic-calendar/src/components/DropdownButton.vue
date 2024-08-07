<template>
    <div class="btn-group" role="group" >
        <BaseButton type="button" @click.native="handleClick(defaultValue)"> {{ defaultLabel }} </BaseButton>
        <div class="btn-group" role="group">
            <BaseButton type="button" class="btn dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="visually-hidden">Toggle Dropdown</span>
            </BaseButton>
            <DropdownMenu :options="options" @click="handleClick($event)"/>
        </div>
    </div>
</template>
<script>
    import BaseButton from "@/components/BaseButton.vue"
    import DropdownMenu from "@/components/DropdownMenu.vue"

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
            DropdownMenu
        },
        methods: {
            handleClick(value) {
                this.$emit('click', value)
            }
        }
    }
</script>