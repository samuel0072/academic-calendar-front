<template>
    <div>
        <span>{{ description }}</span>
        <span> {{ startDate }} </span>
        <span> {{ endDate }} </span>

        <BaseButton label="Acessar" type="button" @baseButtonClick="itemClick"></BaseButton>
    </div>
</template>

<script>
    import BaseButton from "@/components/BaseButton.vue"

    export default {
        name: 'CalendarItem',
        props: {
            description: {
                type: String,
                required: true
            },
            startDate: {
                required: true
            },
            endDate: {
                required: true
            }
        },
        components: {
            'BaseButton': BaseButton
        },
        methods: {
            itemClick() {
                console.log(this.description)
            }
        }
    }

</script>