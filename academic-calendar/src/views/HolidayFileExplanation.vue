<script setup>
    import BaseUnorderedList from '@/components/BaseUnorderedList.vue'
	import BaseListItem from '@/components/BaseListItem.vue'
    import TextTitle1 from '@/components/text-components/TextTitle1.vue'
	import TextTitle5 from '@/components/text-components/TextTitle5.vue'
    import SimpleText from '@/components/text-components/SimpleText.vue'
</script>
<template>  
    <div class="container-xxl bd-gutter mt-3 my-md-4 bd-layout">
        <p>
            <TextTitle1>A planilha deve conter as colunas</TextTitle1>
            <BaseUnorderedList>
                <BaseListItem>
                    nome
                </BaseListItem>
                <BaseListItem>
                    data
                </BaseListItem>
            </BaseUnorderedList>
            <p>
                <TextTitle1>Explicação de cada coluna</TextTitle1>
                <TextTitle5>nome</TextTitle5>
                <SimpleText>Essa coluna deve conter o nome do feriado. Deve conter no máximo 500 caracteres.</SimpleText>
                <TextTitle5>data</TextTitle5>
                <SimpleText>A data em que o feriado ocorre. Deve estar no formato DD/MM/AAAA.</SimpleText>
            </p>
        </p>
    </div>
</template>