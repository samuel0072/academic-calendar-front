<template>
    <Page>
        <TextTitle5>
            <span>DIAS LETIVOS – QUADRO SÍNTESE</span>
        </TextTitle5>
        <EmptyState 
            v-if="summaryData.semesters.length == 0" 
            msg="Essa visualização só está disponível quando há semestres no calendário." 
        />
        <div v-else>
            <Card v-for="semesterInfo in summaryData.semesters" :key="semesterInfo.description">
                <TextTitle5 style="text-align: center;"> {{ semesterInfo.description }} </TextTitle5>
                <BaseTable>
                    <template v-slot:head>
                        <BaseTHead>
                            <BaseTH>Local</BaseTH>
                            <BaseTH>Qnt. Dias Letivos</BaseTH>
                            <BaseTH>Seg.</BaseTH>
                            <BaseTH>Ter.</BaseTH>
                            <BaseTH>Qua.</BaseTH>
                            <BaseTH>Qui.</BaseTH>
                            <BaseTH>Sex.</BaseTH>
                            <BaseTH>Sáb.</BaseTH>
                        </BaseTHead>
                    </template>
                    <template v-slot:body>
                        <BaseTBody>
                            <tr v-for="campusSummary in semesterInfo.campiSummary" :key="campusSummary.id">
                                <td>
                                    {{ campusSummary.name }} 
                                </td>
                                <td>
                                    {{ campusSummary.schoolDaysCount }} 
                                </td>
                                <td :class="dayInfoClass(campusSummary.schoolWeekDays.monday)">
                                    {{ campusSummary.schoolWeekDays.monday }} 
                                    | {{  calcPercentMinutesPerDay(calcTimeForDay(campusSummary.schoolWeekDays.monday)) }} %
                                </td>
                                <td :class="dayInfoClass(campusSummary.schoolWeekDays.tuesday)">
                                    {{ campusSummary.schoolWeekDays.tuesday }} 
                                    | {{  calcPercentMinutesPerDay(calcTimeForDay(campusSummary.schoolWeekDays.tuesday))  }} %
                                </td>
                                <td :class="dayInfoClass(campusSummary.schoolWeekDays.wednesday)">
                                    {{ campusSummary.schoolWeekDays.wednesday }} 
                                    | {{ calcPercentMinutesPerDay(calcTimeForDay(campusSummary.schoolWeekDays.wednesday))  }} %
                                </td>
                                <td :class="dayInfoClass(campusSummary.schoolWeekDays.thursday)">
                                    {{ campusSummary.schoolWeekDays.thursday }} 
                                    | {{ calcPercentMinutesPerDay(calcTimeForDay(campusSummary.schoolWeekDays.thursday))  }} %
                                </td>
                                <td :class="dayInfoClass(campusSummary.schoolWeekDays.friday)">
                                    {{ campusSummary.schoolWeekDays.friday }} 
                                    | {{  calcPercentMinutesPerDay(calcTimeForDay(campusSummary.schoolWeekDays.friday))  }} %
                                </td>
                                <td :class="dayInfoClass(campusSummary.schoolWeekDays.saturday)">
                                    {{ campusSummary.schoolWeekDays.saturday }} 
                                    | {{  calcPercentMinutesPerDay(calcTimeForDay(campusSummary.schoolWeekDays.saturday))  }} %
                                </td>
                            </tr>
                        </BaseTBody>
                    </template>
                </BaseTable>

            </Card>
        </div>
    </Page>
</template>

<script>
    import Card from '@/components/Card.vue'
	import BaseTable from '@/components/BaseTable.vue'
	import BaseTHead from '@/components/BaseTHead.vue'
	import BaseTBody from '@/components/BaseTBody.vue'
	import BaseTH from '@/components/BaseTH.vue'
    import TextTitle5 from '@/components/text-components/TextTitle5.vue'
    import EmptyState from "@/components/EmptyState.vue"
    import Page from '@/components/Page.vue'

    import DateFormater from '@/helpers/dateFormater.js'

    import { mapStores } from "pinia"
	import { useOrganizationInfoStore } from "@/stores/organizationInfo"

    export default {
        props: {
            campi: {
                required: true,
                default: []
            },
            summaryData: {
                required: true,
                default: { semesters: [] }
            }
        },
        data() {
            return {
                dateFormater: new DateFormater()
            }
        },
        computed: {
			...mapStores(useOrganizationInfoStore)
		},
        methods: {
            calcTimeForDay(day) {
                return day * this.organizationInfoStore.minutesPerLesson
            },
            dayInfoClass(day) {
                return this.calcTimeForDay(day) <  this.organizationInfoStore.minMinutesPerDay ? 'text-danger' : ''
            },
            calcPercentMinutesPerDay(time) {
                return ((time / this.organizationInfoStore.minMinutesPerDay) * 100).toFixed(2)
            }
        },
        components: {
            TextTitle5,
            BaseTH,
            BaseTBody,
            BaseTHead,
            BaseTable,
            Card,
            EmptyState,
            Page
        }
    }
</script>