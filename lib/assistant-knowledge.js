// Curated educational content. No market quotes, external model or live rates.
export const knowledge = [
  {
    id: "compound",
    match: /juros compostos|juros sobre juros/,
    title: "Juros compostos, sem mistério",
    text: "Juros compostos incidem sobre o valor acumulado, incluindo juros anteriores. A fórmula simplificada é valor inicial × (1 + taxa) elevado ao número de períodos.\n\nExemplo hipotético: R$ 1.000,00 a 1% ao mês, sem aportes, taxas ou impostos, seriam R$ 1.020,10 após dois meses. Isso ilustra a conta; não é uma promessa de rendimento. Em uma dívida, o mesmo mecanismo pode aumentar o custo.\n\nTaxa e prazo precisam estar na mesma unidade. Uma taxa mensal não deve ser multiplicada por 12 para obter a taxa anual efetiva.",
  },
  {
    id: "debt",
    match: /divida|endivid|renegoci|nome sujo|avalanche|bola de neve/,
    title: "Um plano para organizar dívidas",
    text: "1. Liste saldo, parcela, vencimento e CET de cada dívida. O CET inclui juros e outros custos, e ajuda a comparar propostas.\n2. Proteja as despesas essenciais e descubra quanto realmente cabe no mês.\n3. Na estratégia avalanche, priorize as maiores taxas; na bola de neve, os menores saldos. Avalie o custo e o que ajuda você a manter o plano.\n4. Negocie olhando o total a pagar, não apenas uma parcela menor. Evite trocar uma dívida por outra mais cara.\n\nO aplicativo não possui um cadastro completo de dívidas ou suas taxas. Não consigo calcular seu endividamento nem ordenar suas dívidas reais apenas pelas despesas registradas.",
  },
  {
    id: "credit",
    match: /cartao|rotativo|fatura|credito|parcelamento/,
    title: "Cartão não é renda extra",
    text: "Limite de crédito é uma possibilidade de empréstimo, não dinheiro próprio. Antes de parcelar, considere as parcelas que já comprometem os próximos meses e compare o custo total à vista e a prazo.\n\nEvite olhar só o pagamento mínimo: ele pode manter saldo sujeito a juros. Compare o CET e procure a instituição se a fatura não couber no orçamento.\n\nNo Y Finance, registros de cartão não montam uma fatura automaticamente. Escolha uma forma consistente de registrar as compras ou parcelas e não conte novamente o pagamento da fatura como uma nova despesa.",
  },
  {
    id: "rule",
    match: /50\s*[/\-]\s*30\s*[/\-]\s*20/,
    title: "A regra 50/30/20 é um ponto de partida",
    text: "A ideia é separar, como referência, 50% da renda líquida para necessidades, 30% para desejos e 20% para objetivos financeiros e redução de dívidas.\n\nNão é uma regra obrigatória: moradia, dependentes, renda variável ou dívidas podem exigir outra distribuição. O primeiro passo é conhecer seus compromissos reais. Não classifico automaticamente suas categorias como essenciais ou supérfluas, porque isso depende da sua realidade.",
  },
  {
    id: "inflation",
    match: /inflacao|poder de compra|rendimento real/,
    title: "Rentabilidade nominal e poder de compra",
    text: "Inflação é a alta do nível de preços, que reduz o poder de compra do dinheiro. Rentabilidade nominal é a variação em reais; a real desconta a inflação.\n\nA conta simplificada é (1 + rentabilidade nominal) ÷ (1 + inflação) − 1, usando o mesmo período. Num exemplo hipotético de ganho de 6% e inflação de 4%, o ganho real é aproximadamente 1,92%, antes de outros custos.\n\nNão consulto índices ou cotações atuais. Confirme dados vigentes nas fontes oficiais antes de decidir.",
  },
  {
    id: "investment",
    match:
      /invest|renda fixa|tesouro|cdb|cdi|selic|acoes|cripto|fii|fundos|rentab|rende|liquidez|fgc/,
    title: "Como avaliar um investimento",
    text: "Antes de escolher um produto, organize o orçamento, avalie dívidas caras e forme uma reserva compatível com sua rotina. Compare:\n\n• Risco: você pode perder parte do valor?\n• Liquidez: quando consegue resgatar e em quais condições?\n• Prazo: combina com a data do seu objetivo?\n• Custos e tributos: qual é o retorno líquido?\n\nNão tenho cotações, taxas atuais, sua carteira ou avaliação de perfil. Não indico um ativo específico nem prometo retornos. Os conteúdos da área Educação ajudam a entender essas diferenças.",
  },
  {
    id: "budget-concept",
    match:
      /o que (e|significa).*orcamento|como (montar|criar|fazer|organizar).*orcamento/,
    title: "Monte um orçamento que você consiga acompanhar",
    text: "Comece pelas receitas líquidas que você consegue estimar com segurança. Liste despesas fixas, variáveis, compromissos anuais e objetivos. Defina limites possíveis, não apenas os que gostaria de cumprir.\n\nFaça uma revisão semanal e ajuste quando a realidade mudar. Para renda variável, usar um mês excepcional como referência pode criar compromissos difíceis de manter.\n\nEm Configurações, você pode definir limites mensais por categoria. Os alertas avisam em 80% e 100%, sem efetuar pagamentos ou bloquear despesas.",
  },
  {
    id: "net-worth",
    match: /patrimonio|saldo bancario|saldo da.*conta|extrato|open finance/,
    title: "Saldo registrado não é saldo bancário",
    text: "Aqui, saldo do período significa receitas registradas menos despesas registradas nas datas informadas. Ele não é seu saldo bancário nem seu patrimônio líquido.\n\nNão há conexão bancária ou consulta de extratos. Patrimônio líquido exige conhecer bens, direitos e dívidas — dados que este aplicativo não reúne integralmente. Confira seus registros com o banco para evitar omissões e duplicações.",
  },
  {
    id: "needs",
    match:
      /necessidades|necessidade.*desejo|essencial|superfluo|custo de oportunidade/,
    title: "Escolhas sem culpa e com prioridades",
    text: "Necessidades sustentam sua rotina e segurança; desejos trazem conforto e satisfação. A mesma compra pode ter funções diferentes para pessoas diferentes.\n\nAntes de cortar um gasto, pergunte: ele protege minha saúde, moradia, trabalho ou estudo? Existe uma alternativa que preserve o que importa? O custo de oportunidade é o benefício da melhor alternativa de que você abre mão ao escolher gastar.\n\nPlanejar não significa eliminar todo lazer. Se a renda não cobre o básico, a solução pode exigir renegociação, apoio ou aumento de renda, e não apenas pequenos cortes.",
  },
];
