<script setup>
    import BaseUnorderedList from '@/components/BaseUnorderedList.vue'
	import BaseListItem from '@/components/BaseListItem.vue'
    import TextTitle1 from '@/components/text-components/TextTitle1.vue'
	import TextTitle5 from '@/components/text-components/TextTitle5.vue'
</script>
<template>
    <div class="container-xxl bd-gutter mt-3 my-md-4 bd-layout">
        <p>
            <TextTitle1>A planilha deve conter as colunas</TextTitle1>
            <BaseUnorderedList>
                <BaseListItem>
                    descricao
                </BaseListItem>
                <BaseListItem>
                    data_inicio
                </BaseListItem>
                <BaseListItem>
                    duracao
                </BaseListItem>
                <BaseListItem>
                    espaco
                </BaseListItem>
                <BaseListItem>
                    data_fim
                </BaseListItem>
            </BaseUnorderedList>
        </p>
        <p>
            <TextTitle1>Explicação de cada coluna</TextTitle1>
            <TextTitle5>descricao</TextTitle5>
            <span>Essa coluna deve conter o nome do evento. Deve conter no máximo 500 caracteres.</span>
            <TextTitle5>data_inicio</TextTitle5>
            <span>A data em que o evento se inicia. Deve estar no formato DD/MM/AAAA.</span>
            <TextTitle5>duracao</TextTitle5>
            <span>A quantidade de dias que o evento dura.</span>
            <TextTitle5>espaco</TextTitle5>
            <span>A quantidade de dias que o próximo evento se inicia após o fim do evento atual.</span>
            <TextTitle5>data_fim</TextTitle5>
            <span>A data em que o evento finaliza. Deve estar no formato DD/MM/AAAA.</span>
            
        </p>

        <p>
            <TextTitle1>Observações</TextTitle1>
            <BaseUnorderedList>
                <BaseListItem>
                    A data inicial da primeira linha é obrigatória.
                </BaseListItem>
                <BaseListItem>
                    Caso uma linha não possua data inicial, a linha anterior deve ter <i>espaco</i> preenchida. A data inicial vai ser calculada x dias depois da data final da linha anterior. x é a coluna espaco da linha anterior.
                </BaseListItem>
                <BaseListItem>
                    Caso uma linha não tenha data final, o preenchimento da coluna duracao é obrigatório.
                </BaseListItem>
            </BaseUnorderedList>
        </p>

        <p>
            <TextTitle1>Exemplos</TextTitle1>
            <div>
                <p>Exemplo 1:</p>
                <img src="/public/exemplo1.png" alt="tabela com 6 linhas. 1 linha é o cabeçalho. 
                Segunda linha de dados: Edital para ocupação de vagas não preenchidas, 05/06/2023, 24/06/2023
                Terceira linha de dados: Portas Abertas - Visita de estudantes do Ensino Básico, 29/05/2023, 5	
                Quarta linha de dados: Período de Autoavaliação, 29/05/2023, 21
                Quinta linha de dados: TÉRMINO DO SEMESTRE LETIVO 2022.2, 02/06/2023, 1, 3
                Sexta linha de dados: PERÍODO DE FÉRIAS - RECESSO ACADÊMICO - 14 DIAS, 14, 1
                "/>
                <p>Nesse exemplo, a data final da linha 2 será determinada pela data inicial + duração. Logo, a data final será 02/06/2023.</p>
                <p>A data inicial da linha 6 será determinada pela data final da linha 5 + espaço da linha 5. Logo, a data inicial será 05/06/2023.</p>
            </div>
        </p>

    </div>
</template>