import { todayBR, nextOccurrence, dueDate, validDate } from "./automation.js";
import { clean, reportIntent } from "./report-intent.js";
import {
  currentPeriod,
  parsePeriod,
  hasPeriod,
  comparisonPeriod,
  calendarMonth,
  monthNames,
  shiftDays,
  periodLabel,
  dayLabel,
} from "./assistant-periods.js";
import { knowledge } from "./assistant-knowledge.js";

const cents = (value) => Math.round(Number(value) * 100);
const sum = (rows) => rows.reduce((n, r) => n + cents(r.amount), 0) / 100;
const round = (n) => Math.round(n * 100) / 100;
const fmt = (n) =>
  Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct = (n) =>
  Number(n).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "%";
const metric = (label, value, format = "currency") => ({
  label,
  value,
  format,
});
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const matchesName = (q, name) =>
  clean(name).length > 1 &&
  new RegExp(`(?:^|[^a-z0-9])${escape(clean(name))}(?:$|[^a-z0-9])`).test(q);
const followPattern =
  /^(e\b|agora\b|tambem\b|compare\b|comparar\b|detalhe\b|explique melhor|por que|quanto tempo|com\s+r?\$?\s*\d)|\b(disso|desse|dessa|nesse|nessa|mesmo periodo|essa meta|esse objetivo)\b/;
const fiscalNote =
  "Usei somente os lançamentos desta conta nas datas indicadas. Ausência de registros não prova ausência de gastos. O saldo não é bancário; aportes em metas são separados.";
const homeSuggestions = [
  "Analise meus gastos",
  "Compare com o mês passado",
  "Como estão meus orçamentos?",
  "Gere uma planilha completa deste mês",
];
const periodSuggestions = [
  "Analise meus gastos deste mês",
  "Me mostre as receitas deste mês",
  "Como estão minhas metas?",
];
const kinds = new Set([
  "overview",
  "expenses",
  "income",
  "balance",
  "compare",
  "budget",
  "savings",
  "afford",
  "goal",
  "reserve",
  "recurring",
  "trend",
  "ledger",
]);
function contextOf(state) {
  const last = (state.chat || []).filter((c) => c.role === "assistant").at(-1);
  const context = last?.insight?.context;
  if (!context || !kinds.has(context.intent)) return null;
  if (
    context.period &&
    (!validDate(context.period.start) || !validDate(context.period.end))
  )
    return null;
  return context;
}
function response(
  title,
  content,
  {
    context = null,
    metrics = [],
    table = null,
    suggestions = [],
    actions = [],
    note = "",
    count,
    mode = "local",
    matched = true,
    report,
  } = {},
) {
  return {
    content,
    mode,
    matched,
    ...(report ? { report } : {}),
    insight: {
      version: 1,
      title,
      context,
      metrics,
      table,
      suggestions: suggestions.slice(0, 4),
      actions: actions.slice(0, 3),
      note,
      ...(count === undefined ? {} : { count }),
    },
  };
}
function clarify(content, context = null, suggestions = periodSuggestions) {
  return response("Vamos ajustar a pergunta", content, {
    context,
    suggestions,
    note: "Não alterei nenhum registro.",
  });
}
function selectedRows(state, p, categoryId = "", type = "") {
  return state.transactions.filter(
    (t) =>
      t.date >= p.start &&
      t.date <= p.end &&
      (!categoryId || t.categoryId === categoryId) &&
      (!type || t.type === type),
  );
}
function stats(rows) {
  const income = sum(rows.filter((t) => t.type === "income")),
    expense = sum(rows.filter((t) => t.type === "expense"));
  return { income, expense, balance: round(income - expense) };
}
function categoryTotals(state, rows) {
  const totals = new Map();
  for (const t of rows)
    totals.set(t.categoryId, (totals.get(t.categoryId) || 0) + cents(t.amount));
  return [...totals]
    .map(([id, n]) => ({
      id,
      name:
        state.categories.find((c) => c.id === id)?.name || "Categoria removida",
      amount: n / 100,
    }))
    .sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name));
}
const amountPattern =
  "(-?(?:\\d{1,3}(?:\\.\\d{3})+|\\d+)(?:,\\d{1,2})?)(?![\\d.,a-z])";
function inputAmount(q) {
  if (/\d[\d.,]*\s*(?:mil|milhao|milhoes|k)\b/.test(q)) return null;
  const currency = [...q.matchAll(new RegExp("r\\$\\s*" + amountPattern, "g"))];
  if (currency.length > 1) return null;
  const match =
    currency[0] ||
    q.match(
      new RegExp(
        "(?:guardar|aportar|poupar|economizar|gastar|comprar|pagar|mensais de|por mes de|com)\\s+" +
          amountPattern,
      ),
    );
  if (!match) return null;
  const value = Number(match[1].replaceAll(".", "").replace(",", "."));
  return Number.isFinite(value) && value > 0 && value <= 1e12 ? value : null;
}
function topicContext(intent, period, categoryId, type, extra = {}) {
  return {
    intent,
    period,
    categoryId: categoryId || "",
    type: type || "",
    ...extra,
  };
}
function reportFromContext(q, ctx, raw) {
  if (
    !ctx ||
    !/disso|desse|dessa|nesse|nessa|mesmo|em excel|em planilha|desse periodo|deste periodo/.test(
      q,
    )
  )
    return raw;
  const kind = /complet|tudo/.test(q)
    ? "completo"
    : /receita/.test(q)
      ? "receitas"
      : /despesa/.test(q)
        ? "despesas"
        : ctx.intent === "goal"
          ? "metas"
          : ctx.intent === "recurring"
            ? "recorrencias"
            : ctx.intent === "budget"
              ? "orcamentos"
              : ctx.type === "income"
                ? "receitas"
                : ctx.type === "expense"
                  ? "despesas"
                  : "completo";
  return {
    ...raw,
    kind,
    ...(!hasPeriod(q) || /mesmo periodo|desse periodo|deste periodo/.test(q)
      ? ctx.period || {}
      : {}),
    categoryId: ["metas", "recorrencias"].includes(kind)
      ? ""
      : ctx.categoryId || "",
  };
}

