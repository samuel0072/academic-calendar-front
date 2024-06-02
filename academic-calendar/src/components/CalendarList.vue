<template>
    <div>
        <ul>
            <li v-for="calendar in calendars" :key="calendar.id"> 
                <CalendarItem 
                :description="calendar.description" 
                :startDate="calendar.start_date" 
                :endDate="calendar.end_date" />
            </li>
        </ul>
    </div>
</template>

<script>
    import CalendarItem from "@/components/CalendarItem.vue"
    
    export default {
        name: "CalendarList",
        props: {
            calendars: {
                required: true
            }
        },
        components: {
            'CalendarItem': CalendarItem
        }
    }
</script>