<template>
  <div ref="container" />
</template>
<script>
   
    import Calendar from '@toast-ui/calendar';
    import Vue from 'vue';

    export default {
        name: 'ToastUICalendar',
        props: {
            view: String,
            useFormPopup: {
                type: Boolean,
                default: () => undefined,
            },
            useDetailPopup: {
                type: Boolean,
                default: () => undefined,
            },
            isReadOnly: {
                type: Boolean,
                default: () => undefined,
            },
            usageStatistics: {
                type: Boolean,
                default: () => undefined,
            },
            eventFilter: Function,
            week: Object,
            month: Object,
            gridSelection: {
                type: [Object, Boolean],
                default: () => undefined,
            },
            timezone: Object,
            theme: Object,
            template: Object,
            calendars: Array,
            events: Array,
        },
        data() {
            return {
                calendarInstance: null,
            };
        },
        watch: {
            view(value) {
                this.calendarInstance.changeView(value);
            },
            useFormPopup(value) {
                this.calendarInstance.setOptions({ useFormPopup: value });
            },
            useDetailPopup(value) {
                this.calendarInstance.setOptions({ useDetailPopup: value });
            },
            isReadOnly(value) {
                this.calendarInstance.setOptions({ isReadOnly: value });
            },
            eventFilter(value) {
                this.calendarInstance.setOptions({ eventFilter: value });
            },
            week(value) {
                this.calendarInstance.setOptions({ week: value });
            },
            month(value) {
                this.calendarInstance.setOptions({ month: value });
            },
            gridSelection(value) {
                this.calendarInstance.setOptions({ gridSelection: value });
            },
            timezone(value) {
                this.calendarInstance.setOptions({ timezone: value });
            },
            theme(value) {
                this.calendarInstance.setTheme(value);
            },
            template(value) {
                this.calendarInstance.setOptions({ template: value });
            },
            calendars(value) {
                this.calendarInstance.setCalendars(value);
            },
            events(value) {
                this.calendarInstance.clear();
                this.calendarInstance.createEvents(value);
            },
        },
        mounted: function() {
            this.calendarInstance = new Calendar(this.$refs.container, {
                defaultView: this.view,
                useFormPopup: this.useFormPopup,
                useDetailPopup: this.useDetailPopup,
                isReadOnly: this.isReadOnly,
                usageStatistics: this.usageStatistics,
                eventFilter: this.eventFilter,
                week: this.week,
                month: this.month,
                gridSelection: this.gridSelection,
                timezone: this.timezone,
                theme: this.theme,
                template: this.template,
                calendars: this.calendars,
            });
            this.addEventListeners();
            this.calendarInstance.createEvents(this.events);
            this.calendarInstance.setOptions({
                template: {
                    monthGridHeaderExceed(hiddenEvents) {
                        return `<span> mais ${hiddenEvents}</span>`;
                    },
                    monthDayName(model) {
                        var label = ""
                        switch(model.day){
                            case 0:
                                label = "Dom"
                                break
                            case 1:
                                label = "Seg"
                                break
                            case 2:
                                label = "Ter"
                                break
                            case 3:
                                label = "Qua"
                                break
                            case 4:
                                label = "Qui"
                                break
                            case 5:
                                label = "Sex"
                                break
                            case 6:
                                label = "Sáb"
                                break
                        }
                        return label;
                    },
                    // monthMoreTitleDate(moreTitle) {
                    //     const { date } = moreTitle;

                    //     return `<span>${date}</span>`;
                    // },
                }
            })
        },
        beforeDestroy() {
            this.calendarInstance.off();
            this.calendarInstance.destroy();
        },
        methods: {
            addEventListeners() {
                Object.keys(this.$listeners).forEach((eventName) => {
                    this.calendarInstance.on(eventName, (...args) => this.$emit(eventName, ...args));
                });
            },
            getRootElement() {
                return this.$refs.container;
            },
            getInstance() {
                return this.calendarInstance;
            },
        }
    };
</script>
