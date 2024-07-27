<template>
    <div>
        <span>{{ description }}</span>
        <span> {{ startDate }} </span>
        <span> {{ endDate }} </span>
        <BaseButton type="button" @click.native="$emit('calendar-item-view')" >
            <!-- TODO: botar no tranlation ou colocar como um slot? -->
            Visualizar Calendário
        </BaseButton>
        <BaseButton type="button" @click.native="$emit('calendar-item-delete')" >
         <!-- TODO: botar no tranlation ou colocar como um slot? -->
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