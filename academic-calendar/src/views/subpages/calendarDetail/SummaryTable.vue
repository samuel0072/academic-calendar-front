<template>
    <Card>
        <TextTitle5>
            <span>DIAS LETIVOS – QUADRO SÍNTESE</span>
        </TextTitle5>
        <EmptyState 
            v-if="summaryData.semesters.length == 0" 
            msg="Essa visualização só está disponível quando há semestres no calendário." 
        />

        <BaseTable v-if="summaryData.semesters.length > 0">
            <template v-slot:head>
                <BaseTHead>
                    <tr>
                        <BaseTH>Local</BaseTH>
                        <BaseTH v-for="semester in summaryData.semesters" :key="semester.description">
                            {{ semester.description }}
                        </BaseTH>
                    </tr>
                </BaseTHead>
            </template>

            <template  v-slot:body>
                <BaseTBody>
                    <tr v-for="campus in campi" :key="campus.id">
                        <td> {{ campus.label }}</td>
                        <td v-for="semester in summaryData.semesters" :key="semester.description">
                            <span v-for="c in semester.campi_school_days_count" :key="semester.description + c.id">
                                <span v-if="c.id === campus.value">
                                    {{ c.school_days_count }}
                                </span>
                            </span>
                        </td>
                    </tr>
                </BaseTBody>
            </template>
        </BaseTable>
    </Card>
</template>

<script>
    import Card from '@/components/Card.vue'
	import BaseTable from '@/components/BaseTable.vue'
	import BaseTHead from '@/components/BaseTHead.vue'
	import BaseTBody from '@/components/BaseTBody.vue'
	import BaseTH from '@/components/BaseTH.vue'
    import TextTitle5 from '@/components/text-components/TextTitle5.vue'
    import EmptyState from "@/components/EmptyState.vue"

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
        components: {
            TextTitle5,
            BaseTH,
            BaseTBody,
            BaseTHead,
            BaseTable,
            Card,
            EmptyState
        }
    }
</script>