<template>
    <div>
        <span>{{ description }}</span>
        <span> {{ startDate }} </span>
        <span> {{ endDate }} </span>
        <BaseButton type="button" @click.native="$emit('calendar-item-view')" >
            Visualizar Calendário
        </BaseButton>
        <BaseButton type="button" @click.native="$emit('calendar-item-delete')" >
            Excluir
        </BaseButton>
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
            },
            calendarId: {
                required: true
            }
        },
        components: {
            'BaseButton': BaseButton
        }
    }

</script>