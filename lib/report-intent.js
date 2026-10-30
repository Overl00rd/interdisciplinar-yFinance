import { todayBR, validDate } from "./automation.js";
export const clean = (text) =>
  String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const monthNames = [
  "janeiro",
  "fevereiro",
  "marco",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];
const iso = (d) => d.toISOString().slice(0, 10);
const monthRange = (year, month) => ({
  start: iso(new Date(Date.UTC(year, month, 1))),
  end: iso(new Date(Date.UTC(year, month + 1, 0))),
});
export function reportIntent(message, state, today = todayBR()) {
  const q = clean(message);
  if (!/planilha|excel|xlsx|relatorio/.test(q)) return null;
  if (/nao (quero|gere|gerar|preciso|crie)/.test(q)) return null;
  let kind = "completo";
  if (!/complet|tudo|todas as informacoes|todos os dados/.test(q)) {
    if (/recorren|assinatura/.test(q)) kind = "recorrencias";
    else if (/orcamento|limite/.test(q)) kind = "orcamentos";
    else if (/metas?|objetivos?/.test(q)) kind = "metas";
    else if (/receita|renda|entrada/.test(q) && !/despesa|gasto|saida/.test(q))
      kind = "receitas";
    else if (/despesa|gasto|saida/.test(q) && !/receita|renda|entrada/.test(q))
      kind = "despesas";
  }
  let year = Number(today.slice(0, 4)),
    month = Number(today.slice(5, 7)) - 1;
  let start = today.slice(0, 7) + "-01",
    end = today,
    recognized = false;
  const dates = (
    q.match(/\b(?:\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})\b/g) || []
  ).map((d) => (d.includes("/") ? d.split("/").reverse().join("-") : d));
  if (dates.length) {
    if (
      dates.length !== 2 ||
      dates.some((d) => !validDate(d)) ||
      dates[0] > dates[1]
    )
      return {
        clarification:
          "Para filtrar por datas, informe início e fim válidos. Exemplo: “planilha de despesas de 01/09/2026 a 30/09/2026”. Você também pode escolher o período em Relatórios.",
      };
    [start, end] = dates;
    recognized = true;
  } else if (/ultimos?\s+(\d+)\s+mes/.test(q)) {
    const count = Number(q.match(/ultimos?\s+(\d+)\s+mes/)[1]);
    if (count < 1 || count > 120)
      return { clarification: "Escolha de 1 a 120 meses para a planilha." };
    start = iso(new Date(Date.UTC(year, month - count + 1, 1)));
    end = today;
    recognized = true;
  } else if (/mes passado|mes anterior/.test(q)) {
    ({ start, end } = monthRange(year, month - 1));
    recognized = true;
  } else if (/ano passado|ano anterior/.test(q)) {
    start = `${year - 1}-01-01`;
    end = `${year - 1}-12-31`;
    recognized = true;
  } else if (/este ano|esse ano|deste ano|desse ano|ano atual/.test(q)) {
    start = `${year}-01-01`;
    recognized = true;
  } else if (/todo o historico|historico completo|todos os periodos/.test(q)) {
    const dates = state.transactions.map((t) => t.date).sort();
    start = dates[0] || start;
    end = dates.length && dates.at(-1) > today ? dates.at(-1) : today;
    recognized = true;
  } else {
    const named = monthNames
      .map((name, i) => ({
        i,
        match: new RegExp(`\\b${name}\\b(?:\\s+(?:de\\s+)?(20\\d{2}))?`).exec(
          q,
        ),
      }))
      .filter((x) => x.match);
    const monthCodes =
      q.match(
        /\b(?:20\d{2}-(?:0[1-9]|1[0-2])|(?:0[1-9]|1[0-2])\/20\d{2})\b/g,
      ) || [];
    if (
      monthCodes.length > 1 ||
      (q.match(/\b20\d{2}\b/g) || []).length > 1 ||
      (named.length && /\b(?:desde|ate|entre)\b|a partir/.test(q))
    )
      return {
        clarification:
          "Para esse intervalo, informe as duas datas completas (DD/MM/AAAA), por exemplo “de 01/01/2026 a 30/09/2026”.",
      };
    const yearMonth = q.match(/\b(20\d{2})-(0[1-9]|1[0-2])\b/);
    const monthYear = q.match(/\b(0[1-9]|1[0-2])\/(20\d{2})\b/);
    if (named.length > 1)
      return {
        clarification:
          "Para incluir vários meses, informe as duas datas, por exemplo “de 01/09/2026 a 31/10/2026”, ou peça “últimos 3 meses”.",
      };
    if (named.length === 1) {
      ({ start, end } = monthRange(
        Number(named[0].match[1] || year),
        named[0].i,
      ));
      recognized = true;
    } else if (yearMonth) {
      ({ start, end } = monthRange(
        Number(yearMonth[1]),
        Number(yearMonth[2]) - 1,
      ));
      recognized = true;
    } else if (monthYear) {
      ({ start, end } = monthRange(
        Number(monthYear[2]),
        Number(monthYear[1]) - 1,
      ));
      recognized = true;
    } else if (/\b20\d{2}\b/.test(q)) {
      const y = q.match(/\b20\d{2}\b/)[0];
      start = `${y}-01-01`;
      end = Number(y) === year ? today : `${y}-12-31`;
      recognized = true;
    } else if (/hoje/.test(q)) {
      start = today;
      end = today;
      recognized = true;
    } else if (/ontem/.test(q)) {
      start = iso(new Date(Date.parse(today) - 86400000));
      end = start;
      recognized = true;
    } else if (/este mes|esse mes|deste mes|desse mes|mes atual/.test(q))
      recognized = true;
  }
  if (
    !recognized &&
    /semana|trimestre|semestre|ultimos?|entre |de \d|desde|ate |a partir/.test(
      q,
    )
  )
    return {
      clarification:
        "Não consegui identificar esse período com segurança. Informe início e fim (DD/MM/AAAA), “mês passado”, “este ano” ou “últimos 3 meses”. Também é possível ajustar as datas em Relatórios.",
    };
  let categoryId = "";
  if (
    !["metas", "recorrencias"].includes(kind) &&
    !/todas as categorias/.test(q)
  ) {
    const matches = state.categories.filter((c) => {
      const name = clean(c.name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return (
        name.length > 2 &&
        new RegExp(`(?:^|\\s)${name}(?:$|\\s|[.,!?])`).test(q) &&
        (["despesas", "orcamentos"].includes(kind)
          ? c.type === "expense"
          : kind === "receitas"
            ? c.type === "income"
            : true)
      );
    });
    if (matches.length > 1)
      return {
        clarification:
          "Identifiquei mais de uma categoria. Posso gerar todas as categorias ou uma categoria por arquivo. Qual você prefere?",
      };
    if (matches.length === 1) categoryId = matches[0].id;
    // Do not silently ignore an explicit, unknown category.
    if (/categoria\s+/.test(q) && !categoryId && !/todas as categorias/.test(q))
      return {
        clarification:
          "Não reconheci a categoria informada. Confira o nome em Categorias ou selecione o filtro em Relatórios.",
      };
  }
  return { kind, start, end, categoryId };
}
