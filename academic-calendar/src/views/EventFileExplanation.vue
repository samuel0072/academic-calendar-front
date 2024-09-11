<script setup>
    import BaseUnorderedList from '@/components/BaseUnorderedList.vue'
	import BaseListItem from '@/components/BaseListItem.vue'
</script>
<template>
    <div>
        <p>
            <h1>A planilha deve conter as colunas</h1>
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
            <h1>Explicação de cada coluna</h1>
            <h5>descricao</h5>
            <span>Essa coluna deve conter o nome do evento. Deve conter no máximo 500 caracteres.</span>
            <h5>data_inicio</h5>
            <span>A data em que o evento se inicia. Deve estar no formato DD/MM/AAAA.</span>
            <h5>duracao</h5>
            <span>A quantidade de dias que o evento dura.</span>
            <h5>espaco</h5>
            <span>A quantidade de dias que o próximo evento se inicia após o fim do evento atual.</span>
            <h5>data_fim</h5>
            <span>A data em que o evento finaliza. Deve estar no formato DD/MM/AAAA.</span>
            
        </p>

        <p>
            <h1>Observações</h1>
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
            <h1>Exemplos</h1>
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