/** Pure, deterministic and read-only. All data is supplied from the authenticated account. */
export function localReply(message, state, today = todayBR()) {
  const q = clean(message)
    .trim()
    .replace(/\bdespezas\b/g, "despesas")
    .replace(/\borcameto\b/g, "orcamento")
    .replace(/\bgastros\b/g, "gastos")
    .replace(/\brecitas\b/g, "receitas");
  const ctx = contextOf(state),
    follow =
      !!ctx &&
      (followPattern.test(q) ||
        /^(mes passado|hoje|ontem|ultimo mes)[?.!]*$/.test(q));
  const reportQuery = reportIntent(message, state, today);
  if (reportQuery) {
    if (reportQuery.clarification)
      return {
        ...clarify(reportQuery.clarification, ctx, [
          "Gere uma planilha completa deste mês",
          "Excel de despesas do mês passado",
        ]),
        mode: "local-report",
      };
    const report = reportFromContext(q, ctx, reportQuery);
    return response(
      "Seu Excel está pronto para gerar",
      `Preparei a opção de download para ${report.kind}. ${["metas", "recorrencias"].includes(report.kind) ? "Esta planilha mostra a posição atual." : `Período: ${periodLabel(report)}.`}${report.categoryId ? ` Categoria: ${state.categories.find((c) => c.id === report.categoryId)?.name || "selecionada"}.` : ""}\n\nClique em Baixar Excel para gerar o arquivo com os dados atuais da sua conta. Você pode ajustar os filtros antes de baixar.${report.kind === "metas" ? " Este arquivo inclui todas as metas cadastradas." : report.kind === "recorrencias" ? " Este arquivo contém as regras, não uma lista de parcelas previstas." : ""}${ctx?.search ? " O Excel não aplica a busca textual; apenas datas e categoria." : ""}${ctx?.intent === "compare" ? " O arquivo não inclui a tabela comparativa do chat; exporta apenas o recorte identificado acima." : ["savings", "afford"].includes(ctx?.intent) ? " O arquivo usa os registros reais, não os valores da simulação." : ""}`,
      {
        report,
        mode: "local-report",
        context: topicContext(
          {
            despesas: "expenses",
            receitas: "income",
            orcamentos: "budget",
            metas: "goal",
            recorrencias: "recurring",
          }[report.kind] || "overview",
          { start: report.start, end: report.end },
          report.categoryId,
          report.kind === "receitas"
            ? "income"
            : ["despesas", "orcamentos"].includes(report.kind)
              ? "expense"
              : "",
        ),
        suggestions: ["Analise meus gastos", "Como estão meus orçamentos?"],
        note: "O arquivo é uma fotografia no momento do download; não altera o aplicativo.",
      },
    );
  }
  if (
    /\b(senha|token|credencial)\b|dados (?:de )?(?:outros|outra|outro)/.test(q)
  )
    return response(
      "Privacidade em primeiro lugar",
      "Não consulto senhas, tokens ou registros de outras contas. Minhas análises usam apenas as informações financeiras da conta autenticada.",
      { suggestions: homeSuggestions },
    );
  if (
    /\b(apague|exclua|delete|registre|lance|adicione|cadastre|transfira|pague|pause|encerre|altere)\b/.test(
      q,
    )
  )
    return response(
      "Você continua no controle",
      "Não crio, apago ou altero registros pelo chat, nem realizo pagamentos. Posso orientar você e abrir a seção adequada; a confirmação fica nos formulários do aplicativo.",
      {
        actions: [
          { page: "despesas", label: "Abrir despesas" },
          { page: "recorrencias", label: "Abrir recorrências" },
          { page: "metas", label: "Abrir metas" },
        ],
        suggestions: [
          "Liste meus últimos lançamentos",
          "Veja minhas próximas recorrências",
        ],
      },
    );
  if (
    /^(oi|ola|bom dia|boa tarde|boa noite|tudo bem|obrigad[oa]|valeu)[!.?\s]*$/.test(
      q,
    )
  )
    return response(
      "Vamos cuidar do seu dinheiro",
      /obrigad|valeu/.test(q)
        ? "Por nada! Posso continuar a análise, comparar períodos ou preparar uma planilha."
        : `Olá, ${state.profile.name?.split(" ")[0] || "você"}! Posso analisar seus registros, explicar conceitos e simular cenários sem uma chave de IA. O que você quer entender hoje?`,
      { context: ctx, suggestions: homeSuggestions },
    );
  if (
    ctx &&
    /^(nao entendi|explique melhor|como (?:voce )?calculou|de onde (?:vem|vieram) os valores|por que)[?!.]*$/.test(
      q,
    )
  ) {
    const method =
      ctx.intent === "goal"
        ? "Uso o valor acumulado e o objetivo da meta atual. O restante é o objetivo menos o acumulado, nunca abaixo de zero. Divido esse restante pelo aporte hipotético, arredondando a quantidade de aportes para cima. Não incluo rendimentos."
        : ctx.intent === "budget"
          ? "Somente despesas nas datas e categoria indicadas entram no gasto. O uso do limite é gasto dividido pelo limite mensal atual, vezes 100. Meses parciais não reduzem o limite proporcionalmente."
          : ctx.intent === "recurring"
            ? "Avanço o calendário de cada regra ativa, respeitando frequência, dia inicial, data final e quantidade máxima. Somo somente as ocorrências na janela futura informada. Isso é previsão, não pagamento."
            : ctx.intent === "reserve"
              ? "Uma hipótese de custo mensal informada por você é multiplicada por 3 e 6. Sem hipótese, calculo a média dos meses com despesas entre os três últimos meses completos. Excluo meses sem registros e não considero o mês em andamento como completo."
              : ctx.intent === "compare"
                ? "Somo os lançamentos de cada intervalo separadamente. A diferença é o valor do segundo período menos o primeiro. Quando a base anterior é maior que zero, a variação percentual é diferença dividida pela base, vezes 100. Não calculo percentual sobre zero. Uma mudança nos registros não prova por que ela aconteceu."
                : ctx.intent === "afford"
                  ? "Subtraio o preço total informado do saldo registrado no intervalo. O saldo é receitas menos despesas registradas; ele não representa dinheiro livre em conta. Não projeto juros ou parcelas e não desconto compromissos que ainda não foram registrados."
                  : ctx.intent === "trend"
                    ? "Agrupo as receitas e despesas por mês e calculo receitas menos despesas em cada linha. O mês atual termina hoje. Um mês zerado pode significar falta de registros; não uso esses totais para prever renda futura."
                    : ctx.intent === "ledger"
                      ? "Filtro pelas datas, categoria e tipo indicados e procuro o texto na descrição e nas observações, ignorando maiúsculas e acentos. Ordeno por data e mostro até oito registros recentes; a quantidade indicada pode ser maior que a lista visível."
                      : ctx.intent === "savings"
                        ? "Aplico a porcentagem informada às despesas do recorte; sem porcentagem, uso 10% apenas como exemplo. Subtraio a redução do total. É uma simulação: não altero lançamentos e não afirmo que todos os gastos podem ser cortados."
                        : "Filtro os lançamentos pelas datas e categoria da análise. Somo os valores em centavos para evitar erros comuns com decimais. Receitas menos despesas dão o saldo do período. A média por lançamento é o total dividido pela quantidade, não uma média diária.";
    return response(
      "Como cheguei a essa análise",
      method +
        "\n\nTodos os dados vêm desta conta. Registros faltantes ou duplicados mudam o resultado; o saldo não equivale ao extrato bancário.",
      {
        context: ctx,
        suggestions: [
          "Analise meus gastos deste mês",
          "Gere Excel desse período",
        ],
        note: "Explicação do método; nenhum registro foi alterado.",
      },
    );
  }
  if (
    /o que (voce|vc) (faz|pode|consegue)|como (usar|funciona)(?: (?:o |esse |este )?(?:chat|assistente|aplicativo|yfinance))?[?!.]*$|suas funcoes|^ajuda[?!.]*$|^nao entendi[?!.]*$/.test(
      q,
    )
  )
    return response(
      "O que consigo fazer sem uma chave de IA",
      "• Somar receitas, despesas e saldo por período ou categoria.\n• Comparar períodos e mostrar mudanças nas categorias.\n• Acompanhar limites e planejar redução de gastos.\n• Consultar metas e simular aportes sem juros.\n• Estimar uma reserva e listar próximas recorrências.\n• Buscar lançamentos e gerar Excel.\n\nDepois de uma análise, você pode perguntar “e em Lazer?”, “e no mês passado?” ou “gere Excel desse período”. Se houver ambiguidade, peço mais detalhes. Sou um assistente local por regras: não uma IA generativa, não acesso seu banco e não consulto cotações.",
      { suggestions: homeSuggestions },
    );

  const goalMatches = state.goals.filter((g) => matchesName(q, g.name));
  let intent = "";
  if (/posso (comprar|gastar|pagar)|cabe no.*orcamento|se eu gastar/.test(q))
    intent = "afford";
  else if (/^(busque|buscar|procure|pesquise)\b/.test(q)) intent = "ledger";
  else if (
    /\bmeta|objetivo|quanto tempo|atingir|alcancar/.test(q) ||
    (goalMatches.length &&
      (/como esta|quanto falta|progresso/.test(q) ||
        goalMatches.some((g) => clean(g.name) === q.replace(/[?.!]+$/, "")) ||
        ctx?.awaiting === "goal")) ||
    (follow &&
      ctx.intent === "goal" &&
      /guardar|aportar|\bcom\s+(?:r\$|\d)/.test(q))
  )
    intent = "goal";
  else if (
    /reserva|emergencia/.test(q) &&
    !/gastei|recebi|gastos? (?:em|com)|despesas? (?:de|da)/.test(q)
  )
    intent = "reserve";
  else {
    const educational = /gastei|recebi|analise meus|compare|liste|busque/.test(
      q,
    )
      ? null
      : knowledge.find((k) => k.match.test(q));
    if (educational)
      return response(educational.title, educational.text, {
        actions: [{ page: "educacao", label: "Explorar aulas" }],
        suggestions:
          educational.id === "budget-concept"
            ? ["Como estão meus orçamentos?", "Analise meus gastos"]
            : [
                "Como criar uma reserva?",
                "Analise meus gastos",
                "Como estão minhas metas?",
              ],
        note: "Conteúdo educativo local. Não usa cotações nem modelos externos.",
      });
    if (/recorren|assinatura|vencimento|proximas contas/.test(q))
      intent = "recurring";
    else if (/evolucao|tendencia|mes a mes|historico mensal/.test(q))
      intent = "trend";
    else if (
      /compar|mais que|menos que|aument|diminui|mudou|diferenca|em relacao/.test(
        q,
      )
    )
      intent = "compare";
    else if (
      /economiz|poupar|reduzir|cortar|gastar menos|guardar dinheiro/.test(q)
    )
      intent = "savings";
    else if (/orcamento|limites?|alerta/.test(q)) intent = "budget";
    else if (
      /\b(busque|buscar|procure|pesquise|liste|listar|mostre|mostrar)\b|ultimos lancamentos/.test(
        q,
      )
    )
      intent = "ledger";
    else if (/saldo|sobrou|sobra|disponivel/.test(q)) intent = "balance";
    else if (
      /recebi|receitas?|entradas?|renda|ganhei|salario/.test(q) &&
      !/despesa|gasto|saida/.test(q)
    )
      intent = "income";
    else if (
      /gastei|gastos?|despesas?|saidas?|compras/.test(q) &&
      !/receita|renda|entrada/.test(q)
    )
      intent = "expenses";
    else if (
      /resum|analise|analisar|como estou|situacao financeira|visao geral|minhas financas/.test(
        q,
      )
    )
      intent = "overview";
  }
  // A category-only continuation uses the preceding topic and period, not a generic answer.
  if (!intent && follow) intent = ctx.intent;
  if (!intent && ctx?.awaiting === "goal" && goalMatches.length)
    intent = "goal";
  if (
    !intent &&
    ctx?.awaiting === "category" &&
    state.categories.some((c) => matchesName(q, c.name))
  )
    intent = ctx.intent;
  if (!intent)
    return response(
      "Posso ajudar com suas finanças",
      "Não consegui identificar um pedido financeiro que eu possa atender com segurança. Não vou inventar uma resposta.\n\nVocê pode pedir uma análise de gastos, comparação de períodos, orçamento, metas, reserva, recorrências ou Excel. Para outro assunto ou uma pergunta financeira muito aberta, tente indicar o que deseja calcular e o período.",
      {
        matched: false,
        suggestions: homeSuggestions,
        note: "Modo local por regras, sem chave de IA. Não consulta a internet.",
      },
    );
  if (intent === "goal") return goalsReply(q, state, today, ctx, goalMatches);
  if (intent === "reserve") return reserveReply(q, state, today);
  if (intent === "recurring") return recurringReply(q, state, today);
  if (intent === "trend") return trendReply(q, state, today);

  const compare = intent === "compare";
  let periodInput = q
    .replace(/por mes|mensalmente/g, "")
    .replace(/["“][^"”]+["”]/g, "");
  if (intent === "afford")
    periodInput = periodInput
      .replace(new RegExp("r\\$\\s*" + amountPattern, "g"), "")
      .replace(
        new RegExp("(comprar|gastar|pagar)\\s+" + amountPattern, "g"),
        "$1",
      );
  const priorMonthRequest =
    compare &&
    /com (?:o )?mes (?:passado|anterior)|(?:mais|menos) (?:que|do que).*mes (?:passado|anterior)/.test(
      q,
    );
  if (priorMonthRequest)
    periodInput = periodInput.replace(/mes passado|mes anterior/g, "");
  const inherit =
    follow &&
    !["goal", "reserve", "recurring"].includes(ctx.intent) &&
    !(
      priorMonthRequest &&
      ctx.period?.start.slice(0, 7) !== ctx.period?.end.slice(0, 7)
    )
      ? ctx.period
      : null;
  const parsed = parsePeriod(periodInput, state, today, {
    inherited: inherit,
    compare,
  });
  if (parsed.clarification)
    return clarify(
      parsed.clarification,
      topicContext(
        intent,
        follow ? ctx.period : currentPeriod(today),
        follow ? ctx.categoryId : "",
        follow ? ctx.type : "",
      ),
    );
  const period = parsed.period;
  let type =
    intent === "income"
      ? "income"
      : ["expenses", "budget", "savings"].includes(intent)
        ? "expense"
        : /receita|entrada/.test(q) && !/despesa|gasto/.test(q)
          ? "income"
          : /despesa|gasto/.test(q) && !/receita|entrada/.test(q)
            ? "expense"
            : follow
              ? ctx.type || ""
              : "";
  if (intent === "balance" || intent === "afford") type = "";
  const relevant = state.categories.filter((c) => !type || c.type === type),
    found = relevant.filter((c) => matchesName(q, c.name));
  if (found.length > 1)
    return clarify(
      "Encontrei mais de uma categoria. Para evitar misturar recortes, escolha uma categoria por análise ou peça “todas as categorias”.",
      topicContext(intent, period, "", type, { awaiting: "category" }),
      found
        .slice(0, 4)
        .map(
          (c) =>
            `${c.type === "income" ? "Receitas" : "Despesas"} na categoria ${c.name}`,
        ),
    );
  const all =
    /todas as categorias|todos os gastos|todas as despesas|visao geral/.test(q);
  let categoryId = all
    ? ""
    : found[0]?.id ||
      (follow &&
      state.categories.some(
        (c) => c.id === ctx.categoryId && (!type || c.type === type),
      )
        ? ctx.categoryId
        : "");
  if (
    /categoria\s+\S/.test(q) &&
    !found.length &&
    !all &&
    !/por categoria/.test(q)
  )
    return clarify(
      "Não reconheci essa categoria na sua conta. Use o nome que aparece em Categorias, ou peça “todas as categorias”.",
      topicContext(intent, period, "", type, { awaiting: "category" }),
      relevant
        .slice(0, 3)
        .map(
          (c) =>
            `${type === "income" ? "Receitas" : "Despesas"} na categoria ${c.name}`,
        ),
    );
  const unknownScope =
    q.match(/(?:gastei|gastos?|despesas?)\s+(?:com|em|de)\s+(.+)/) ||
    q.match(/^e (?:em|com)\s+(.+)/);
  if (
    !found.length &&
    !all &&
    unknownScope &&
    !new RegExp(
      `^(?:\\d|hoje|ontem|este|esse|neste|nesse|deste|desse|todo|toda|mes|ano|semana|ultim|${monthNames.join("|")})`,
    ).test(unknownScope[1].replace(/^(?:o|a|os|as)\s+/, ""))
  )
    return clarify(
      "Não reconheci uma categoria nesse recorte. Informe o nome exato de uma categoria ou busque uma descrição entre aspas, por exemplo: busque “mercado”.",
      topicContext(intent, period, "", type, { awaiting: "category" }),
      ["Liste meus últimos lançamentos", "Analise todas as categorias"],
    );
  const category = state.categories.find((c) => c.id === categoryId);
  if (category && !type) type = category.type;
  const context = topicContext(intent, period, categoryId, type);
  const rows = selectedRows(state, period, categoryId),
    numbers = stats(rows),
    filtered = type ? rows.filter((t) => t.type === type) : rows;
  const scope = `${periodLabel(period)}${category ? ` · ${category.name}` : ""}`;
  const note =
    fiscalNote +
    (period.end > today
      ? " O intervalo inclui datas futuras já registradas; não são previsões."
      : period.end === today
        ? " O período termina hoje e pode estar incompleto."
        : "");
  const suggestions = [
    "Compare com o mês passado",
    "Gere Excel desse período",
    ...(category
      ? ["Analise todas as categorias"]
      : ["Como estão meus orçamentos?"]),
  ];
  if (intent === "compare")
    return compareReply(
      state,
      today,
      period,
      parsed.previous || comparisonPeriod(period, today),
      categoryId,
      type,
      context,
      note,
    );
  if (intent === "budget")
    return budgetReply(state, period, categoryId, context);
  if (intent === "afford") {
    if (categoryId)
      return clarify(
        "Para simular uma compra, use o saldo geral, não o saldo de uma categoria. Pergunte, por exemplo: “posso gastar R$ 200 este mês?”.",
        null,
        ["Posso gastar R$ 200 este mês?"],
      );
    const value = inputAmount(q);
    if (!value || /\d+\s*x|parcel/.test(q))
      return clarify(
        "Qual é o valor total da compra? Use, por exemplo, “posso gastar R$ 200 este mês?”. Não interpreto parcelas como se fossem o preço total.",
        context,
        ["Posso gastar R$ 200 este mês?"],
      );
    const remaining = round(numbers.balance - value);
    return response(
      "Simulação de uma nova despesa",
      `Saldo registrado no período: ${fmt(numbers.balance)}. Com uma nova despesa de ${fmt(value)}, ele ficaria em ${fmt(remaining)}.\n\n${remaining >= 0 ? "A conta aritmética cabe no saldo registrado, mas isso não garante dinheiro disponível." : "A simulação ficaria negativa. Considere adiar, reduzir o valor ou rever o planejamento."} Confira compromissos ainda não lançados, dívidas e sua reserva antes de decidir. Nenhuma despesa foi criada.`,
      {
        context,
        metrics: [
          metric("Saldo registrado", numbers.balance),
          metric("Compra simulada", value),
          metric("Saldo simulado", remaining),
        ],
        count: rows.length,
        note,
        suggestions: [
          "Veja minhas próximas recorrências",
          "Como economizar mais?",
        ],
        actions: [{ page: "despesas", label: "Revisar despesas" }],
      },
    );
  }
  if (intent === "savings") {
    const match = q.match(/(-?\d+(?:[.,]\d+)?)\s*%/),
      rate = match ? Number(match[1].replace(",", ".")) : 10;
    if (rate <= 0 || rate > 100 || /\d+[.,]\d{3,}\s*%/.test(q))
      return clarify(
        "Escolha uma redução maior que 0% e até 100%, com até duas casas decimais. Exemplo: “simule reduzir 10% dos meus gastos”.",
        context,
        ["Simule reduzir 10% dos meus gastos"],
      );
    if (!numbers.expense)
      return response(
        "Primeiro, uma base para planejar",
        "Não há despesas registradas nesse recorte para calcular uma redução. Registre seus gastos antes de transformar uma estimativa em meta.",
        {
          context,
          note,
          suggestions,
          actions: [{ page: "despesas", label: "Registrar despesas" }],
        },
      );
    const reduction = round((numbers.expense * rate) / 100),
      ranking = categoryTotals(
        state,
        rows.filter((t) => t.type === "expense"),
      );
    return response(
      "Um cenário para economizar",
      `Simulação sobre as despesas de ${scope}: reduzir ${pct(rate)} de ${fmt(numbers.expense)} representaria ${fmt(reduction)} a menos no período.\n\nIsso não é uma recomendação de cortar todas as categorias igualmente. Comece revisando os maiores gastos e escolha o que é ajustável sem comprometer necessidades. Não alterei limites nem lançamentos.`,
      {
        context,
        metrics: [
          metric("Despesas registradas", numbers.expense),
          metric("Redução simulada", reduction),
          metric("Despesas após redução", round(numbers.expense - reduction)),
        ],
        table: {
          headers: ["Maiores categorias", "Valor registrado"],
          rows: ranking.slice(0, 5).map((c) => [c.name, fmt(c.amount)]),
        },
        count: rows.length,
        note,
        suggestions: [
          "E se eu reduzir 20%?",
          "Como estão minhas metas?",
          "Gere Excel desse período",
        ],
      },
    );
  }
  if (intent === "ledger") {
    let search = q.match(/["“”]([^"“”]+)["“”]/)?.[1];
    if (!search && /^(busque|buscar|procure|pesquise)\b/.test(q)) {
      if (hasPeriod(q))
        return clarify(
          "Para combinar busca e datas, coloque a descrição entre aspas: busque “mercado” no mês passado.",
          context,
          ["Liste meus últimos lançamentos"],
        );
      search = q
        .replace(/^(busque|buscar|procure|pesquise)\s+(?:por\s+)?/, "")
        .replace(/[?!.]+$/, "");
    }
    if (/^(busque|buscar|procure|pesquise)[?.!]*$/.test(q))
      return clarify(
        "Qual descrição você quer buscar? Por exemplo: busque “mercado”.",
        context,
        ["Liste meus últimos lançamentos"],
      );
    if (!search && follow) search = ctx.search || "";
    const result = filtered
      .filter(
        (t) =>
          !search ||
          clean(t.description + " " + (t.notes || "")).includes(clean(search)),
      )
      .sort((a, b) => b.date.localeCompare(a.date));
    context.search = search || "";
    return response(
      "Lançamentos encontrados",
      `${result.length} lançamento(s) em ${scope}${search ? ` com a busca “${search}”` : ""}. ${result.length ? `Exibo os ${Math.min(8, result.length)} mais recentes abaixo.` : "Nenhum registro corresponde a esses filtros."}`,
      {
        context,
        table: result.length
          ? {
              headers: ["Data", "Descrição", "Tipo", "Valor"],
              rows: result
                .slice(0, 8)
                .map((t) => [
                  dayLabel(t.date),
                  t.description,
                  t.type === "income" ? "Receita" : "Despesa",
                  fmt(t.amount),
                ]),
            }
          : null,
        count: result.length,
        note:
          note +
          (search
            ? " O Excel filtra período/categoria, mas não a busca textual; ajuste os filtros em Relatórios."
            : ""),
        suggestions: ["E no mês passado?", "Analise meus gastos"],
        actions: [
          {
            page: type === "income" ? "receitas" : "despesas",
            label: "Consultar lançamentos",
          },
        ],
      },
    );
  }
  const incomeOnly = intent === "income",
    expenseOnly = intent === "expenses";
  if (incomeOnly || expenseOnly) {
    const total = sum(filtered),
      ranking = categoryTotals(state, filtered),
      average = filtered.length ? round(total / filtered.length) : 0;
    const intro =
      period.start === currentPeriod(today).start &&
      period.end === today &&
      !category
        ? `Neste mês, você registrou ${fmt(numbers.income)} de receitas e ${fmt(numbers.expense)} de despesas. `
        : "";
    return response(
      incomeOnly ? "Suas entradas em detalhe" : "Seus gastos em detalhe",
      `${intro}${scope}: ${filtered.length} ${incomeOnly ? "receita(s)" : "despesa(s)"}, somando ${fmt(total)}.${ranking.length ? ` ${category ? "Categoria selecionada" : "Maior categoria"}: ${ranking[0].name}, com ${fmt(ranking[0].amount)}.` : " Não há registros para esse recorte."}\n\n${incomeOnly ? "Receitas registradas não são garantia de novas entradas nos próximos meses." : "O valor médio abaixo é por lançamento, não por dia. Revise as categorias mais relevantes antes de decidir onde ajustar."}`,
      {
        context,
        metrics: [
          metric(incomeOnly ? "Receitas" : "Despesas", total),
          metric("Lançamentos", filtered.length, "number"),
          metric("Média por lançamento", average),
        ],
        table: ranking.length
          ? {
              headers: ["Categoria", "Total", "Participação"],
              rows: ranking
                .slice(0, 6)
                .map((c) => [
                  c.name,
                  fmt(c.amount),
                  total ? pct((c.amount / total) * 100) : "—",
                ]),
            }
          : null,
        count: filtered.length,
        note,
        suggestions,
      },
    );
  }
  const largest = categoryTotals(
    state,
    rows.filter((t) => t.type === "expense"),
  )[0];
  const intro =
    period.start === currentPeriod(today).start &&
    period.end === today &&
    !category
      ? "Neste mês, você registrou"
      : "No período selecionado, você registrou";
  return response(
    intent === "balance" ? "Seu saldo registrado" : "Seu resumo financeiro",
    `${intro} ${fmt(numbers.income)} de receitas e ${fmt(numbers.expense)} de despesas. O saldo é ${fmt(numbers.balance)}.${largest ? ` A maior categoria de gasto é ${largest.name}: ${fmt(largest.amount)}.` : ""}\n\n${!rows.length ? "Ainda não há lançamentos nesse recorte. Comece registrando receitas e despesas para ter uma base de análise." : numbers.income === 0 ? "Não há receitas registradas. Confira se faltam entradas antes de avaliar sua capacidade de poupar." : numbers.balance < 0 ? "As despesas registradas superam as entradas. Revise os principais compromissos e confira se a base está completa." : "Há uma sobra nos registros, mas ela não considera compromissos ainda não lançados. Confira suas próximas contas antes de destiná-la a uma meta."}`,
    {
      context,
      metrics: [
        metric("Receitas", numbers.income),
        metric("Despesas", numbers.expense),
        metric("Saldo do período", numbers.balance),
      ],
      count: rows.length,
      note,
      suggestions,
    },
  );
}

function compareReply(
  state,
  today,
  period,
  previous,
  categoryId,
  type,
  context,
  note,
) {
  const nowRows = selectedRows(state, period, categoryId),
    oldRows = selectedRows(state, previous, categoryId),
    now = stats(nowRows),
    old = stats(oldRows);
  const key = type === "income" ? "income" : "expense",
    diff = round(now[key] - old[key]);
  const change =
    diff === 0
      ? "sem variação nos valores registrados"
      : old[key] > 0
        ? `${pct((Math.abs(diff) / old[key]) * 100)} ${diff >= 0 ? "a mais" : "a menos"}`
        : now[key] === 0
          ? "sem variação nos valores registrados"
          : "sem percentual comparável, pois a base anterior é zero";
  const priorDays =
      (Date.parse(previous.end) - Date.parse(previous.start)) / 86400000 + 1,
    currentDays =
      (Date.parse(period.end) - Date.parse(period.start)) / 86400000 + 1;
  const table = {
    headers: ["Indicador", periodLabel(previous), periodLabel(period)],
    rows: [
      ["Receitas", fmt(old.income), fmt(now.income)],
      ["Despesas", fmt(old.expense), fmt(now.expense)],
      ["Saldo", fmt(old.balance), fmt(now.balance)],
    ],
  };
  const newer = categoryTotals(
      state,
      nowRows.filter((t) => t.type === (type || "expense")),
    ),
    older = categoryTotals(
      state,
      oldRows.filter((t) => t.type === (type || "expense")),
    );
  const ids = new Set([...newer, ...older].map((c) => c.id));
  const changes = [...ids]
    .map((id) => ({
      name:
        state.categories.find((c) => c.id === id)?.name || "Categoria removida",
      delta: round(
        (newer.find((c) => c.id === id)?.amount || 0) -
          (older.find((c) => c.id === id)?.amount || 0),
      ),
    }))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .filter((c) => c.delta !== 0)
    .slice(0, 3);
  return response(
    "O que mudou entre os períodos",
    `Comparação: ${periodLabel(previous)} → ${periodLabel(period)}.\n\n${type === "income" ? "Receitas" : "Despesas"}: variação de ${fmt(diff)} (${change}).${!oldRows.length ? " Não há lançamentos na base anterior: não conclua que você não teve renda ou gastos naquele período." : ""}${changes.length ? "\n\nMaiores mudanças nos registros:\n" + changes.map((c) => `• ${c.name}: ${c.delta > 0 ? "+" : ""}${fmt(c.delta)}`).join("\n") : ""}\n\nOs registros mostram onde o valor mudou, mas não permitem concluir a causa. ${priorDays !== currentDays ? `Atenção: os períodos têm durações diferentes (${priorDays} e ${currentDays} dias).` : "Os períodos têm a mesma quantidade de dias."}`,
    {
      context,
      table,
      metrics: [
        metric(
          "Variação das " + (type === "income" ? "receitas" : "despesas"),
          diff,
        ),
      ],
      count: nowRows.length + oldRows.length,
      note:
        note +
        " Sem datas explícitas, comparo com o intervalo anterior; no mês em andamento uso os mesmos dias do mês anterior, limitados ao último dia disponível.",
      suggestions: [
        "E em todas as categorias?",
        "Como economizar mais?",
        "Gere Excel desse período",
      ],
    },
  );
}
function budgetReply(state, period, categoryId, context) {
  if (period.start.slice(0, 7) !== period.end.slice(0, 7))
    return clarify(
      "Os limites são mensais. Escolha um único mês para comparar os gastos com o orçamento, por exemplo: “orçamentos deste mês” ou “orçamentos de setembro”.",
      context,
      ["Orçamentos deste mês", "Orçamentos do mês passado"],
    );
  const rows = selectedRows(state, period, categoryId, "expense");
  const categories = state.categories.filter(
    (c) => c.type === "expense" && (!categoryId || c.id === categoryId),
  );
  const budgets = categories
    .filter((c) => c.budget > 0)
    .map((c) => {
      const amount = sum(rows.filter((t) => t.categoryId === c.id));
      return {
        ...c,
        amount,
        used: (amount / c.budget) * 100,
        left: round(c.budget - amount),
      };
    })
    .sort((a, b) => b.used - a.used);
  if (!budgets.length)
    return response(
      "Vamos definir seus limites",
      "Não há limite mensal configurado para esse recorte. Limite zero significa “sem limite”, não que qualquer gasto seja um estouro. Você pode definir valores realistas em Configurações.",
      {
        context,
        count: rows.length,
        suggestions: ["Como montar um orçamento?", "Analise meus gastos"],
        actions: [{ page: "configuracoes", label: "Definir limites" }],
      },
    );
  const exceeded = budgets.filter((c) => c.used >= 100),
    near = budgets.filter((c) => c.used >= 80 && c.used < 100);
  return response(
    "Seu orçamento, categoria por categoria",
    `${exceeded.length} categoria(s) atingiram ou ultrapassaram o limite e ${near.length} estão entre 80% e 100%. ${categories.length - budgets.length} categoria(s) estão sem limite definido.\n\n${budgets[0].used >= 80 ? `${budgets[0].name} merece atenção: ${fmt(budgets[0].amount)} de ${fmt(budgets[0].budget)} (${pct(budgets[0].used)}).` : "Os gastos registrados estão abaixo de 80% dos limites configurados. Isso depende de a base estar completa."}`,
    {
      context,
      table: {
        headers: ["Categoria", "Gasto no recorte", "Limite mensal", "Situação"],
        rows: budgets
          .slice(0, 8)
          .map((c) => [
            c.name,
            fmt(c.amount),
            fmt(c.budget),
            c.left < 0 ? `Excedeu ${fmt(-c.left)}` : `Restam ${fmt(c.left)}`,
          ]),
      },
      count: rows.length,
      note: `Datas: ${periodLabel(period)}. Uso os limites atuais, inclusive para meses antigos. O limite mensal não é rateado quando o recorte é parcial. Avisos históricos podem ter valores diferentes, pois registram a situação no momento do alerta.`,
      suggestions: ["Como economizar mais?", "Gere Excel desse período"],
      actions: [
        { page: "configuracoes", label: "Ajustar limites" },
        { page: "notificacoes", label: "Ver alertas" },
      ],
    },
  );
}
function goalsReply(q, state, today, ctx, matches) {
  const goalContext = {
    intent: "goal",
    period: currentPeriod(today),
    type: "",
    categoryId: "",
  };
  if (!state.goals.length)
    return response(
      "Sua primeira meta",
      "Você ainda não cadastrou metas. Escolha um objetivo, um valor e um prazo possíveis. Aportes em metas são controles separados; não descontam automaticamente do saldo registrado.",
      {
        context: goalContext,
        actions: [{ page: "metas", label: "Criar uma meta" }],
        suggestions: ["Como criar uma reserva?", "Como economizar mais?"],
      },
    );
  const follow = followPattern.test(q) || ctx?.awaiting === "goal";
  const requestedName = q
    .match(/\bmeta\s+(.+)/)?.[1]
    ?.replace(/[?!.]+$/, "")
    .trim();
  if (
    requestedName &&
    !matches.length &&
    !/^(financeira|para|de quanto|por mes|com |em )/.test(requestedName)
  )
    return clarify(
      "Não encontrei essa meta pelo nome. Qual dos objetivos cadastrados você quer analisar?",
      { ...goalContext, awaiting: "goal" },
      state.goals.slice(0, 4).map((g) => `Como está a meta ${g.name}?`),
    );
  const goal =
    matches.length === 1
      ? matches[0]
      : !matches.length && follow && ctx?.goalId
        ? state.goals.find((g) => g.id === ctx.goalId)
        : state.goals.length === 1
          ? state.goals[0]
          : null;
  if (matches.length > 1)
    return clarify(
      "Encontrei mais de uma meta. Qual você quer analisar?",
      { ...goalContext, awaiting: "goal" },
      matches.slice(0, 4).map((g) => `Como está a meta ${g.name}?`),
    );
  const monthly = inputAmount(q);
  if (
    !goal &&
    (/quanto tempo|guardar|aportar|atingir|alcancar|essa meta|esse objetivo/.test(
      q,
    ) ||
      /meta\s+["“]/.test(q))
  )
    return clarify(
      "Qual meta você quer usar nessa simulação? Informe o nome e, se quiser, um aporte: “quanto tempo para a meta [nome] guardando R$ 300 por mês?”.",
      { ...goalContext, awaiting: "goal" },
      state.goals.slice(0, 4).map((g) => `Como está a meta ${g.name}?`),
    );
  if (!goal)
    return response(
      "Seu mapa de objetivos",
      `Você tem ${state.goals.length} meta(s). A posição abaixo é atual, não um histórico de datas. Escolha uma meta para calcular o que falta ou simular um aporte mensal.`,
      {
        context: goalContext,
        table: {
          headers: ["Meta", "Acumulado", "Objetivo", "Falta"],
          rows: state.goals
            .slice(0, 6)
            .map((g) => [
              g.name,
              fmt(g.current),
              fmt(g.target),
              fmt(Math.max(0, g.target - g.current)),
            ]),
        },
        note: "Os aportes não descontam automaticamente do saldo e não comprovam dinheiro disponível em uma instituição.",
        suggestions: state.goals
          .slice(0, 3)
          .map((g) => `Como está a meta ${g.name}?`),
        actions: [{ page: "metas", label: "Abrir metas" }],
      },
    );
  const remaining = Math.max(0, round(goal.target - goal.current)),
    progress = Math.min(100, (goal.current / goal.target) * 100),
    context = { ...goalContext, goalId: goal.id };
  let planning = "";
  if (remaining === 0)
    planning =
      "O valor registrado já alcançou o objetivo. Confira se o dinheiro está realmente reservado antes de usar.";
  else if (monthly) {
    const months = Math.ceil(cents(remaining) / cents(monthly));
    planning = `Com aportes hipotéticos de ${fmt(monthly)} por mês, seriam necessários ${months} aporte(s) para completar o valor restante, sem rendimento, taxas ou mudanças no objetivo. O último aporte pode ser menor. Essa simulação não cria aportes ou recorrências.`;
  } else if (/guardar|aportar|por mes|quanto tempo/.test(q))
    planning =
      "Para simular o tempo, informe um aporte positivo, por exemplo “e se eu guardar R$ 300 por mês?”.";
  else if (goal.date && goal.date < today)
    planning =
      "O prazo cadastrado já passou. Reveja o prazo ou o objetivo em Metas; não vou pressupor que ele ainda é viável.";
  else if (goal.date) {
    const months =
      (Number(goal.date.slice(0, 4)) - Number(today.slice(0, 4))) * 12 +
      Number(goal.date.slice(5, 7)) -
      Number(today.slice(5, 7)) +
      1;
    planning = `Uma divisão simples do restante em ${months} aporte(s) daria cerca de ${fmt(Math.ceil(cents(remaining) / months) / 100)} por mês. Considerei os meses de calendário, incluindo este mês e o mês do prazo (${dayLabel(goal.date)}). Ajuste às datas em que você realmente recebe; não é uma previsão de rentabilidade.`;
  } else
    planning =
      "Defina um prazo ou informe quanto pretende aportar por mês para montar uma simulação.";
  return response(
    `Meta: ${goal.name}`,
    `Você registrou ${fmt(goal.current)} de ${fmt(goal.target)} (${pct(progress)}). Faltam ${fmt(remaining)}.\n\n${planning}`,
    {
      context,
      metrics: [
        metric("Acumulado", goal.current),
        metric("Falta", remaining),
        metric("Progresso", progress, "percent"),
      ],
      note: "Posição atual. Aportes são controles separados do saldo. O planejamento só é viável se couber na sua renda após os compromissos.",
      suggestions: [
        "E se eu guardar R$ 300 por mês?",
        "E com R$ 500?",
        "Gere Excel dessa meta",
      ],
      actions: [{ page: "metas", label: "Consultar metas" }],
    },
  );
}
function reserveReply(q, state, today) {
  const year = Number(today.slice(0, 4)),
    month = Number(today.slice(5, 7)) - 1;
  const months = Array.from({ length: 3 }, (_, i) =>
    calendarMonth(year, month - i - 1, today, true),
  );
  const populated = months
    .map((p) => ({ p, rows: selectedRows(state, p, "", "expense") }))
    .filter((x) => x.rows.length);
  const manual = /despesas mensais|gasto mensal|custo mensal/.test(q)
    ? inputAmount(q)
    : null;
  if (/despesas mensais|gasto mensal|custo mensal/.test(q) && !manual)
    return clarify(
      "Informe um custo mensal positivo, em reais: por exemplo “reserva com despesas mensais de R$ 2.000”.",
      null,
      ["Simule uma reserva com despesas mensais de R$ 2.000"],
    );
  if (/quanto (tenho|guardei|acumulei)|saldo.*reserva/.test(q)) {
    const reserveGoals = state.goals.filter(
      (g) => clean(g.category || "") === "reserva",
    );
    const saved = reserveGoals.reduce((n, g) => n + cents(g.current), 0) / 100;
    return response(
      "Sua reserva registrada",
      `As ${reserveGoals.length} meta(s) marcadas com a categoria Reserva somam ${fmt(saved)} acumulados. Isso é um controle no aplicativo, não uma consulta de saldo bancário.`,
      {
        context: {
          intent: "reserve",
          period: currentPeriod(today),
          categoryId: "",
          type: "",
        },
        metrics: [metric("Acumulado nas metas de reserva", saved)],
        suggestions: ["Como criar uma reserva?", "Como estão minhas metas?"],
        actions: [{ page: "metas", label: "Consultar metas" }],
      },
    );
  }
  const base =
    manual ||
    (populated.length
      ? round(
          populated.reduce((n, x) => n + cents(sum(x.rows)), 0) /
            populated.length /
            100,
        )
      : 0);
  const context = {
    intent: "reserve",
    period: currentPeriod(today),
    type: "",
    categoryId: "",
  };
  if (!base)
    return response(
      "Vamos estimar sua reserva com uma base melhor",
      "Como referência educativa, uma reserva pode começar com 3 a 6 meses de despesas essenciais, ajustando para estabilidade da renda e responsabilidades. Priorize segurança e liquidez.\n\nNão há despesas nos últimos três meses completos para formar uma média. Não vou tratar um mês em andamento como se já estivesse completo. Você pode informar uma hipótese: “simule uma reserva com despesas mensais de R$ 2.000”.",
      {
        context,
        suggestions: [
          "Simule uma reserva com despesas mensais de R$ 2.000",
          "Como estão minhas metas?",
        ],
        actions: [{ page: "metas", label: "Planejar uma reserva" }],
      },
    );
  const source = manual
    ? "Usei o custo mensal que você informou, como hipótese."
    : `Usei a média dos ${populated.length} mês(es) com despesas entre ${months[2].start.split("-").reverse().join("/")} e ${months[0].end.split("-").reverse().join("/")}. Meses sem registros foram excluídos, não tratados como custo zero.`;
  return response(
    "Uma referência para sua reserva",
    `${source}\n\nBase mensal: ${fmt(base)}. Uma faixa educativa de 3 a 6 meses seria ${fmt(round(base * 3))} a ${fmt(round(base * 6))}.\n\nA média registrada pode conter gastos não essenciais ou faltar despesas. Revise-a antes de definir a meta. Renda variável e responsabilidades maiores podem justificar uma proteção diferente.`,
    {
      context,
      metrics: [
        metric("Base mensal", base),
        metric("3 meses", round(base * 3)),
        metric("6 meses", round(base * 6)),
      ],
      note: "Estimativa educativa, sem promessa de proteção suficiente para qualquer situação. Não criei nem alterei metas.",
      suggestions: ["Como estão minhas metas?", "Como economizar mais?"],
      actions: [{ page: "metas", label: "Ver metas" }],
    },
  );
}
function recurringReply(q, state, today) {
  const requested = q.match(/proximos?\s+(\d+)\s+dias?/),
    days = requested ? Number(requested[1]) : 30;
  if (days < 1 || days > 365)
    return clarify(
      "Escolha de 1 a 365 dias para a previsão de recorrências.",
      null,
      ["Veja minhas recorrências nos próximos 30 dias"],
    );
  if (
    !requested &&
    /mes passado|mes que vem|proximo mes|semana|\d{2}\/\d{2}|\d{4}-\d{2}/.test(
      q,
    )
  )
    return clarify(
      "Para prever regras de recorrência, informe a quantidade de dias a partir de amanhã, por exemplo “próximos 30 dias”. Para consultar registros já gerados, peça os lançamentos do período.",
      null,
      [
        "Veja minhas recorrências nos próximos 30 dias",
        "Liste meus últimos lançamentos",
      ],
    );
  const period = { start: shiftDays(today, 1), end: shiftDays(today, days) },
    list = [];
  let limited = false;
  for (const rule of state.recurring || []) {
    if (rule.status !== "active") continue;
    const copy = { ...rule };
    let loops = 0;
    while (
      nextOccurrence(copy) &&
      dueDate(copy) <= period.end &&
      loops++ < 5000
    ) {
      const date = dueDate(copy);
      if (date >= period.start)
        list.push({
          date,
          description: rule.description,
          amount: rule.amount,
          type: rule.type,
        });
      copy.nextIndex++;
      if (list.length >= 5000) {
        limited = true;
        break;
      }
    }
    if (loops >= 5000 || limited) {
      limited = true;
      break;
    }
  }
  list.sort((a, b) => a.date.localeCompare(b.date));
  const amounts = stats(list),
    context = { intent: "recurring", period, type: "", categoryId: "" };
  return response(
    "O que está previsto nas recorrências",
    `${list.length} ocorrência(s) prevista(s) de ${periodLabel(period)} usando apenas regras ativas.${limited ? " A consulta atingiu o limite de 5.000 ocorrências; os totais são parciais. Reduza a janela." : ""}\n\n${list.length ? "Estes valores são estimativas do calendário, não lançamentos já realizados. Mudanças ou pausas nas regras alteram a previsão." : "Não há vencimentos ativos nessa janela. Regras pausadas ou encerradas não entram na previsão."} O Y Finance registra ocorrências, mas não efetua pagamentos nem consulta contas bancárias.`,
    {
      context,
      metrics: [
        metric("Receitas previstas", amounts.income),
        metric("Despesas previstas", amounts.expense),
        metric("Ocorrências", list.length, "number"),
      ],
      table: list.length
        ? {
            headers: ["Data prevista", "Descrição", "Tipo", "Valor"],
            rows: list
              .slice(0, 8)
              .map((t) => [
                dayLabel(t.date),
                t.description,
                t.type === "income" ? "Receita" : "Despesa",
                fmt(t.amount),
              ]),
          }
        : null,
      note: "A janela começa amanhã. A previsão não inclui contas manuais, dívidas não cadastradas ou novas receitas incertas. Nenhum registro foi criado por esta resposta.",
      suggestions: [
        "Veja minhas recorrências nos próximos 7 dias",
        "Gere Excel das recorrências",
      ],
      actions: [{ page: "recorrencias", label: "Gerenciar recorrências" }],
    },
  );
}
function trendReply(q, state, today) {
  const raw = q.match(/(?:ultimos?\s+)?(\d+)\s+mes/),
    n = raw ? Number(raw[1]) : 6;
  if (n < 2 || n > 24)
    return clarify("Escolha entre 2 e 24 meses para a evolução mensal.", null, [
      "Mostre a evolução dos últimos 6 meses",
    ]);
  if (
    /categoria\s+\S/.test(q) ||
    state.categories.some((c) => matchesName(q, c.name))
  )
    return clarify(
      "A evolução mensal mostra a conta inteira. Para uma categoria específica, peça uma comparação de períodos, por exemplo “compare meus gastos em Alimentação”.",
      null,
      [
        "Mostre a evolução dos últimos 6 meses",
        "Compare meus gastos em Alimentação",
      ],
    );
  if (!raw && hasPeriod(q.replace(/mes a mes|historico mensal/g, "")))
    return clarify(
      "Para a evolução, informe os últimos 2 a 24 meses. Para datas específicas, peça uma análise ou comparação.",
      null,
      ["Mostre a evolução dos últimos 6 meses"],
    );
  const y = Number(today.slice(0, 4)),
    m = Number(today.slice(5, 7)) - 1;
  const periods = Array.from({ length: n }, (_, i) =>
    calendarMonth(y, m - n + i + 1, today),
  );
  const table = {
    headers: ["Mês", "Receitas", "Despesas", "Saldo"],
    rows: periods.map((p) => {
      const x = stats(selectedRows(state, p));
      return [
        p.start.slice(5, 7) + "/" + p.start.slice(0, 4),
        fmt(x.income),
        fmt(x.expense),
        fmt(x.balance),
      ];
    }),
  };
  const period = { start: periods[0].start, end: today };
  return response(
    "Sua evolução mês a mês",
    `Visão dos últimos ${n} meses de calendário, incluindo o mês atual somente até hoje. Compare os valores observando meses incompletos e registros faltantes; isso não é uma previsão de renda futura.`,
    {
      context: { intent: "trend", period, categoryId: "", type: "" },
      table,
      note: "Zeros indicam que não há valores registrados naquele recorte; não comprovam ausência de movimentação. O mês atual pode ter menos dias que os demais.",
      suggestions: ["Compare com o mês passado", "Gere Excel desse período"],
    },
  );
}
