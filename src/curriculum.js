// Conteúdo educativo autoral. As simulações não representam ofertas de investimento.
const section = (title, ...paragraphs) => ({ title, paragraphs });
const question = (prompt, options, answer, explanation) => ({
  prompt,
  options,
  answer,
  explanation,
});
const practice = (
  title,
  duration,
  description,
  steps,
  reflection,
  route = null,
) => ({ title, duration, description, steps, reflection, route });
export const curriculum = [
  {
    objectives: [
      "Distinguir renda, saldo e patrimônio.",
      "Identificar o custo de uma escolha.",
      "Transformar uma intenção em uma decisão mensurável.",
    ],
    sections: [
      section(
        "Ter uma renda alta significa ter uma vida financeira saudável?",
        "Não necessariamente. Renda é o fluxo de dinheiro que entra em um período. Saldo é o que resta depois das saídas desse período. Patrimônio líquido é o valor dos bens e direitos menos as dívidas. Uma pessoa pode ganhar bem, consumir toda a renda e ainda aumentar suas dívidas. Outra, com uma renda menor, pode estar construindo uma margem de segurança.",
        "Observe três dimensões: capacidade de cumprir compromissos, proteção contra imprevistos e avanço em objetivos. Nenhum número isolado descreve toda a situação. Uma sobra positiva em um mês não elimina parcelas futuras, e um saldo negativo pontual pode decorrer de uma despesa planejada. O importante é entender a causa e a tendência.",
      ),
      section(
        "O que você deixa de fazer quando escolhe gastar?",
        "Toda decisão tem um custo de oportunidade: o melhor uso alternativo para aquele dinheiro, tempo ou esforço. Gastar R$ 200 em um passeio pode significar adiar uma contribuição de R$ 200 para uma viagem. Isso não torna o passeio errado. Torna visível a troca que está sendo feita.",
        "Decisões conscientes equilibram presente e futuro. Antes de comprar, verifique de onde virá o dinheiro, qual compromisso continuará coberto e qual objetivo será adiado. Se a renda não cobre o básico, a solução não se resume a cortar pequenos prazeres: pode exigir renegociar compromissos, buscar apoio e avaliar possibilidades de renda.",
      ),
      section(
        "Como transformar conhecimento em comportamento?",
        "Use um ciclo simples: observar, planejar, agir e revisar. Observe seus registros sem culpa; planeje uma mudança específica; teste durante um período; compare o resultado com o esperado. Troque “preciso melhorar” por “vou revisar meus gastos toda sexta-feira”. Uma ação pequena e repetível é mais útil que um plano perfeito abandonado.",
        "Separe fatos de estimativas. Registre como estimativa uma renda ainda incerta e não a use para assumir um compromisso fixo. Evite avaliar seu progresso comparando-se com pessoas que têm renda, apoio familiar e obrigações diferentes. Compare suas próprias decisões ao longo do tempo.",
      ),
    ],
    caseStudy: {
      title: "O celular que cabe na parcela, mas não no orçamento",
      text: "Lia recebe R$ 2.400 líquidos e já compromete R$ 2.150 por mês. Uma nova parcela de R$ 180 deixaria apenas R$ 70 de margem. Se ela também quer guardar R$ 150, faltariam R$ 80. Antes de comprar, precisa reduzir outro compromisso, adiar a compra ou rever a meta. O limite aprovado no cartão não cria renda.",
      calculation: "2.400 − 2.150 − 180 − 150 = −80",
    },
    mistake:
      "Confundir limite do cartão com dinheiro disponível. Crédito antecipa recursos que precisarão ser pagos; não aumenta sua renda.",
    takeaways: [
      "Renda, saldo e patrimônio são medidas diferentes.",
      "Uma escolha deve ser avaliada junto com seus compromissos futuros.",
      "O objetivo é tomar decisões melhores, não eliminar todo prazer.",
    ],
    challenge: practice(
      "Seu raio-X financeiro",
      "15 min",
      "Monte um retrato simples da sua situação. Você pode usar valores fictícios; não precisa compartilhar informações sensíveis.",
      [
        "Liste uma fonte de renda e três compromissos mensais.",
        "Calcule a margem após esses compromissos e escolha um objetivo.",
        "Defina uma pequena mudança e uma data para revisá-la.",
      ],
      "Qual escolha você fará diferente depois de enxergar essa margem?",
      "dashboard",
    ),
    quiz: [
      question(
        "Lia tem R$ 2.400 de renda, R$ 2.150 de compromissos e quer guardar R$ 150. Qual é o máximo que poderia acrescentar em despesas sem alterar esse plano?",
        ["R$ 250", "R$ 150", "R$ 100", "R$ 400"],
        2,
        "Restam R$ 250 depois dos compromissos. Reservando R$ 150 para a meta, sobram R$ 100. A parcela precisa caber depois de considerar também o objetivo.",
      ),
      question(
        "Rafael recebeu um aumento, mas suas despesas aumentaram ainda mais. O que é possível concluir?",
        [
          "O aumento de renda garante uma situação melhor.",
          "A renda isolada não prova melhora; é preciso analisar despesas, dívidas e margem.",
          "Ele deve investir antes de observar os gastos.",
          "O patrimônio dele necessariamente aumentou.",
        ],
        1,
        "Renda é apenas a entrada de recursos. Se o aumento das saídas supera o das entradas, a margem pode cair. Não é possível concluir nada sobre o patrimônio sem conhecer bens e dívidas.",
      ),
      question(
        "Você escolhe uma compra de R$ 200 e adia uma meta pelo mesmo valor. O que representa o custo de oportunidade?",
        [
          "Uma taxa obrigatória cobrada pela loja.",
          "O desconto que a loja deveria oferecer.",
          "Todo o valor da sua renda mensal.",
          "O benefício da melhor alternativa da qual você abriu mão.",
        ],
        3,
        "O custo de oportunidade é a alternativa sacrificada: neste caso, avançar na meta. Não é necessariamente uma cobrança ou um erro na decisão.",
      ),
    ],
  },
  {
    objectives: [
      "Registrar sem duplicar pagamentos.",
      "Separar despesas fixas, variáveis e eventuais.",
      "Usar frequência e categoria para localizar padrões.",
    ],
    sections: [
      section(
        "Por que o extrato sozinho nem sempre explica os gastos?",
        "O extrato mostra movimentos de uma conta, mas pode esconder a finalidade da compra, gastos em dinheiro e compromissos de outros cartões. Um controle útil reúne data, descrição, valor, categoria e forma de pagamento. A categoria responde “com o quê?”, enquanto o meio de pagamento responde “como?”. Pix não é uma categoria de consumo.",
        "Diferencie gastos fixos, que se repetem de forma previsível, de variáveis e eventuais. Fixo não significa essencial: uma assinatura é fixa, mas pode ser dispensável. Variável não significa supérfluo: medicamentos e alimentação podem ser essenciais. Essas distinções ajudam a ajustar o plano sem prejudicar necessidades importantes.",
      ),
      section(
        "Como evitar contar a fatura duas vezes?",
        "Se você registra as compras ou parcelas do cartão como despesas, o pagamento da fatura não deve ser registrado novamente como consumo. Ele apenas liquida valores já reconhecidos. Uma compra de R$ 300 em três parcelas pode ser registrada como R$ 100 em cada mês de pagamento, mantendo esse critério em todos os registros.",
        "Transferir dinheiro entre suas próprias contas também não é uma nova renda nem uma nova despesa. Reembolsos e estornos precisam ser tratados de maneira coerente com o lançamento original. O Y Finance não importa faturas nem gera parcelas automaticamente; confira manualmente cada período para não confundir dinheiro movimentado com dinheiro consumido.",
      ),
      section(
        "Que padrão merece sua atenção primeiro?",
        "Compare total, frequência e valor médio por categoria. Uma despesa frequente e pequena pode somar bastante; uma grande despesa anual pode desaparecer se você olhar apenas uma semana. Considere reservar mensalmente para gastos previsíveis, como matrícula, manutenção ou seguro.",
        "Concilie seus registros com extratos e comprovantes em uma rotina semanal. Quando houver diferença, procure um lançamento faltante, duplicado ou classificado incorretamente antes de decidir que precisa cortar gastos. Dados consistentes ajudam mais do que dezenas de categorias que você não consegue manter.",
      ),
    ],
    caseStudy: {
      title: "O café e a fatura",
      text: "Vinte cafés de R$ 8 totalizam R$ 160. Se todos foram pagos no cartão e registrados individualmente, lançar outros R$ 160 ao pagar a fatura faria o controle mostrar R$ 320 de consumo — o dobro do real. O registro deve representar uma única vez a mesma despesa.",
      calculation: "20 × 8 = 160; não 160 + 160",
    },
    mistake:
      "Registrar transferências entre contas próprias como receita. Isso infla a renda e dá uma falsa impressão de sobra.",
    takeaways: [
      "Classifique pela finalidade, não pelo meio de pagamento.",
      "Use um critério consistente para cartão e parcelas.",
      "Compare os registros com comprovantes antes de tirar conclusões.",
    ],
    challenge: practice(
      "Detetive dos seus gastos",
      "7 dias",
      "Pratique um controle consistente durante uma semana. Não é preciso gastar para realizar o desafio.",
      [
        "Registre ou simule cinco despesas com data, categoria e pagamento.",
        "Confira se há duplicidade de fatura ou transferência entre contas.",
        "Ao final da semana, identifique a categoria com maior frequência.",
      ],
      "Que padrão você percebeu e como pretende acompanhá-lo?",
      "despesas",
    ),
    quiz: [
      question(
        "Você já registrou quatro compras de R$ 50 no cartão. Ao pagar a fatura de R$ 200, como evitar duplicidade?",
        [
          "Registrar mais R$ 200 como despesa.",
          "Não registrar o pagamento como novo consumo, pois as compras já foram lançadas.",
          "Apagar todas as compras e registrar apenas uma receita.",
          "Registrar metade da fatura como gasto.",
        ],
        1,
        "O consumo total foi R$ 200. O pagamento liquida a obrigação do cartão; somá-lo às compras faria aparecer R$ 400 indevidamente.",
      ),
      question(
        "Uma assinatura mensal e um medicamento eventual são, respectivamente:",
        [
          "Variável e fixo.",
          "Sempre essenciais.",
          "Fixo e eventual; sua necessidade deve ser analisada separadamente.",
          "Receita e investimento.",
        ],
        2,
        "Frequência e necessidade são eixos diferentes. A assinatura é previsível, mas pode ser dispensável; o medicamento pode ser eventual e essencial.",
      ),
      question(
        "Uma categoria teve 12 compras de R$ 15. Qual foi seu total e por que a frequência importa?",
        [
          "R$ 180; valores pequenos recorrentes podem ter peso relevante.",
          "R$ 27; basta somar quantidade e preço.",
          "R$ 15; importa apenas o valor de cada compra.",
          "R$ 1.800; todo gasto frequente deve ser eliminado.",
        ],
        0,
        "12 × R$ 15 = R$ 180. A frequência revela o impacto acumulado, mas não determina que o gasto deva ser eliminado. É preciso considerar utilidade e orçamento.",
      ),
    ],
  },
  {
    objectives: [
      "Analisar necessidades no seu contexto.",
      "Reconhecer gatilhos de compra.",
      "Comparar alternativas sem culpa ou proibições rígidas.",
    ],
    sections: [
      section(
        "Uma mesma compra pode ser necessidade para uma pessoa e desejo para outra?",
        "Sim. Um computador pode ser indispensável para trabalhar; uma atualização de modelo, quando o atual atende bem, pode ser um desejo. A função da compra importa mais do que seu nome. Pergunte qual problema ela resolve e o que acontece se você adiar.",
        "Diferencie a necessidade da forma escolhida para atendê-la. Alimentar-se é necessário; existem várias maneiras de fazê-lo com custos diferentes. Essa análise não deve ignorar tempo disponível, saúde, acessibilidade e condições de trabalho. A alternativa mais barata nem sempre é viável ou a melhor em custo total.",
      ),
      section(
        "Como reconhecer uma decisão tomada sob pressão?",
        "Promoções com urgência, comparação social e cansaço podem reduzir o tempo dedicado a avaliar consequências. Uma técnica é criar uma pausa para compras não urgentes: salve a ideia, compare alternativas e volte depois. O período de 48 horas é uma ferramenta de reflexão, não uma garantia de que a compra será adequada.",
        "Pergunte: eu compraria sem a promoção? Tenho algo que cumpre a mesma função? O custo inclui manutenção? A compra exigirá usar dinheiro de uma conta próxima? Se a resposta mudar depois da pausa, você identificou um gatilho. Não é necessário se culpar; ajuste o ambiente, como desativar notificações promocionais.",
      ),
      section(
        "Como incluir prazer em um plano sustentável?",
        "Um orçamento que elimina permanentemente todo lazer pode ser difícil de manter. Defina um espaço compatível com sua realidade e escolha os gastos que têm mais valor para você. O objetivo é fazer escolhas deliberadas, não tratar todo desejo como falha moral.",
        "Quando o dinheiro não cobre as necessidades, reconheça a restrição estrutural. Priorize alimentação, moradia, saúde e segurança e busque alternativas de apoio e negociação. Pequenos cortes não resolvem automaticamente uma diferença grande entre renda e custo de vida. A análise deve ser realista e respeitosa com sua situação.",
      ),
    ],
    caseStudy: {
      title: "Trocar ou reparar?",
      text: "Um celular necessário para o trabalho pode ser reparado por R$ 250 ou substituído por R$ 1.800. Se o reparo for confiável e atender por mais tempo, pode preservar R$ 1.550 para outras prioridades. Se houver falhas recorrentes ou risco de perda do trabalho, a substituição merece outra avaliação. A decisão depende da função, da confiabilidade e do custo total.",
      calculation: "1.800 − 250 = 1.550 de diferença inicial",
    },
    mistake:
      "Achar que um desconto transforma automaticamente um desejo em necessidade. O desconto muda o preço, não a finalidade da compra.",
    takeaways: [
      "A necessidade depende da função e do contexto.",
      "Uma pausa ajuda a separar interesse duradouro de impulso.",
      "Prazer e planejamento podem coexistir.",
    ],
    challenge: practice(
      "A pausa consciente",
      "48 horas",
      "Escolha uma compra não urgente, real ou hipotética. O desafio não exige realizar a compra.",
      [
        "Descreva o problema que a compra resolveria.",
        "Compare duas alternativas e registre o custo total.",
        "Espere 48 horas e decida comprar, adiar ou desistir, com um motivo.",
      ],
      "O que mudou entre sua primeira vontade e a decisão final?",
    ),
    quiz: [
      question(
        "Um notebook é usado para trabalhar. Isso significa que qualquer troca por um modelo mais caro é necessária?",
        [
          "Sim, tudo relacionado ao trabalho é essencial.",
          "Não: é preciso verificar se o equipamento atual atende à função e quais alternativas existem.",
          "Sim, desde que a parcela seja pequena.",
          "Não: equipamentos nunca são necessidades.",
        ],
        1,
        "A função pode ser essencial, mas a atualização específica precisa ser justificada. Reparo, configuração e custo total também entram na comparação.",
      ),
      question(
        "Um produto custa R$ 500 e está por R$ 350, mas você não precisa dele e não havia planejado comprá-lo. Qual análise é mais adequada?",
        [
          "Você ganhou R$ 150 automaticamente.",
          "Você deve comprar para não perder dinheiro.",
          "Você ainda gastará R$ 350 e precisa avaliar o que deixará de financiar.",
          "O desconto elimina o custo de oportunidade.",
        ],
        2,
        "A diferença de preço só representa economia dentro de uma compra necessária ou planejada. Uma nova compra ainda consome R$ 350 do orçamento.",
      ),
      question(
        "Qual uso da pausa de 48 horas é mais coerente com a aula?",
        [
          "Adiar atendimento médico urgente.",
          "Garantir que toda compra após a espera será correta.",
          "Proibir permanentemente todos os desejos.",
          "Reavaliar uma compra não urgente e comparar sua utilidade com outras prioridades.",
        ],
        3,
        "A pausa é uma ferramenta para decisões não urgentes. Não substitui a análise do orçamento e não deve adiar cuidados necessários.",
      ),
    ],
  },
  {
    objectives: [
      "Planejar a partir da renda líquida.",
      "Prover gastos anuais e imprevistos.",
      "Revisar um orçamento com números realistas.",
    ],
    sections: [
      section(
        "Quais valores entram primeiro no plano?",
        "Comece pela renda líquida previsível. Em seguida, liste despesas essenciais, contratos e parcelas já assumidas. Inclua despesas variáveis usando seu histórico, não apenas o valor que gostaria de gastar. Só depois distribua o espaço restante entre objetivos e escolhas flexíveis.",
        "O orçamento precisa somar: se despesas, provisões e objetivos superam a renda, existe uma diferença a resolver. Uma categoria sem limite não torna o dinheiro infinito. Evite preencher a sobra com uma renda extra ainda não confirmada; primeiro identifique ajustes possíveis, prazos de negociação ou apoio necessário.",
      ),
      section(
        "Como lidar com despesas que não aparecem todo mês?",
        "Divida gastos anuais previsíveis pelos meses disponíveis até o vencimento. Para uma despesa de R$ 1.200 daqui a doze meses, seriam R$ 100 mensais; se faltam seis meses e você ainda não guardou nada, seriam R$ 200. Isso é uma provisão, diferente da reserva para imprevistos.",
        "Mantenha também uma margem para variações. Um orçamento que compromete cada centavo sem tolerância a pequenos desvios pode falhar no primeiro aumento de preço. Quando houver uma sobra, decida se ela deve reforçar a margem, a reserva ou outro objetivo antes de tratá-la como dinheiro livre.",
      ),
      section(
        "A regra 50/30/20 funciona para todo mundo?",
        "Ela é uma referência didática: 50% para necessidades, 30% para desejos e 20% para objetivos ou redução de dívidas. Não é uma obrigação nem uma avaliação do seu mérito. Famílias com custos essenciais altos podem precisar de proporções bem diferentes.",
        "O acompanhamento compara planejado e realizado. Se a alimentação passou do limite, investigue: o limite era baixo demais, houve aumento de preço ou faltou planejamento? Ajuste o próximo mês com base na causa. Limites por categoria no aplicativo são avisos de planejamento; eles não bloqueiam compras nem transferem dinheiro.",
      ),
    ],
    caseStudy: {
      title: "O orçamento que parecia fechar",
      text: "Com R$ 3.000 líquidos, R$ 2.200 de necessidades e R$ 400 de escolhas flexíveis, restam R$ 400. Uma provisão anual de R$ 100 reduz essa margem para R$ 300. Uma meta de R$ 350 criaria um déficit de R$ 50. É preciso ajustar uma escolha, o prazo da meta ou o valor reservado.",
      calculation: "3.000 − 2.200 − 400 − 100 − 350 = −50",
    },
    mistake:
      "Confundir um orçamento desejado com um orçamento possível. Valores devem caber na renda e refletir despesas reais.",
    takeaways: [
      "Planeje com renda líquida e previsível.",
      "Gastos anuais conhecidos pedem provisão.",
      "Percentuais são referências, não regras universais.",
    ],
    challenge: practice(
      "Seu orçamento que fecha",
      "20 min",
      "Construa um mês de planejamento usando registros reais ou um cenário fictício.",
      [
        "Separe renda líquida, despesas essenciais e escolhas flexíveis.",
        "Inclua uma provisão para uma despesa anual e calcule o saldo planejado.",
        "Defina limites para três categorias e ajuste o plano até ele caber na renda.",
      ],
      "Qual ajuste foi necessário e como você vai conferir se funcionou?",
      "configuracoes",
    ),
    quiz: [
      question(
        "Uma despesa de R$ 1.200 vence em seis meses e nada foi reservado. Quanto deve ser provisionado por mês, sem considerar rendimentos?",
        ["R$ 100", "R$ 150", "R$ 200", "R$ 1.200"],
        2,
        "R$ 1.200 ÷ 6 = R$ 200. Dividir por doze ignoraria que faltam apenas seis meses até o vencimento.",
      ),
      question(
        "As necessidades de uma família consomem 70% da renda. Como usar a regra 50/30/20?",
        [
          "Como referência adaptável, avaliando custos reais e prioridades.",
          "Forçando despesas essenciais a caber em 50%, mesmo sem alternativa.",
          "Tomando crédito para completar os 20% de poupança.",
          "Ignorando o orçamento porque a regra não foi cumprida.",
        ],
        0,
        "A regra é uma ferramenta, não uma obrigação. O plano precisa ser viável. Tomar dívida para cumprir um percentual pode piorar a situação.",
      ),
      question(
        "O gasto real em alimentação passou do limite por três meses. Qual é a melhor próxima etapa?",
        [
          "Ocultar os lançamentos excedentes.",
          "Analisar a causa e ajustar limites ou hábitos de forma realista.",
          "Repetir o mesmo limite sem análise.",
          "Registrar a diferença como receita.",
        ],
        1,
        "O desvio é informação. Pode indicar mudança de preços, limite irreal ou hábitos ajustáveis. A decisão deve partir da causa, mantendo os registros corretos.",
      ),
    ],
  },
  {
    objectives: [
      "Definir contribuições sustentáveis.",
      "Calcular a acumulação sem depender de rendimentos.",
      "Ajustar hábitos quando a renda variar.",
    ],
    sections: [
      section(
        "É melhor começar com pouco ou esperar uma grande sobra?",
        "Uma contribuição pequena que cabe no orçamento permite praticar consistência. Esperar uma sobra indefinida pode fazer o objetivo ser adiado todo mês. Primeiro confira despesas essenciais e dívidas caras; guardar dinheiro às custas de atrasar uma conta importante não é automaticamente uma melhora.",
        "Escolha um valor inicial e uma data de revisão. Você pode começar com uma contribuição simbólica, inclusive zero em um mês de dificuldade, sem transformar isso em fracasso. O plano deve servir à sua vida. Aumente a contribuição quando houver margem real, não apenas para acompanhar a meta de outra pessoa.",
      ),
      section(
        "Como tornar o hábito mais fácil de repetir?",
        "Associe a contribuição a um evento previsível, como o recebimento de renda, e deixe clara sua finalidade. Uma meta chamada “primeiros R$ 500 de reserva” é mais concreta do que “guardar alguma coisa”. Automatizar pode ajudar, desde que a data e o valor não causem falta de saldo ou uso de crédito.",
        "Diferencie decidir guardar de efetivamente separar o recurso. No Y Finance, registrar um aporte é apenas um controle: o aplicativo não transfere dinheiro entre contas. Se você usa uma conta separada, confira a movimentação real e depois atualize a meta, evitando registrar duas vezes a mesma contribuição.",
      ),
      section(
        "Como adaptar a contribuição à renda variável?",
        "Um percentual pode acompanhar o tamanho das entradas, mas as despesas básicas continuam precisando de cobertura. Uma opção é definir uma base conservadora e reservar parte dos meses melhores. Outra é usar faixas: uma contribuição pequena em meses fracos e maior quando a margem permitir.",
        "Faça projeções sem prometer rentabilidade. R$ 60 por mês durante dez meses somam R$ 600 antes de rendimentos. Se o objetivo exige R$ 1.000, faltam R$ 400: será preciso ampliar o prazo, reduzir o objetivo ou aumentar contribuições. Não use retornos incertos para esconder essa diferença.",
      ),
    ],
    caseStudy: {
      title: "O poder da contribuição repetida",
      text: "Caio quer juntar R$ 600 em dez meses. Sem considerar rendimentos, a contribuição necessária é R$ 60 mensais. Se em um mês ele só consegue R$ 30, pode revisar os meses seguintes ou acrescentar tempo. O objetivo é manter um plano honesto, não registrar uma quantia que não foi separada.",
      calculation: "600 ÷ 10 = 60 por mês",
    },
    mistake:
      "Automatizar um aporte maior do que a margem disponível e acabar entrando no cheque especial para pagar contas.",
    takeaways: [
      "Regularidade sustentável vale mais que promessas irreais.",
      "Registrar um aporte não movimenta dinheiro.",
      "Ajustar o plano é melhor do que esconder um desvio.",
    ],
    challenge: practice(
      "Seu primeiro aporte consciente",
      "10 min",
      "Escolha uma contribuição que não prejudique contas essenciais. Uma simulação também vale.",
      [
        "Defina um objetivo pequeno e um prazo.",
        "Calcule a contribuição e confirme que ela cabe no orçamento.",
        "Separe o valor, ou simule a separação, e registre seu plano de repetição.",
      ],
      "Que evento ou lembrete ajudará você a repetir esse hábito?",
      "metas",
    ),
    quiz: [
      question(
        "Quanto é preciso guardar por mês para juntar R$ 900 em 15 meses, sem rendimentos e começando do zero?",
        ["R$ 60", "R$ 90", "R$ 135", "R$ 15"],
        0,
        "R$ 900 ÷ 15 = R$ 60 por mês. Essa referência considera quinze contribuições iguais, sem saldo inicial, custos ou rendimentos. Se o valor não couber no orçamento, ajuste o prazo ou o objetivo em vez de presumir uma rentabilidade incerta.",
      ),
      question(
        "O que acontece quando você registra um aporte em uma meta no Y Finance?",
        [
          "O aplicativo transfere automaticamente o dinheiro do banco.",
          "O saldo disponível é descontado automaticamente.",
          "O controle da meta é atualizado, sem transferência bancária automática.",
          "Uma nova receita é criada.",
        ],
        2,
        "O aporte é um registro independente. A movimentação real, se houver, precisa ser feita por você e conferida separadamente.",
      ),
      question(
        "Sua renda caiu e manter o aporte faria uma conta essencial atrasar. Qual atitude é mais coerente?",
        [
          "Manter a contribuição a qualquer custo.",
          "Usar crédito caro só para cumprir a meta.",
          "Apagar a conta do orçamento.",
          "Rever a contribuição e o prazo, preservando as necessidades básicas.",
        ],
        3,
        "O plano deve se adaptar à capacidade real. Um aporte que provoca dívida cara ou compromete necessidades pode piorar a situação financeira.",
      ),
    ],
  },
  {
    objectives: [
      "Distinguir faturamento, lucro e renda pessoal.",
      "Planejar com uma base conservadora.",
      "Separar entradas recorrentes de extraordinárias.",
    ],
    sections: [
      section(
        "Quanto do dinheiro recebido está realmente disponível?",
        "O salário bruto não é igual ao líquido disponível depois dos descontos. Para quem trabalha por conta própria, o faturamento ainda precisa cobrir custos do serviço, despesas do negócio, tributos e obrigações futuras. A retirada pessoal deve considerar essas parcelas, em vez de usar todo pagamento recebido como renda para consumo.",
        "Não conte empréstimos, transferências entre contas próprias ou reembolsos como renda nova sem analisar sua natureza. Um empréstimo aumenta o dinheiro na conta, mas cria uma dívida. Um reembolso pode apenas compensar uma despesa antecipada. A classificação deve refletir o resultado econômico, não apenas a entrada no extrato.",
      ),
      section(
        "Como planejar quando o valor muda todo mês?",
        "Observe uma série de meses e identifique o que é recorrente, sazonal e excepcional. A média é útil, mas pode ser inflada por um mês extraordinário. Compare-a com os meses mais fracos e escolha uma base prudente para compromissos fixos. Não há uma fórmula única: quanto maior a incerteza, maior a importância da margem e da reserva.",
        "Nos meses melhores, parte da sobra pode compensar meses fracos e despesas periódicas. Separe o planejamento do negócio do pessoal, mesmo que use uma planilha simples. Essa distinção ajuda a perceber se o serviço está remunerando seu trabalho ou apenas movimentando dinheiro.",
      ),
      section(
        "O que fazer com uma entrada extraordinária?",
        "Bonificações, presentes e vendas eventuais não devem sustentar automaticamente novas parcelas recorrentes. Avalie obrigações vencidas, provisões, reserva e objetivos antes de transformar a entrada pontual em aumento permanente do padrão de vida.",
        "Se você vende um bem, o dinheiro recebido também não prova que ficou mais rico: o bem saiu do patrimônio. Para acompanhar a renda, registre fontes com descrições claras. O aplicativo não calcula tributos nem custos do negócio automaticamente; esses valores precisam ser considerados no seu planejamento.",
      ),
    ],
    caseStudy: {
      title: "Faturar não é poder gastar tudo",
      text: "Um trabalho rende R$ 4.000. Há R$ 1.200 de materiais e serviços, R$ 400 de tributos estimados e R$ 300 reservados para custos futuros do negócio. A quantia restante para avaliar uma retirada é R$ 2.100, não R$ 4.000. Os valores tributários são apenas um exemplo hipotético.",
      calculation: "4.000 − 1.200 − 400 − 300 = 2.100",
    },
    mistake:
      "Criar parcelas fixas com base no melhor mês do ano. A renda precisa sustentar os compromissos também nos períodos fracos.",
    takeaways: [
      "Entrada na conta não é sempre renda nova.",
      "Faturamento precisa cobrir custos e obrigações.",
      "Compromissos recorrentes pedem uma base previsível.",
    ],
    challenge: practice(
      "Sua renda sem ilusões",
      "20 min",
      "Analise três meses de entradas ou construa um cenário fictício.",
      [
        "Separe entradas recorrentes, extraordinárias e transferências.",
        "Desconte custos e obrigações para estimar a renda disponível.",
        "Escolha uma base conservadora para o próximo orçamento e explique sua escolha.",
      ],
      "Qual entrada você costumava considerar disponível antes de analisar sua origem?",
      "receitas",
    ),
    quiz: [
      question(
        "Um serviço gera R$ 3.500, com R$ 900 de custos e R$ 400 de obrigações estimadas. Quanto resta antes de outras reservas e retiradas?",
        ["R$ 3.500", "R$ 3.100", "R$ 2.600", "R$ 2.200"],
        3,
        "3.500 − 900 − 400 = R$ 2.200. Faturamento não equivale ao dinheiro pessoal disponível.",
      ),
      question(
        "Você recebe uma bonificação única de R$ 2.000. Qual decisão exige mais cuidado?",
        [
          "Usar parte para uma obrigação já planejada.",
          "Assumir uma nova parcela mensal contando com essa bonificação todos os meses.",
          "Reforçar uma reserva.",
          "Comparar prioridades antes de gastar.",
        ],
        1,
        "Uma entrada extraordinária não garante renda recorrente. A parcela continuará existindo quando a bonificação acabar.",
      ),
      question(
        "Por que a média de renda dos últimos meses pode não ser uma boa base isolada para despesas fixas?",
        [
          "Porque a média sempre é menor que todos os meses.",
          "Porque renda variável não pode ser planejada.",
          "Porque um mês excepcional pode elevar a média e esconder meses fracos.",
          "Porque só o último recebimento deve importar.",
        ],
        2,
        "A média resume a série, mas não mostra sua dispersão e sazonalidade. Compromissos fixos pedem atenção à previsibilidade, não apenas ao valor médio.",
      ),
    ],
  },
  {
    objectives: [
      "Criar revisões semanais e mensais.",
      "Distinguir saldo aparente de compromissos futuros.",
      "Transformar desvios em ajustes de rotina.",
    ],
    sections: [
      section(
        "O que revisar em quinze minutos por semana?",
        "Comece conciliando registros com extratos e comprovantes. Depois confira vencimentos dos próximos dias, parcelas já assumidas e limites de categoria. Termine escolhendo uma ação concreta: corrigir uma duplicidade, reservar para uma conta ou renegociar um vencimento. Uma rotina curta precisa ter uma conclusão prática.",
        "Escolha um horário realista e reduza obstáculos. Separe comprovantes durante a semana ou use descrições que você consiga reconhecer depois. Se não conseguiu revisar no dia escolhido, retome no próximo intervalo possível; tentar reconstruir tudo com perfeição antes de continuar pode levar ao abandono.",
      ),
      section(
        "Por que saldo na conta não é o mesmo que dinheiro livre?",
        "Um saldo positivo pode estar comprometido com aluguel, fatura ou outra despesa próxima. O planejamento de caixa olha também as datas: uma receita prevista para o fim do mês não paga automaticamente uma conta que vence amanhã. Alinhar vencimentos à renda pode reduzir pressão, quando houver essa possibilidade.",
        "O saldo mensal do Y Finance é receitas menos despesas registradas no período, não uma conciliação bancária automática. Por isso, confira recursos já reservados e obrigações que ainda não foram lançadas. Uma projeção de caixa complementa o resumo mensal, principalmente com renda irregular.",
      ),
      section(
        "Como fechar o mês sem transformar tudo em julgamento?",
        "Compare planejado e realizado por categoria e identifique as diferenças relevantes. Classifique a causa: estimativa incorreta, aumento de preço, gasto excepcional ou hábito que mudou. Escolha poucas ações para o mês seguinte, em vez de redesenhar todo o orçamento a cada desvio.",
        "Registre uma decisão e uma data para avaliá-la. Por exemplo: cancelar uma assinatura pouco usada e verificar no próximo extrato se a cobrança parou. Essa verificação fecha o ciclo entre intenção e resultado. Uma rotina financeira serve para reduzir incerteza, não para exigir que você pense em dinheiro o dia inteiro.",
      ),
    ],
    caseStudy: {
      title: "O saldo que já tinha destino",
      text: "Bia vê R$ 900 na conta. Há R$ 650 de aluguel e R$ 180 de transporte previstos antes da próxima renda. Sua margem aparente para outras decisões é R$ 70, desconsiderando outros compromissos. Sem conferir o calendário, uma compra de R$ 200 pareceria possível, mas faltariam R$ 130.",
      calculation: "900 − 650 − 180 = 70",
    },
    mistake:
      "Revisar apenas depois de um problema. A conferência preventiva ajuda a perceber desvios antes do vencimento das contas.",
    takeaways: [
      "Uma rotina precisa terminar com uma ação clara.",
      "Datas de entrada e saída importam.",
      "Revisar significa aprender e ajustar, não culpar.",
    ],
    challenge: practice(
      "Seu encontro semanal com o dinheiro",
      "15 min",
      "Faça uma revisão guiada e escolha quando repetirá a rotina.",
      [
        "Confira cinco lançamentos com seus registros ou exemplos.",
        "Liste três compromissos antes da próxima entrada de renda.",
        "Escolha uma correção e anote o dia da próxima revisão.",
      ],
      "Qual foi sua decisão concreta e quando você vai verificar o resultado?",
      "dashboard",
    ),
    quiz: [
      question(
        "Há R$ 900 na conta e R$ 830 de contas antes da próxima renda. Qual margem deve orientar uma compra adicional, sem outros compromissos?",
        ["R$ 900", "R$ 830", "R$ 70", "R$ 1.730"],
        2,
        "900 − 830 = R$ 70. O saldo visível já tem destinos; ignorá-los pode produzir falta de caixa.",
      ),
      question(
        "Uma receita chegará depois do vencimento de uma conta. O total mensal positivo resolve sozinho o problema?",
        [
          "Não; é preciso avaliar datas e recursos disponíveis antes do vencimento.",
          "Sim; saldo mensal positivo dispensa calendário.",
          "Sim; basta lançar a receita com data anterior.",
          "Não; toda renda futura deve ser descartada.",
        ],
        0,
        "O fluxo no tempo importa. Antecipar a data no registro não antecipa o dinheiro real. Planeje alternativas viáveis sem falsificar lançamentos.",
      ),
      question(
        "Qual é o fechamento mais útil para uma revisão semanal?",
        [
          "Comparar-se com pessoas de renda maior.",
          "Escolher uma ação específica e uma data para verificar o resultado.",
          "Excluir todo gasto que excedeu o plano.",
          "Esperar que o próximo mês se resolva sozinho.",
        ],
        1,
        "Uma ação acompanhada transforma o diagnóstico em melhoria. Comparações e alterações artificiais nos registros não resolvem a causa do problema.",
      ),
    ],
  },
  {
    objectives: [
      "Ler custo, prazo e CET em conjunto.",
      "Comparar estratégias de pagamento.",
      "Avaliar renegociação sem comprometer o básico.",
    ],
    sections: [
      section(
        "Por que uma parcela menor pode sair mais cara?",
        "O valor da parcela informa a pressão mensal, mas não o custo completo. Um prazo maior pode reduzir cada pagamento e aumentar o total pago. Compare entrada, quantidade de parcelas, valor de cada uma, tarifas, seguros e CET. O custo efetivo total reúne juros e encargos, permitindo uma comparação mais ampla quando as condições são equivalentes.",
        "Liste também vencimentos, atrasos, garantias e consequências do não pagamento. Dívidas com risco sobre um bem essencial, por exemplo, podem exigir atenção diferente de uma comparação puramente matemática. Preserve necessidades básicas e evite aceitar uma prestação que só cabe em um mês excepcionalmente favorável.",
      ),
      section(
        "Qual dívida pagar primeiro?",
        "Na estratégia conhecida como avalanche, a prioridade costuma ser a dívida com maior custo efetivo, mantendo os pagamentos necessários das demais. Isso tende a reduzir encargos quando as condições são comparáveis. Na bola de neve, prioriza-se o menor saldo para gerar conquistas rápidas; a motivação pode melhorar, mas o custo total pode ser maior.",
        "Nenhuma estratégia dispensa avaliar urgências, contratos e capacidade de pagamento. Se a renda não cobre necessidades e compromissos, procure negociação e orientação confiável, como canais de defesa do consumidor. Trocar dívida cara por uma mais barata só ajuda quando o custo total, as condições e o risco realmente melhoram.",
      ),
      section(
        "Como avaliar uma proposta de renegociação?",
        "Peça as condições por escrito e compare o saldo atual com o novo total. Confira o CET, prazo, entrada, multas, garantias e regras de quitação antecipada. Não analise apenas “quanto cabe na parcela”. Um orçamento que já tem déficit dificilmente sustentará um novo contrato sem ajustes.",
        "Cuidado com propostas que exigem um pagamento antecipado para liberar empréstimo ou que chegam por contatos não verificados. Confirme a identidade do credor por canal independente. Depois da renegociação, evite usar o limite liberado para criar uma segunda dívida e registre o novo compromisso no planejamento.",
      ),
    ],
    caseStudy: {
      title: "A parcela menor e o total maior",
      text: "Duas propostas sem entrada: A tem 10 parcelas de R$ 220; B tem 18 de R$ 150. A soma R$ 2.200, enquanto B soma R$ 2.700. B alivia o mês, mas custa R$ 500 a mais. Ainda é necessário conferir CET e todas as condições; a escolha precisa ser sustentável, não apenas parecer barata.",
      calculation: "10 × 220 = 2.200 | 18 × 150 = 2.700",
    },
    mistake:
      "Olhar apenas a parcela e ignorar prazo, encargos e custo total da renegociação.",
    takeaways: [
      "Compare parcela, total, prazo e CET.",
      "Estratégias matemáticas precisam respeitar necessidades e riscos.",
      "Renegociar não resolve o hábito de usar novamente o limite liberado.",
    ],
    challenge: practice(
      "Compare antes de renegociar",
      "20 min",
      "Use propostas hipotéticas. Você não precisa contratar crédito para concluir o desafio.",
      [
        "Monte duas propostas com quantidade e valor de parcelas.",
        "Calcule o total e liste quais informações ainda faltam, incluindo CET.",
        "Escolha a proposta mais adequada ao cenário e explique o compromisso mensal.",
      ],
      "Qual informação poderia fazer você mudar de decisão?",
    ),
    quiz: [
      question(
        "Sem entrada ou taxas extras, qual proposta tem menor soma de pagamentos: 10 × R$ 220 ou 18 × R$ 150?",
        [
          "São iguais.",
          "18 × R$ 150, porque a parcela é menor.",
          "10 × R$ 220, com R$ 500 a menos no total.",
          "Não é possível calcular a soma.",
        ],
        2,
        "As somas são R$ 2.200 e R$ 2.700. A diferença é R$ 500. Isso não substitui a análise de CET, prazo, condições e capacidade de pagamento.",
      ),
      question(
        "O que o CET ajuda a comparar?",
        [
          "Apenas o valor do bem comprado.",
          "Juros e outros encargos da operação de crédito.",
          "Somente a quantidade de parcelas.",
          "O limite disponível no cartão.",
        ],
        1,
        "O CET reúne o custo da operação, incluindo juros e encargos aplicáveis. Compare propostas equivalentes e confira também valores e prazos.",
      ),
      question(
        "Na estratégia avalanche, qual costuma ser a prioridade, mantendo as demais obrigações e considerando situações comparáveis?",
        [
          "A dívida de menor custo, sempre.",
          "Qualquer dívida com a maior propaganda de desconto.",
          "A dívida de menor saldo, sem avaliar juros.",
          "A dívida com maior custo efetivo.",
        ],
        3,
        "Priorizar o custo mais alto tende a reduzir encargos. Mas urgência, garantias e necessidades básicas também precisam ser avaliadas; não se trata de uma regra cega.",
      ),
    ],
  },
  {
    objectives: [
      "Separar emergência de despesas previsíveis.",
      "Estimar uma reserva adequada ao contexto.",
      "Priorizar acesso e segurança.",
    ],
    sections: [
      section(
        "O que é emergência e o que deve ser provisionado?",
        "Reserva de emergência protege contra eventos relevantes e incertos, como perda de renda ou uma despesa essencial inesperada. Uma conta anual conhecida não é surpresa apenas porque não ocorre todo mês. Seguro, matrícula e manutenção previsível precisam de provisão própria.",
        "Criar essa separação evita que você use a reserva repetidamente para obrigações esperadas e conclua que nunca consegue mantê-la. Defina critérios de uso: o gasto é necessário, não pode esperar e não estava razoavelmente previsto? Depois de usar a reserva em uma emergência real, planeje a reposição sem culpa.",
      ),
      section(
        "Como estimar o tamanho sem seguir uma fórmula cega?",
        "Uma referência comum é de três a seis meses de despesas essenciais, mas o intervalo não serve igualmente para todos. Renda variável, dependentes, pouca rede de apoio e maior dificuldade de recolocação podem justificar uma margem maior. Avalie gastos essenciais reais, e não somente o valor do salário.",
        "Construa em etapas: primeiro uma pequena proteção, depois um mês de despesas, e então um objetivo mais amplo. Se você tem dívidas caras, considere a interação entre reduzir encargos e manter uma margem mínima para não voltar ao crédito no primeiro imprevisto. Essa decisão depende do contexto.",
      ),
      section(
        "Por que liquidez importa mais que uma promessa de retorno?",
        "Uma reserva precisa estar acessível quando o evento acontece. Confira prazo de resgate, dias e horários de liquidação, risco de crédito, oscilação de preço e condições do produto. “Liquidez diária” não significa necessariamente dinheiro disponível instantaneamente em qualquer horário.",
        "Evite depender de ativos muito voláteis ou bloqueados até um vencimento distante. A função da reserva é proteção, não maximizar ganhos. Não confunda eventual garantia com ausência de risco ou disponibilidade imediata; mecanismos de proteção têm regras e podem exigir tempo para ressarcimento.",
      ),
    ],
    caseStudy: {
      title: "Uma meta em degraus",
      text: "Com despesas essenciais de R$ 2.000, seis meses correspondem a R$ 12.000. Se a contribuição possível é R$ 200, alcançar o total do zero levaria 60 meses sem rendimentos. Isso não torna o esforço inútil: o primeiro marco de R$ 1.000 pode ser alcançado em cinco meses, já reduzindo a dependência de crédito para certos imprevistos.",
      calculation: "2.000 × 6 = 12.000 | 1.000 ÷ 200 = 5 meses",
    },
    mistake:
      "Buscar o maior retorno para a reserva e descobrir, na emergência, que o dinheiro está bloqueado ou sujeito a perda relevante.",
    takeaways: [
      "Emergência é diferente de uma conta anual conhecida.",
      "A meta depende de despesas essenciais e vulnerabilidades.",
      "Liquidez e baixo risco sustentam a função de proteção.",
    ],
    challenge: practice(
      "Sua reserva em três etapas",
      "20 min",
      "Calcule uma referência e um primeiro marco alcançável, sem contratar nenhum produto.",
      [
        "Some suas despesas essenciais mensais, reais ou simuladas.",
        "Escolha um número de meses e explique por que ele faz sentido no cenário.",
        "Defina um primeiro marco e uma contribuição sustentável para uma meta.",
      ],
      "Em que situações você usaria a reserva e em quais usaria uma provisão?",
      "metas",
    ),
    quiz: [
      question(
        "Despesas essenciais de R$ 1.800 por mês e uma referência de quatro meses produzem qual objetivo?",
        ["R$ 7.200", "R$ 4.500", "R$ 1.804", "R$ 18.000"],
        0,
        "R$ 1.800 × 4 = R$ 7.200. O número de meses ainda deve ser escolhido conforme a situação pessoal.",
      ),
      question(
        "Qual situação pede principalmente uma provisão, e não ser tratada como surpresa?",
        [
          "Perda inesperada da renda.",
          "Um reparo essencial totalmente imprevisível.",
          "Uma despesa anual conhecida com vencimento marcado.",
          "Uma urgência médica não prevista.",
        ],
        2,
        "Despesas conhecidas podem ser planejadas antes do vencimento. Separá-las da reserva evita consumir a proteção em gastos previsíveis.",
      ),
      question(
        "Para avaliar um produto destinado à reserva, qual pergunta é mais importante?",
        [
          "Qual promete o maior retorno, independentemente do risco?",
          "Quando e em quais condições consigo acessar o dinheiro, e que riscos existem?",
          "Qual tem a campanha publicitária mais atraente?",
          "Como posso bloquear o dinheiro pelo maior prazo possível?",
        ],
        1,
        "A reserva precisa cumprir sua função de acesso e proteção. Taxa anunciada sozinha não informa liquidez, oscilação ou risco de crédito.",
      ),
    ],
  },
  {
    objectives: [
      "Definir valor, prazo e prioridade.",
      "Calcular a contribuição sobre o valor restante.",
      "Revisar metas diante de mudanças.",
    ],
    sections: [
      section(
        "O que transforma um desejo em uma meta?",
        "Uma meta responde o que você quer, quanto custa, até quando deseja alcançar e por que isso importa. Inclua custos associados: uma viagem pode exigir transporte, hospedagem, alimentação e margem para imprevistos. O preço principal nem sempre é o objetivo completo.",
        "Diferencie prioridade e urgência. Um desejo pode parecer urgente por causa de uma promoção, mas ser menos importante que uma obrigação próxima. Evite abrir tantas metas simultâneas que nenhuma receba uma contribuição significativa. Escolha uma ordem de avanço compatível com sua capacidade.",
      ),
      section(
        "Como calcular o valor que precisa guardar?",
        "Subtraia do objetivo o valor já acumulado. Divida o restante pelo número de meses disponíveis. Esse cálculo simples, sem rendimentos, cria uma referência de esforço. Se o resultado não cabe no orçamento, ajuste uma das variáveis: custo, prazo ou contribuição.",
        "Não conte com retornos elevados para fechar uma conta que não funciona. Metas próximas devem priorizar preservação e acesso ao dinheiro. As estimativas mensais do aplicativo são aproximações; confira a data real, custos atualizados e quando cada contribuição poderá ocorrer.",
      ),
      section(
        "Como revisar sem abandonar o objetivo?",
        "Revisite o preço e o prazo periodicamente. Mudanças de renda, inflação e prioridades podem exigir adaptações. Um prazo revisado com honestidade é melhor do que continuar mostrando uma meta que já não cabe na vida. Preserve uma margem para despesas que não estavam na primeira estimativa.",
        "Mantenha o registro alinhado ao que foi realmente separado. A meta no Y Finance é um controle independente do saldo de receitas e despesas. Evite considerar o mesmo dinheiro simultaneamente como disponível para consumo e reservado para vários objetivos.",
      ),
    ],
    caseStudy: {
      title: "A viagem com parte do valor já guardado",
      text: "A viagem custa R$ 3.000 e você já reservou R$ 600. Faltam R$ 2.400. Em oito meses, seriam R$ 300 por mês, sem rendimentos. Se a margem disponível é R$ 200, o prazo necessário para o restante passa a doze meses, mantendo o mesmo custo.",
      calculation: "(3.000 − 600) ÷ 8 = 300 | 2.400 ÷ 200 = 12 meses",
    },
    mistake:
      "Dividir o objetivo completo pelo prazo e esquecer o dinheiro já acumulado — ou considerar uma mesma quantia em duas metas diferentes.",
    takeaways: [
      "O cálculo usa o valor que falta, não sempre o total.",
      "Custo, prazo e contribuição precisam ser compatíveis.",
      "Revisar uma meta não é fracassar.",
    ],
    challenge: practice(
      "Do plano à meta possível",
      "15 min",
      "Crie ou revise uma meta; pode ser um objetivo hipotético.",
      [
        "Defina objetivo total, valor acumulado e prazo.",
        "Calcule quanto falta e a contribuição mensal necessária.",
        "Compare com a margem do orçamento e ajuste uma variável se preciso.",
      ],
      "Qual variável você ajustou para tornar a meta viável?",
      "metas",
    ),
    quiz: [
      question(
        "Uma meta custa R$ 4.000, já tem R$ 1.000 guardados e faltam dez meses. Qual contribuição mensal é necessária, sem rendimentos?",
        ["R$ 400", "R$ 100", "R$ 300", "R$ 500"],
        2,
        "(4.000 − 1.000) ÷ 10 = R$ 300. A contribuição deve cobrir o valor restante.",
      ),
      question(
        "A contribuição calculada não cabe na renda. Qual caminho é mais realista?",
        [
          "Presumir rentabilidade suficiente para cobrir qualquer diferença.",
          "Rever custo, prazo ou contribuição, preservando necessidades.",
          "Registrar aportes que não foram realizados.",
          "Usar o mesmo dinheiro para concluir duas metas.",
        ],
        1,
        "Uma meta viável precisa de números compatíveis. Rendimentos incertos e registros artificiais não aumentam os recursos disponíveis.",
      ),
      question(
        "Por que atualizar o preço da meta ao longo do tempo?",
        [
          "Porque a data inicial nunca importa.",
          "Porque toda meta deve ficar mais cara.",
          "Porque o aplicativo garante o preço futuro.",
          "Porque custos e condições podem mudar, alterando a contribuição necessária.",
        ],
        3,
        "A estimativa inicial pode mudar por preços, renda ou escopo. Revisar reduz o risco de chegar ao prazo com um valor insuficiente.",
      ),
    ],
  },
  {
    objectives: [
      "Comparar custo total, não só preço anunciado.",
      "Analisar parcelamento e compromissos futuros.",
      "Reconhecer promoções que ampliam o gasto.",
    ],
    sections: [
      section(
        "Qual é o preço real de uma compra?",
        "Some compra, frete, instalação, manutenção, consumíveis e eventual assinatura necessária. Para um bem de uso contínuo, considere vida útil e frequência de uso. Um produto barato que exige reposição frequente pode custar mais ao longo do tempo do que uma alternativa mais durável.",
        "A comparação também envolve utilidade. Uma promoção de “leve três” pode elevar o gasto se você precisa apenas de uma unidade, se o produto vence ou se o dinheiro tem outra prioridade. Comprar mais por um preço unitário menor não é automaticamente economizar no total.",
      ),
      section(
        "Parcelar sem juros significa que não existe custo?",
        "Mesmo sem juros explícitos, a parcela compromete renda futura. Compare o preço total parcelado com o preço à vista e confira se existe desconto real. Não use toda a reserva para obter um desconto pequeno quando isso deixaria você sem margem para uma emergência.",
        "Some parcelas de diferentes compras. Uma prestação de R$ 80 parece pequena isoladamente, mas cinco delas representam R$ 400 por mês. A pergunta não é só “posso pagar esta parcela?”, mas “consigo pagar todos os compromissos no período em que eles coexistem?”.",
      ),
      section(
        "Como reduzir gastos sem decidir no impulso inverso?",
        "Comece identificando baixo valor percebido: assinaturas pouco usadas, taxas evitáveis ou compras repetidas por falta de planejamento. Antes de cancelar algo essencial ou trocar por uma alternativa pior, avalie o efeito sobre saúde, trabalho e tempo.",
        "Faça listas de compras, compare opções equivalentes e confira condições antes de finalizar. Ao cancelar um serviço, guarde a confirmação e verifique se a cobrança parou. Consumo consciente inclui esse acompanhamento: a intenção de economizar só vira resultado quando o gasto de fato muda.",
      ),
    ],
    caseStudy: {
      title: "A soma das parcelas pequenas",
      text: "Cinco compras de R$ 80 mensais comprometem R$ 400. Se a renda líquida é R$ 2.000, isso equivale a 20% dela, antes de aluguel e alimentação. Uma sexta parcela de R$ 80 elevaria o compromisso para R$ 480, ou 24%. Nenhuma parcela deve ser analisada isoladamente.",
      calculation: "5 × 80 = 400 | 400 ÷ 2.000 = 20%",
    },
    mistake:
      "Considerar economia apenas o desconto anunciado e esquecer que a compra pode ser desnecessária ou gerar novos custos.",
    takeaways: [
      "Custo total inclui uso e manutenção.",
      "Parcelamento compromete renda futura mesmo sem juros explícitos.",
      "Confirme se cancelamentos e mudanças produziram resultado.",
    ],
    challenge: practice(
      "Auditoria de uma escolha",
      "20 min",
      "Escolha uma assinatura, um produto ou uma compra hipotética.",
      [
        "Compare duas alternativas pelo custo total, incluindo despesas associadas.",
        "Verifique o efeito de parcelas simultâneas no orçamento.",
        "Decida manter, substituir, adiar ou cancelar e registre sua justificativa.",
      ],
      "Quanto custa a alternativa escolhida e qual necessidade ela atende?",
    ),
    quiz: [
      question(
        "Seis parcelas mensais simultâneas de R$ 75 representam quanto do mês?",
        ["R$ 75", "R$ 450", "R$ 81", "R$ 375"],
        1,
        "6 × R$ 75 = R$ 450 por mês. A capacidade de pagamento depende da soma dos compromissos, não de cada parcela isolada.",
      ),
      question(
        "Uma impressora custa menos, mas exige insumos caros e frequentes. O que deve ser comparado?",
        [
          "Só o preço na etiqueta.",
          "Só a marca.",
          "O custo de aquisição e de uso durante um período comparável.",
          "Somente o desconto oferecido.",
        ],
        2,
        "Consumíveis, manutenção e frequência de uso afetam o custo total. Opções devem ser comparadas considerando necessidades equivalentes.",
      ),
      question(
        "Uma oferta “leve três” reduz o preço unitário, mas você só precisa de uma unidade. Qual é a conclusão correta?",
        [
          "O total gasto pode aumentar; é preciso avaliar necessidade, validade e prioridades.",
          "A compra é sempre vantajosa.",
          "O desconto cria renda nova.",
          "Comprar menos sempre custa mais no total.",
        ],
        0,
        "Preço unitário menor não garante menor gasto total nem melhor uso do dinheiro. Unidades sem utilidade ou que estragam podem representar desperdício.",
      ),
    ],
  },
  {
    objectives: [
      "Relacionar objetivo e horizonte de investimento.",
      "Avaliar dívidas e reserva antes da rentabilidade.",
      "Distinguir capacidade de perda de vontade de arriscar.",
    ],
    sections: [
      section(
        "Qual problema você quer resolver investindo?",
        "O objetivo vem antes do produto. Dinheiro para uma conta em dois meses tem exigências diferentes de recursos destinados a um plano de muitos anos. Defina valor, prazo e necessidade de acesso. Sem essa referência, uma taxa atraente pode levar você a um produto incompatível com sua vida.",
        "Investir não substitui gerar margem no orçamento. Se as despesas excedem a renda, o primeiro passo é entender a diferença. Dívidas de custo elevado também merecem atenção: um rendimento incerto não compensa automaticamente um encargo alto e contratualmente devido.",
      ),
      section(
        "Você pode suportar uma perda ou apenas acha que conseguiria?",
        "Tolerância ao risco é como você reage à incerteza; capacidade de risco é quanto uma perda afetaria necessidades e compromissos. Uma pessoa pode gostar de risco, mas não ter recursos para suportá-lo. Considere renda, dependentes, reserva, horizonte e obrigações.",
        "Experiência e compreensão também importam. Antes de investir, explique com suas próprias palavras como o produto rende, em quais condições pode perder valor e como resgatar. Se essas respostas não estão claras, estudar mais é uma decisão válida. Pressa para “não ficar de fora” é um sinal para desacelerar.",
      ),
      section(
        "Que critérios devem vir antes da taxa anunciada?",
        "Examine o emissor, risco de crédito, liquidez, vencimento, oscilação de preço, custos, tributação e eventuais mecanismos de proteção. Compare resultados líquidos em cenários compatíveis, sem presumir que o retorno passado se repetirá.",
        "Use fontes oficiais para verificar a instituição e os documentos do produto. Não existe carteira adequada para todas as pessoas. Esta trilha explica critérios, mas não recomenda ativos específicos. Uma decisão individual pode exigir orientação profissional que considere toda a sua situação.",
      ),
    ],
    caseStudy: {
      title: "Uma taxa boa para o objetivo errado",
      text: "João precisa de R$ 2.000 em dois meses para uma despesa já marcada. Uma aplicação bloqueada por dois anos pode anunciar uma taxa maior, mas não atende à necessidade de acesso. O prazo do objetivo elimina essa opção antes mesmo de comparar a rentabilidade.",
      calculation: "Prazo do objetivo: 2 meses ≠ bloqueio do produto: 24 meses",
    },
    mistake:
      "Escolher um investimento pela rentabilidade divulgada e só depois descobrir seu prazo, riscos e condições de resgate.",
    takeaways: [
      "Objetivo e prazo orientam a análise.",
      "Tolerância e capacidade de risco são diferentes.",
      "Entender o produto vem antes de contratar.",
    ],
    challenge: practice(
      "Seu briefing antes de investir",
      "15 min",
      "Escreva critérios para um objetivo hipotético. Não é necessário abrir conta ou aplicar dinheiro.",
      [
        "Defina o valor, o prazo e quando poderia precisar resgatar.",
        "Liste obrigações e imprevistos que exigem proteção antes de investir.",
        "Escreva três critérios que eliminariam um produto inadequado.",
      ],
      "Qual característica você priorizaria antes de olhar a rentabilidade?",
    ),
    quiz: [
      question(
        "Você precisa do dinheiro em dois meses. Qual característica pode tornar um produto inadequado, mesmo com taxa maior?",
        [
          "Ter informações claras sobre os riscos.",
          "Permitir conferir o emissor.",
          "Ter custos informados.",
          "Bloquear o resgate por dois anos.",
        ],
        3,
        "Um bloqueio maior que o prazo do objetivo impede o acesso necessário. A rentabilidade não corrige essa incompatibilidade.",
      ),
      question(
        "Uma pessoa gosta de risco, mas usa o dinheiro para pagar despesas essenciais no próximo mês. O que é correto?",
        [
          "Sua tolerância ao risco basta para justificar qualquer aplicação.",
          "Sua capacidade de suportar perda pode ser baixa, apesar de gostar de risco.",
          "Necessidades próximas não influenciam a escolha.",
          "Ela deve ignorar o prazo.",
        ],
        1,
        "Capacidade de risco depende das consequências de perder recursos, não apenas da vontade de assumir incerteza.",
      ),
      question(
        "Qual sequência é mais consistente antes de contratar um investimento?",
        [
          "Taxa anunciada → contratação → leitura dos riscos.",
          "Indicação de um amigo → contratação imediata.",
          "Objetivo e prazo → situação financeira → riscos, liquidez e custos do produto.",
          "Promessa de retorno → uso da reserva inteira.",
        ],
        2,
        "A avaliação começa pela necessidade e pela capacidade financeira. Depois analisa o produto, sem tratar uma indicação ou taxa como garantia de adequação.",
      ),
    ],
  },
  {
    objectives: [
      "Identificar riscos diferentes.",
      "Distinguir liquidez de estabilidade de preço.",
      "Interpretar retorno real e promessa de retorno.",
    ],
    sections: [
      section(
        "Quais riscos existem além de “perder tudo”?",
        "Risco de crédito é o de o emissor não pagar conforme o combinado. Risco de mercado envolve mudanças de preço por juros, condições econômicas e expectativas. Risco de liquidez é a dificuldade de vender ou resgatar quando necessário, pelo preço esperado. Um mesmo produto pode reunir vários deles.",
        "Também existe risco de concentração: depender demais de um emissor ou fator. “Renda fixa” descreve a regra de remuneração, não a ausência de riscos. Uma regra contratada pode coexistir com oscilações relevantes se você precisar vender o título antes do vencimento.",
      ),
      section(
        "Ter liquidez significa não perder dinheiro?",
        "Não. Um ativo pode ser negociado rapidamente, mas por um preço menor que o pago. Liquidez fala sobre possibilidade e condições de transformar o ativo em dinheiro; estabilidade de valor é outra dimensão. Da mesma forma, um produto com rendimento previsível pode ter resgate bloqueado por um período.",
        "Leia detalhes operacionais: prazo de liquidação, horários, dias úteis, carência e regras de saída antecipada. Para uma necessidade urgente, uma promessa vaga de facilidade de resgate não basta. O que importa é quando os recursos estarão realmente disponíveis e em que condições.",
      ),
      section(
        "Retorno nominal é ganho de poder de compra?",
        "O retorno nominal mede o crescimento do valor em dinheiro. O retorno real considera a inflação. A relação exata é (1 + retorno nominal) ÷ (1 + inflação) − 1, usando o mesmo período. Se preços sobem mais do que seu dinheiro, o poder de compra diminui mesmo com saldo nominal maior.",
        "Custos e impostos também alteram o resultado líquido. Rentabilidade divulgada pode ser histórica, projetada ou contratual, e essas categorias não são equivalentes. Desconfie da combinação de retorno extraordinário, garantia absoluta e ausência de qualquer risco.",
      ),
    ],
    caseStudy: {
      title: "O saldo subiu, mas o poder de compra caiu",
      text: "Um valor cresce 5% em um ano, enquanto os preços do conjunto considerado sobem 8%. O retorno real é aproximadamente −2,78%, antes de outros custos. Há mais unidades de moeda, mas elas compram menos do que antes.",
      calculation: "1,05 ÷ 1,08 − 1 ≈ −2,78%",
    },
    mistake:
      "Usar “resgate fácil” como sinônimo de “valor garantido”. Venda rápida não garante recuperar o preço de compra.",
    takeaways: [
      "Crédito, mercado e liquidez são riscos diferentes.",
      "Liquidez não elimina oscilação de preço.",
      "Poder de compra depende também da inflação.",
    ],
    challenge: practice(
      "A ficha dos três fatores",
      "20 min",
      "Compare dois produtos fictícios: A permite resgate rápido com preço variável; B tem prazo bloqueado e regra contratada.",
      [
        "Descreva risco, retorno e liquidez de cada opção, sem chamá-las de livres de risco.",
        "Escolha um objetivo próximo e explique qual característica seria impeditiva.",
        "Liste informações adicionais necessárias antes de decidir.",
      ],
      "Qual risco você não enxergava quando olhava apenas para a taxa?",
    ),
    quiz: [
      question(
        "Um ativo pode ser vendido rapidamente, mas seu preço caiu. Qual afirmação é correta?",
        [
          "Liquidez e estabilidade de preço são características distintas.",
          "Ter liquidez garante não perder.",
          "A queda de preço prova que não havia liquidez.",
          "Liquidez é sempre igual a rentabilidade.",
        ],
        0,
        "É possível vender rapidamente com perda. Liquidez descreve a facilidade e condições de negociação, não garante o preço de venda.",
      ),
      question(
        "O emissor não consegue pagar conforme o contrato. Qual risco está se materializando?",
        [
          "Apenas risco de inflação.",
          "Risco de crédito.",
          "Somente custo de oportunidade.",
          "Nenhum risco, se for renda fixa.",
        ],
        1,
        "Risco de crédito está ligado ao cumprimento da obrigação pelo emissor. A classificação como renda fixa não elimina esse risco.",
      ),
      question(
        "Com retorno nominal de 5% e inflação de 8% no mesmo ano, antes de custos, o retorno real é:",
        [
          "Exatamente +13%.",
          "Exatamente +3%.",
          "Aproximadamente −2,78%.",
          "Zero, porque o saldo aumentou.",
        ],
        2,
        "A conta exata é 1,05 ÷ 1,08 − 1 ≈ −2,78%. Subtrair taxas pode aproximar o resultado, mas aqui o poder de compra caiu.",
      ),
    ],
  },
  {
    objectives: [
      "Distinguir crescimento linear e composto.",
      "Manter taxa e prazo na mesma unidade.",
      "Aplicar os conceitos também a dívidas.",
    ],
    sections: [
      section(
        "Qual é a diferença entre juros simples e compostos?",
        "Nos juros simples, cada período calcula juros sobre o capital inicial. A fórmula é M = C × (1 + i × n). Nos compostos, a base inclui o saldo acumulado, de modo que M = C × (1 + i)^n. C é o capital inicial, i é a taxa por período e n é o número de períodos.",
        "Uma taxa de 1% deve entrar como 0,01, não como 1. A fórmula composta supõe, nessa versão, taxa constante e ausência de novos aportes ou retiradas. Fluxos adicionais exigem considerar o tempo de cada contribuição. Exemplos de rendimento não representam promessa de retorno.",
      ),
      section(
        "Por que a unidade de tempo muda o resultado?",
        "Uma taxa mensal exige um número de meses; uma taxa anual exige um número de anos. Converter uma taxa composta não é simplesmente multiplicá-la. A taxa efetiva anual equivalente a 1% ao mês é (1,01)^12 − 1, aproximadamente 12,68%, e não exatamente 12%.",
        "Distinguir taxa nominal e efetiva evita comparações enganosas. Também confirme se a taxa divulgada é bruta ou líquida e quais custos se aplicam. Uma simulação deve deixar explícitos prazo, unidade, aportes e hipóteses; do contrário, um resultado exato na calculadora pode responder à pergunta errada.",
      ),
      section(
        "Os juros compostos trabalham sempre a seu favor?",
        "O mecanismo também pode aumentar dívidas. Quando encargos se incorporam ao saldo e passam a gerar novos encargos, adiar pagamentos pode ampliar rapidamente o valor devido. A taxa e o contrato determinam a evolução; não compare um investimento de retorno incerto com uma dívida como se ambos fossem equivalentes.",
        "O tempo amplia o efeito das taxas, mas não elimina risco, inflação, custos ou impostos. Para investir, o resultado relevante é o ganho líquido e adequado ao objetivo. Para crédito, observe CET e condições de amortização, pois uma conta simples de capitalização pode não reproduzir todo o contrato.",
      ),
    ],
    caseStudy: {
      title: "Dois meses, duas bases de cálculo",
      text: "R$ 1.000 a 1% ao mês por dois meses resultam em R$ 1.020 com juros simples e R$ 1.020,10 com juros compostos. Nos compostos, o segundo mês calcula 1% sobre R$ 1.010. A diferença parece pequena no início, mas depende da taxa e do tempo.",
      calculation:
        "Simples: 1.000 × 1,02 = 1.020 | Compostos: 1.000 × 1,01² = 1.020,10",
    },
    mistake:
      "Inserir 1 em vez de 0,01 para representar 1%, ou combinar taxa mensal com prazo em anos.",
    takeaways: [
      "Juros compostos usam o saldo acumulado.",
      "Taxa e prazo precisam ter unidades compatíveis.",
      "O mesmo mecanismo pode ampliar ganhos ou dívidas.",
    ],
    challenge: practice(
      "Faça os juros aparecerem",
      "15 min",
      "Use uma calculadora e valores hipotéticos, sem contratar crédito ou investimentos.",
      [
        "Calcule R$ 1.000 a 1% por dois meses com juros simples.",
        "Repita o cálculo com juros compostos e explique a diferença.",
        "Calcule a taxa anual equivalente a 1% ao mês e registre as hipóteses.",
      ],
      "Por que o mesmo mecanismo merece atenção em uma dívida?",
    ),
    quiz: [
      question(
        "Qual é o saldo de R$ 1.000 a 1% ao mês por dois meses em juros compostos, sem aportes, custos ou impostos?",
        ["R$ 1.020,00", "R$ 1.020,10", "R$ 1.200,00", "R$ 1.010,00"],
        1,
        "1.000 × 1,01² = R$ 1.020,10. O segundo mês incide sobre R$ 1.010, não apenas sobre o capital inicial.",
      ),
      question(
        "Qual taxa efetiva anual equivale a 1% ao mês em capitalização composta?",
        [
          "Exatamente 12%.",
          "Exatamente 1%.",
          "Aproximadamente 12,68%.",
          "Exatamente 24%.",
        ],
        2,
        "(1,01)^12 − 1 ≈ 12,68%. Multiplicar 1% por 12 não considera a composição dos juros.",
      ),
      question(
        "A fórmula M = C × (1 + i)^n, na versão apresentada, supõe o quê?",
        [
          "Taxa constante, períodos compatíveis e nenhum aporte ou retirada adicional.",
          "Qualquer fluxo de aportes sem ajuste.",
          "Retorno garantido em todo investimento.",
          "Inflação e impostos automaticamente descontados.",
        ],
        0,
        "A fórmula básica usa essas hipóteses. Fluxos adicionais, custos, impostos e mudanças de taxa precisam ser modelados separadamente.",
      ),
    ],
  },
  {
    objectives: [
      "Identificar regras de remuneração.",
      "Relacionar venda antecipada e marcação a mercado.",
      "Comparar resultado líquido e condições de proteção.",
    ],
    sections: [
      section(
        "O que exatamente fica definido na renda fixa?",
        "A regra de remuneração é estabelecida na contratação. Em um título prefixado, a taxa é definida; em um pós-fixado, o resultado acompanha um indicador; em um híbrido, combina um índice com uma taxa. O valor final de um pós-fixado não é totalmente conhecido de antemão porque o indicador pode variar.",
        "Leia o prazo, a forma de pagamento e as hipóteses necessárias para receber o resultado contratado. Receber conforme o acordo depende do cumprimento das obrigações pelo emissor. A expressão “fixa” não significa que o preço de venda antes do vencimento permanecerá constante.",
      ),
      section(
        "Por que um título prefixado pode cair de preço?",
        "Quando as taxas disponíveis no mercado mudam, o preço dos títulos existentes pode se ajustar para refletir as novas condições. Em termos gerais, uma elevação das taxas tende a reduzir o preço de títulos prefixados existentes, se os demais fatores permanecerem constantes. Essa atualização é conhecida como marcação a mercado.",
        "Vender antes do vencimento pode produzir ganho ou perda em relação ao que você imaginava. Carregar até o vencimento, quando o contrato é cumprido, tem uma lógica diferente da venda antecipada. Ainda assim, existem riscos de crédito e de adequação: um prazo incompatível continua sendo um problema.",
      ),
      section(
        "Quais detalhes mudam a comparação entre produtos?",
        "Compare rendimento líquido depois de tributos e taxas aplicáveis, mantendo prazo e risco comparáveis. Uma taxa bruta maior não garante resultado líquido melhor. Verifique carência, liquidez, emissor, regras de resgate e documentos oficiais do produto.",
        "Alguns instrumentos podem contar com mecanismos de proteção, como cobertura do FGC quando elegíveis, sujeitos a condições e limites. Nem todo produto de renda fixa tem essa cobertura. Consulte as regras vigentes diretamente no FGC e nos documentos da instituição; proteção não equivale a ausência de risco ou resgate imediato.",
      ),
    ],
    caseStudy: {
      title: "Bruto não é líquido",
      text: "Em uma simulação, o produto A gera R$ 100 brutos, R$ 20 de tributos e R$ 5 de taxas: R$ 75 líquidos. B gera R$ 90 brutos, R$ 9 de tributos e nenhuma taxa: R$ 81 líquidos. Os percentuais são hipotéticos; não descrevem a tributação de um produto específico. B rende menos no bruto, mas mais no líquido, antes de comparar outros fatores.",
      calculation: "A: 100 − 20 − 5 = 75 | B: 90 − 9 = 81",
    },
    mistake:
      "Confundir uma regra de remuneração contratada com garantia de preço estável em qualquer data de resgate.",
    takeaways: [
      "Renda fixa descreve a regra, não a ausência de risco.",
      "Saída antecipada pode ter preço diferente do esperado.",
      "Compare líquido, prazo, liquidez e emissor.",
    ],
    challenge: practice(
      "Leia além da taxa",
      "20 min",
      "Analise uma descrição fictícia ou pública de produto, sem aplicar dinheiro.",
      [
        "Identifique se a remuneração é prefixada, pós-fixada ou híbrida.",
        "Localize prazo, carência, resgate, emissor, custos e tributação aplicável.",
        "Explique o que precisaria verificar sobre venda antecipada e eventual proteção.",
      ],
      "Que informação faltava para você compreender o produto?",
    ),
    quiz: [
      question(
        "Em um produto pós-fixado, o que é definido na contratação?",
        [
          "A regra ligada a um indicador, que pode variar.",
          "Necessariamente o valor exato de todos os rendimentos futuros.",
          "A ausência de risco de crédito.",
          "A garantia de venda sem perda em qualquer data.",
        ],
        0,
        "A regra é conhecida, mas o indicador futuro pode variar. Isso não elimina riscos nem garante o preço de saída antecipada.",
      ),
      question(
        "Uma taxa de mercado maior pode afetar como o preço de um título prefixado existente, mantendo os demais fatores constantes?",
        [
          "Sempre aumentando seu preço.",
          "Sem qualquer possibilidade de efeito.",
          "Tendendo a reduzir seu preço de negociação.",
          "Convertendo-o automaticamente em dinheiro.",
        ],
        2,
        "Se novos títulos oferecem taxas maiores, o preço dos antigos tende a se ajustar para baixo. A venda antecipada pode diferir do resultado de manter até o vencimento.",
      ),
      question(
        "A gera R$ 100 brutos, com R$ 20 de tributos e R$ 5 de taxas. B gera R$ 90, com R$ 9 de tributos e nenhuma taxa. Qual resultado líquido é maior?",
        ["A, com R$ 100.", "B, com R$ 81.", "A, com R$ 95.", "São iguais."],
        1,
        "A resulta em R$ 75; B, em R$ 81. A comparação completa ainda precisa considerar prazo, liquidez e risco. Os tributos do exemplo são hipotéticos.",
      ),
    ],
  },
  {
    objectives: [
      "Reconhecer concentrações escondidas.",
      "Relacionar diversificação ao objetivo.",
      "Entender revisão e rebalanceamento.",
    ],
    sections: [
      section(
        "Ter muitos produtos significa estar diversificado?",
        "Não necessariamente. Vários produtos podem depender do mesmo emissor, setor ou fator econômico. A quantidade de nomes no extrato não revela a distribuição real dos riscos. Investimentos em instituições diferentes podem até ter exposição semelhante, dependendo de como foram estruturados.",
        "Diversificar busca reduzir a dependência de um resultado específico. Não elimina riscos gerais do mercado, perdas ou escolhas inadequadas. A distribuição deve respeitar objetivo, horizonte, liquidez e capacidade de suportar oscilações. Acrescentar complexidade sem entender os produtos pode dificultar o controle.",
      ),
      section(
        "Por que o prazo muda a forma de acompanhar?",
        "Metas próximas não podem depender de recuperação futura incerta. Um horizonte longo pode permitir suportar certas oscilações, mas não garante lucro. O plano precisa considerar a possibilidade de precisar do dinheiro antes do previsto e os riscos que você realmente pode assumir.",
        "Evite tomar decisões inteiras com base em uma notícia, euforia ou medo momentâneo. Defina quando revisar e quais mudanças justificariam uma revisão extraordinária: nova necessidade, alteração de renda ou mudança relevante de risco. Isso é diferente de ignorar problemas reais ou manter um produto apenas por apego.",
      ),
      section(
        "O que significa rebalancear?",
        "Com o tempo, os pesos mudam porque valores e contribuições variam. Rebalancear é avaliar a composição atual em relação ao plano e fazer ajustes quando necessário. Isso pode ocorrer com novos aportes ou movimentações, sempre considerando impostos, taxas, liquidez e adequação.",
        "Não existe divisão universal que sirva para todos. Mesmo uma proporção previamente escolhida precisa ser revista se seu objetivo mudar. A disciplina é seguir um processo de decisão, não manter números antigos a qualquer custo. Exemplos de distribuição servem para entender a conta, não como carteira recomendada.",
      ),
    ],
    caseStudy: {
      title: "Três produtos, uma só dependência",
      text: "Uma pessoa tem R$ 3.000, R$ 4.000 e R$ 3.000 em três produtos do mesmo emissor. Apesar de três nomes, R$ 10.000 dependem desse emissor. Para avaliar diversificação, ela precisa olhar através dos nomes e identificar os riscos compartilhados.",
      calculation: "3.000 + 4.000 + 3.000 = 10.000 no mesmo emissor",
    },
    mistake:
      "Acreditar que diversificação elimina qualquer perda, ou contar produtos sem analisar os fatores de risco.",
    takeaways: [
      "Conte fatores de risco, não apenas produtos.",
      "Prazo longo não é garantia de retorno.",
      "Revisões devem considerar custos e mudanças na sua vida.",
    ],
    challenge: practice(
      "Encontre a concentração escondida",
      "20 min",
      "Monte uma carteira fictícia de três itens; não compre ativos para realizar a atividade.",
      [
        "Anote emissor, prazo e principal fator de risco de cada item.",
        "Identifique uma dependência compartilhada e a parcela do total exposta a ela.",
        "Defina um motivo e uma data para revisar a composição.",
      ],
      "Ter mais itens diminuiu a concentração ou só aumentou a quantidade de nomes?",
    ),
    quiz: [
      question(
        "Três produtos diferentes do mesmo emissor somam R$ 10.000. Qual observação é correta?",
        [
          "Há diversificação completa apenas por serem três produtos.",
          "Não existe risco de concentração.",
          "Todo risco foi eliminado.",
          "Pode haver concentração de crédito no mesmo emissor.",
        ],
        3,
        "Os nomes diferentes não eliminam a dependência do emissor. É preciso analisar os riscos por trás de cada produto.",
      ),
      question(
        "O que a diversificação pode fazer?",
        [
          "Garantir lucro em qualquer prazo.",
          "Reduzir dependências específicas, sem eliminar todos os riscos.",
          "Substituir a reserva de emergência automaticamente.",
          "Tornar irrelevante a liquidez.",
        ],
        1,
        "Diversificação pode reduzir certos riscos de concentração, mas não elimina riscos gerais, perdas ou inadequação ao objetivo.",
      ),
      question(
        "Qual atitude descreve melhor uma revisão disciplinada?",
        [
          "Reavaliar objetivo, riscos, composição e custos em momentos definidos ou diante de mudanças relevantes.",
          "Trocar tudo após qualquer notícia.",
          "Nunca revisar, mesmo com mudança de objetivo.",
          "Ignorar custos de toda movimentação.",
        ],
        0,
        "A revisão deve seguir critérios e considerar mudanças reais. Nem reações a cada notícia nem imobilidade absoluta substituem um processo de decisão.",
      ),
    ],
  },
  {
    objectives: [
      "Reconhecer sinais de fraude e manipulação.",
      "Verificar ofertas por canais independentes.",
      "Organizar uma resposta segura a uma suspeita.",
    ],
    sections: [
      section(
        "Quais sinais de alerta merecem interromper a decisão?",
        "Retorno extraordinário garantido, urgência, segredo, pressão para indicar pessoas e pagamento prévio para liberar ganhos ou crédito são sinais de alerta. Nenhum sinal isolado permite investigar toda a oferta, mas a combinação exige cautela. Depoimentos, seguidores e aparência profissional não comprovam legitimidade.",
        "Golpistas podem imitar marcas, pessoas conhecidas e até vozes ou vídeos. Uma mensagem que parece vir de alguém próximo não dispensa a confirmação por outro canal. Desconfie especialmente de pedidos para não conversar com ninguém, compartilhar códigos ou instalar programas de acesso remoto.",
      ),
      section(
        "Como verificar sem usar o caminho indicado pelo próprio contato?",
        "Procure você mesmo o endereço oficial da instituição e use canais verificados. Não dependa do link ou telefone enviado pelo interlocutor suspeito. Confira destinatário, domínio e dados da proposta. Pesquise registros e alertas nos canais oficiais dos órgãos competentes, conforme a atividade, como Banco Central ou CVM.",
        "Um CNPJ existente ou uma empresa registrada não torna toda oferta legítima, nem comprova autorização para a atividade anunciada. Verifique também se o contato pertence realmente à instituição. Nunca compartilhe senha, código de verificação ou acesso remoto para “proteger” ou “liberar” uma conta.",
      ),
      section(
        "O que fazer se você já enviou dados ou dinheiro?",
        "Interrompa o contato e procure imediatamente sua instituição financeira pelos canais oficiais para informar o ocorrido e solicitar as medidas aplicáveis. Guarde comprovantes, mensagens e dados da transação. Se houve exposição de credenciais, altere-as em um dispositivo confiável e revise acessos. Registre a ocorrência nos canais apropriados.",
        "Procedimentos de contestação ou recuperação dependem da situação e não garantem devolução. Aja rápido, mas não envie novos pagamentos a quem promete recuperar o valor mediante taxa. O chamado golpe de recuperação pode explorar justamente a urgência de quem já foi prejudicado.",
      ),
    ],
    caseStudy: {
      title: "A taxa para desbloquear o prêmio",
      text: "Uma mensagem afirma que você ganhou R$ 5.000 e precisa pagar R$ 150 hoje para liberar o dinheiro. Ela usa o nome de uma empresa conhecida e um link parecido com o oficial. O caminho seguro é não pagar nem fornecer dados e confirmar por um canal encontrado independentemente. A promessa e a urgência não são evidências de legitimidade.",
      calculation:
        "Promessa de ganho + taxa antecipada + pressão = pare e verifique",
    },
    mistake:
      "Verificar a oferta apenas pelo telefone ou link fornecido pela própria pessoa que pode estar aplicando o golpe.",
    takeaways: [
      "Pressão e promessa extraordinária pedem pausa.",
      "Verifique por canais independentes e oficiais.",
      "Agir rápido após um incidente ajuda, mas não garante recuperação.",
    ],
    challenge: practice(
      "Seu protocolo antigolpe",
      "15 min",
      "Pratique com um cenário fictício. Não clique em links suspeitos nem contate golpistas.",
      [
        "Identifique três sinais de alerta em uma oferta hipotética.",
        "Descreva como encontraria um canal oficial sem usar o link recebido.",
        "Escreva os primeiros passos caso já tivesse enviado dinheiro ou dados.",
      ],
      "Qual regra pessoal você adotará antes de confirmar uma transferência?",
    ),
    quiz: [
      question(
        "Uma oferta promete dobrar seu dinheiro e exige uma taxa para liberar o saque. O que fazer primeiro?",
        [
          "Pagar rapidamente para não perder o prazo.",
          "Interromper a decisão e verificar a oferta por canais independentes.",
          "Enviar a senha para provar identidade.",
          "Indicar amigos para reduzir a taxa.",
        ],
        1,
        "Retorno extraordinário, urgência e cobrança para liberar valores são sinais de alerta. Não envie novos recursos ou credenciais para testar a promessa.",
      ),
      question(
        "Qual é a forma mais segura de confirmar um contato suspeito de uma instituição?",
        [
          "Telefonar apenas para o número que o contato enviou.",
          "Confiar no logotipo da mensagem.",
          "Buscar você mesmo um canal oficial e confirmar por ele.",
          "Verificar somente o número de seguidores.",
        ],
        2,
        "O golpista pode controlar os links e números que forneceu. Um canal oficial encontrado independentemente reduz essa dependência.",
      ),
      question(
        "Você suspeita de fraude após uma transferência. Qual resposta é adequada?",
        [
          "Contatar imediatamente a instituição por canal oficial, guardar evidências e solicitar as medidas aplicáveis, sem garantia de devolução.",
          "Esperar muitos dias sem registrar nada.",
          "Pagar outra pessoa que promete recuperação garantida.",
          "Apagar as mensagens para encerrar o assunto.",
        ],
        0,
        "A resposta rápida e a preservação das evidências ajudam a avaliar as medidas disponíveis. Não existe garantia universal de recuperação, e novas taxas podem ser outro golpe.",
      ),
    ],
  },
];
export const quizPassScore = 2;
