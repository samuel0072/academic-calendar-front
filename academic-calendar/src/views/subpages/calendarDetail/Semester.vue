<template>
    <Card>
        <TextTitle5>
            Semestres
        </TextTitle5>

        <EmptyState v-if="semesters.length == 0" msg="Essa visualização só está disponível quando há semestres no calendário." />

        <BaseUnorderedList  v-if="semesters.length > 0">
            <BaseListItem v-for="semester in semesters" :key="semester.id">
                <TextTitle5>
                    <BaseAnchor :href="$router.resolve({name: 'semester-update', params: { id: semester.id }}).href">
                        {{ semester.description }}
                    </BaseAnchor>
                </TextTitle5>
                <BaseTable class="table-borderless table-sm">
                    <template v-slot:head>
                        <BaseTHead>
                            <tr>
                                <BaseTH>Início</BaseTH>
                                <BaseTH>Fim</BaseTH>
                                <BaseTH>Início das aulas</BaseTH>
                                <BaseTH>Fim das aulas</BaseTH>
                            </tr>
                        </BaseTHead>
                    </template>
                    <template  v-slot:body>
                        <BaseTBody>
                            <tr>
                                <td> {{ semester.start_date.toLocaleDateString() }} </td>
                                <td>  {{ semester.end_date.toLocaleDateString() }} </td>
                                <td>  {{ semester.lessons_start_date.toLocaleDateString() }} </td>
                                <td>  {{ semester.lessons_end_date.toLocaleDateString() }} </td>
                            </tr>
                        </BaseTBody>
                    </template>
                </BaseTable>
                
            </BaseListItem>
        </BaseUnorderedList>
    </Card>
</template>
<script>
    import Card from '@/components/Card.vue'
    import BaseUnorderedList from '@/components/BaseUnorderedList.vue'
	import BaseListItem from '@/components/BaseListItem.vue'
	import BaseTable from '@/components/BaseTable.vue'
	import BaseTHead from '@/components/BaseTHead.vue'
	import BaseTBody from '@/components/BaseTBody.vue'
	import BaseTH from '@/components/BaseTH.vue'
    import TextTitle5 from '@/components/text-components/TextTitle5.vue'
    import BaseAnchor from "@/components/BaseAnchor.vue"
    import EmptyState from "@/components/EmptyState.vue"

    export default {
        props: {
            semesters: {
                required: true,
                default: []
            }
        },
        components: {
            TextTitle5,
            BaseTH,
            BaseTBody,
            BaseTHead,
            BaseTable,
            BaseListItem,
            BaseUnorderedList,
            Card,
            BaseAnchor,
            EmptyState
        }
    }
</script>