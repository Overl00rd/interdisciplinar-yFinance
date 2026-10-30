import ExcelJS from "exceljs";
import JSZip from "jszip";
import {
  validDate,
  todayBR,
  frequencies,
  nextOccurrence,
} from "./automation.js";
export const reportNames = {
  completo: "Relatório financeiro completo",
  despesas: "Despesas",
  receitas: "Receitas",
  orcamentos: "Orçamentos",
  metas: "Metas financeiras",
  recorrencias: "Lançamentos recorrentes",
};
const fail = (message) => Object.assign(new Error(message), { status: 400 });
const round = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const total = (rows) => round(rows.reduce((n, r) => n + r.amount, 0));
const asDate = (value) => (value ? new Date(value + "T00:00:00Z") : null);
const moneyFormat = '"R$" #,##0.00;[Red]-"R$" #,##0.00';
const pctFormat = "0.0%";
const xml = (v) =>
  String(v)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
export function normalizeReport(input, state, today = todayBR()) {
  const kind = input?.kind || "completo",
    start = input?.start || today.slice(0, 7) + "-01",
    end = input?.end || today;
  if (typeof kind !== "string" || !Object.hasOwn(reportNames, kind))
    throw fail("Escolha um tipo de planilha válido.");
  if (!validDate(start) || !validDate(end) || start > end)
    throw fail(
      "Informe um período válido, com início anterior ou igual ao fim.",
    );
  if ((Date.parse(end) - Date.parse(start)) / 86400000 > 3660)
    throw fail("Escolha um período de até dez anos por arquivo.");
  const categoryId = input?.categoryId || "";
  if (categoryId && ["metas", "recorrencias"].includes(kind))
    throw fail(
      "O filtro de categoria é aplicado apenas a receitas, despesas e orçamentos.",
    );
  const category = categoryId
    ? state.categories.find((c) => c.id === categoryId)
    : null;
  if (categoryId && !category)
    throw fail("Categoria não encontrada na sua conta.");
  if (
    category &&
    ((["despesas", "orcamentos"].includes(kind) &&
      category.type !== "expense") ||
      (kind === "receitas" && category.type !== "income"))
  )
    throw fail("A categoria não é compatível com a planilha.");
  return { kind, start, end, categoryId };
}
function monthKeys(start, end) {
  const keys = [];
  let y = Number(start.slice(0, 4)),
    m = Number(start.slice(5, 7));
  while (`${y}-${String(m).padStart(2, "0")}` <= end.slice(0, 7)) {
    keys.push(`${y}-${String(m).padStart(2, "0")}`);
    m++;
    if (m === 13) {
      m = 1;
      y++;
    }
  }
  return keys;
}
function createSheet(wb, name, headers, widths, subtitle) {
  const ws = wb.addWorksheet(name, {
    properties: { tabColor: { argb: "FF2563EB" } },
    views: [{ state: "frozen", ySplit: 5, showGridLines: false }],
  });
  widths.forEach((width, i) => (ws.getColumn(i + 1).width = width));
  ws.mergeCells(1, 1, 1, Math.min(headers.length, 8));
  ws.getCell("A1").value = "Y FINANCE  /  " + name.toUpperCase();
  ws.getCell("A1").font = {
    name: "Calibri",
    size: 19,
    bold: true,
    color: { argb: "FFFFFFFF" },
  };
  ws.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF17171D" },
  };
  ws.getRow(1).height = 39;
  ws.mergeCells(2, 1, 2, Math.min(headers.length, 8));
  ws.getCell("A2").value = subtitle;
  ws.getCell("A2").font = { size: 10, color: { argb: "FF6B7280" } };
  ws.getCell("A2").alignment = { wrapText: true, vertical: "middle" };
  ws.getRow(2).height = 31;
  ws.getRow(5).values = headers;
  ws.getRow(5).height = 25;
  ws.getRow(5).eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2563EB" },
    };
    cell.font = {
      name: "Calibri",
      size: 10,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.alignment = { vertical: "middle", wrapText: true };
  });
  ws.pageSetup = {
    orientation: "landscape",
    paperSize: 9,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    printTitlesRow: "1:5",
  };
  ws.headerFooter.oddFooter =
    "&L Y Finance — dados da sua conta &R Página &P de &N";
  return ws;
}
function finishRows(ws, end, columns) {
  ws.autoFilter = {
    from: { row: 5, column: 1 },
    to: { row: Math.max(5, end), column: columns },
  };
  for (let r = 6; r <= end; r++) {
    const row = ws.getRow(r);
    row.height = 27;
    for (let c = 1; c <= columns; c++) {
      const cell = row.getCell(c);
      cell.font = { name: "Calibri", size: 10, color: { argb: "FF262B35" } };
      cell.alignment = { vertical: "middle", wrapText: true };
      if (r % 2 === 0)
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF3F5F9" },
        };
    }
  }
  if (end < 6) {
    ws.getCell("A6").value =
      "Nenhum registro encontrado para os filtros selecionados.";
    ws.getCell("A6").font = { italic: true, color: { argb: "FF6B7280" } };
  }
}
const range = (name, col, length) =>
  `'${name}'!$${col}$6:$${col}$${Math.max(6, 5 + length)}`;
function formula(ws, address, f, result, numFmt = moneyFormat) {
  ws.getCell(address).value = { formula: f, result };
  ws.getCell(address).numFmt = numFmt;
}
export async function createReport(state, rawSpec, today = todayBR()) {
  const spec = normalizeReport(rawSpec, state, today);
  const selectedType =
    spec.kind === "receitas"
      ? "income"
      : ["despesas", "orcamentos"].includes(spec.kind)
        ? "expense"
        : null;
  const financial = ["metas", "recorrencias"].includes(spec.kind)
    ? []
    : state.transactions
        .filter(
          (t) =>
            (!selectedType || t.type === selectedType) &&
            t.date >= spec.start &&
            t.date <= spec.end &&
            (!spec.categoryId || t.categoryId === spec.categoryId),
        )
        .sort((a, b) => a.date.localeCompare(b.date));
  if (financial.length > 50000)
    throw fail("Há mais de 50 mil lançamentos. Reduza o período da planilha.");
  const income = financial.filter((t) => t.type === "income"),
    expense = financial.filter((t) => t.type === "expense");
  const categories = state.categories.filter(
      (c) => !spec.categoryId || c.id === spec.categoryId,
    ),
    byCat = (id) =>
      state.categories.find((c) => c.id === id)?.name || "Categoria removida";
  const wb = new ExcelJS.Workbook();
  wb.creator = "Y Finance";
  wb.subject = reportNames[spec.kind];
  wb.title = reportNames[spec.kind];
  wb.created = new Date();
  wb.calcProperties.fullCalcOnLoad = true;
  const dates = `${spec.start.split("-").reverse().join("/")} a ${spec.end.split("-").reverse().join("/")}`;
  const scope = spec.categoryId
    ? " · Categoria: " + byCat(spec.categoryId)
    : "";
  const summary = createSheet(
    wb,
    "Resumo",
    ["Indicador", "Valor", "Observação"],
    [25, 22, 27, 4, 25, 22, 22, 4, 20, 18, 18, 18],
    `${reportNames[spec.kind]} · ${dates}${scope}`,
  );
  summary.unMergeCells("A1");
  summary.mergeCells("A1:L1");
  summary.unMergeCells("A2");
  summary.mergeCells("A2:L2");
  summary.getCell("A3").value = "Titular: " + (state.profile.name || "Usuário");
  summary.mergeCells("A3:D3");
  summary.getCell("E3").value =
    "Gerado em " +
    new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  summary.mergeCells("E3:L3");
  const includeIncome = ["completo", "receitas"].includes(spec.kind),
    includeExpense = ["completo", "despesas", "orcamentos"].includes(spec.kind);
  function transactionSheet(name, rows) {
    const ws = createSheet(
      wb,
      name,
      [
        "Data",
        "Descrição",
        "Categoria",
        "Pagamento",
        "Origem",
        "Valor",
        "Observações",
        "Identificador",
        "Categoria ID",
      ],
      [15, 34, 23, 22, 18, 20, 45, 39, 39],
      dates +
        scope +
        " · Valores numéricos em reais; edite os registros existentes para recalcular as fórmulas.",
    );
    rows.forEach((t, i) => {
      const r = i + 6;
      ws.getRow(r).values = [
        asDate(t.date),
        t.description,
        byCat(t.categoryId),
        t.payment,
        t.recurringId ? "Recorrente" : "Manual",
        t.amount,
        t.notes || "",
        t.id,
        t.categoryId,
      ];
      ws.getCell(`A${r}`).numFmt = "dd/mm/yyyy";
      ws.getCell(`F${r}`).numFmt = moneyFormat;
    });
    finishRows(ws, rows.length + 5, 9);
    ws.getColumn(9).hidden = true;
    const totalRow = Math.max(7, rows.length + 7);
    ws.getCell(`E${totalRow}`).value = "TOTAL";
    formula(
      ws,
      `F${totalRow}`,
      `SUM(F6:F${Math.max(6, rows.length + 5)})`,
      total(rows),
    );
    ws.getRow(totalRow).font = { bold: true };
  }
  if (includeIncome) transactionSheet("Receitas", income);
  if (includeExpense) transactionSheet("Despesas", expense);
  const months = monthKeys(spec.start, spec.end);
  let budgetTotal = 0;
  if (["completo", "orcamentos"].includes(spec.kind)) {
    const ws = createSheet(
      wb,
      "Orçamentos",
      [
        "Mês",
        "Categoria",
        "Limite mensal atual",
        "Gasto no período",
        "Restante",
        "Uso do limite",
        "Situação",
        "Categoria ID",
      ],
      [15, 26, 23, 22, 22, 18, 23, 38],
      dates +
        scope +
        " · Limites atuais, sem rateio em meses parciais. Não é um histórico de limites antigos.",
    );
    let row = 6;
    for (const month of months)
      for (const cat of categories.filter((c) => c.type === "expense")) {
        const amount = total(
          expense.filter(
            (t) => t.categoryId === cat.id && t.date.startsWith(month),
          ),
        );
        ws.getRow(row).values = [
          asDate(month + "-01"),
          cat.name,
          cat.budget || 0,
          null,
          null,
          null,
          null,
          cat.id,
        ];
        ws.getCell(`A${row}`).numFmt = "mmm/yyyy";
        ws.getCell(`C${row}`).numFmt = moneyFormat;
        const [y, m] = month.split("-").map(Number);
        formula(
          ws,
          `D${row}`,
          `SUMIFS(${range("Despesas", "F", expense.length)},${range("Despesas", "I", expense.length)},H${row},${range("Despesas", "A", expense.length)},">="&DATE(${y},${m},1),${range("Despesas", "A", expense.length)},"<"&DATE(${y},${m + 1},1))`,
          amount,
        );
        formula(
          ws,
          `E${row}`,
          `IF(C${row}>0,C${row}-D${row},0)`,
          cat.budget > 0 ? round(cat.budget - amount) : 0,
        );
        formula(
          ws,
          `F${row}`,
          `IFERROR(D${row}/C${row},0)`,
          cat.budget > 0 ? amount / cat.budget : 0,
          pctFormat,
        );
        formula(
          ws,
          `G${row}`,
          `IF(C${row}=0,"Sem limite",IF(F${row}>=1,"Atingido / excedido",IF(F${row}>=0.8,"Atenção","Dentro do limite")))`,
          !cat.budget
            ? "Sem limite"
            : amount >= cat.budget
              ? "Atingido / excedido"
              : amount >= cat.budget * 0.8
                ? "Atenção"
                : "Dentro do limite",
          "General",
        );
        budgetTotal += cat.budget || 0;
        row++;
      }
    finishRows(ws, row - 1, 8);
    ws.getColumn(8).hidden = true;
    if (row > 6)
      ws.addConditionalFormatting({
        ref: `F6:F${row - 1}`,
        rules: [
          {
            type: "cellIs",
            operator: "greaterThanOrEqual",
            formulae: [1],
            style: {
              font: { color: { argb: "FFD71540" }, bold: true },
              fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFE7ED" },
              },
            },
          },
        ],
      });
  }
  if (["completo", "metas"].includes(spec.kind)) {
    const ws = createSheet(
      wb,
      "Metas",
      [
        "Meta",
        "Categoria",
        "Objetivo",
        "Acumulado",
        "Falta guardar",
        "Progresso",
        "Prazo",
        "Situação",
      ],
      [34, 22, 21, 21, 21, 18, 16, 22],
      "Fotografia atual em " +
        today.split("-").reverse().join("/") +
        ". Metas não são filtradas pelo período nem descontadas do saldo financeiro.",
    );
    state.goals.forEach((g, i) => {
      const r = i + 6;
      ws.getRow(r).values = [
        g.name,
        g.category,
        g.target,
        g.current,
        null,
        null,
        asDate(g.date),
        null,
      ];
      ["C", "D"].forEach(
        (col) => (ws.getCell(`${col}${r}`).numFmt = moneyFormat),
      );
      formula(
        ws,
        `E${r}`,
        `MAX(C${r}-D${r},0)`,
        Math.max(0, round(g.target - g.current)),
      );
      formula(
        ws,
        `F${r}`,
        `IFERROR(MIN(D${r}/C${r},1),0)`,
        Math.min(1, g.current / g.target),
        pctFormat,
      );
      ws.getCell(`G${r}`).numFmt = "dd/mm/yyyy";
      formula(
        ws,
        `H${r}`,
        `IF(D${r}>=C${r},"Concluída","Em andamento")`,
        g.current >= g.target ? "Concluída" : "Em andamento",
        "General",
      );
    });
    finishRows(ws, 5 + state.goals.length, 8);
  }
  if (["completo", "recorrencias"].includes(spec.kind)) {
    const ws = createSheet(
      wb,
      "Recorrências",
      [
        "Descrição",
        "Tipo",
        "Categoria",
        "Frequência",
        "Valor por ocorrência",
        "Início",
        "Próxima data ativa",
        "Fim previsto",
        "Situação",
        "Limite de datas",
        "Gerados",
        "Pagamento",
        "Observações",
        "Identificador",
      ],
      [33, 17, 23, 17, 24, 16, 22, 16, 16, 19, 13, 21, 40, 39],
      "Regras atuais, independentemente do período. Não são pagamentos bancários; datas pausadas não geram lançamentos retroativos.",
    );
    (state.recurring || []).forEach((r, i) => {
      const n = i + 6;
      ws.getRow(n).values = [
        r.description,
        r.type === "income" ? "Receita" : "Despesa",
        byCat(r.categoryId),
        frequencies[r.frequency],
        r.amount,
        asDate(r.startDate),
        r.status === "active" ? asDate(nextOccurrence(r)) : null,
        asDate(r.endDate),
        { active: "Ativa", paused: "Pausada", ended: "Encerrada" }[r.status],
        r.limit || "Sem limite",
        r.generatedCount || 0,
        r.payment,
        r.notes,
        r.id,
      ];
      ws.getCell(`E${n}`).numFmt = moneyFormat;
      ["F", "G", "H"].forEach(
        (c) => (ws.getCell(`${c}${n}`).numFmt = "dd/mm/yyyy"),
      );
    });
    finishRows(ws, 5 + (state.recurring || []).length, 14);
  }
  let metrics;
  if (spec.kind === "metas") {
    const a = round(state.goals.reduce((n, g) => n + g.current, 0)),
      target = round(state.goals.reduce((n, g) => n + g.target, 0));
    metrics = [
      [
        "Acumulado nas metas",
        a,
        `SUM(${range("Metas", "D", state.goals.length)})`,
      ],
      [
        "Objetivos somados",
        target,
        `SUM(${range("Metas", "C", state.goals.length)})`,
      ],
      [
        "Falta guardar",
        round(
          state.goals.reduce(
            (n, g) => n + Math.max(0, g.target - g.current),
            0,
          ),
        ),
        `SUM(${range("Metas", "E", state.goals.length)})`,
      ],
    ];
  } else if (spec.kind === "recorrencias")
    metrics = ["active", "paused", "ended"].map((status) => [
      {
        active: "Regras ativas",
        paused: "Regras pausadas",
        ended: "Regras encerradas",
      }[status],
      (state.recurring || []).filter((r) => r.status === status).length,
      null,
      "0",
    ]);
  else if (spec.kind === "despesas" || spec.kind === "receitas") {
    const rows = spec.kind === "despesas" ? expense : income,
      name = spec.kind === "despesas" ? "Despesas" : "Receitas";
    metrics = [
      [
        "Total do período",
        total(rows),
        `SUM(${range(name, "F", rows.length)})`,
      ],
      ["Lançamentos", rows.length, null, "0"],
      [
        "Valor médio",
        rows.length ? round(total(rows) / rows.length) : 0,
        `IFERROR(AVERAGE(${range(name, "F", rows.length)}),0)`,
      ],
    ];
  } else if (spec.kind === "orcamentos")
    metrics = [
      [
        "Gastos no período",
        total(expense),
        `SUM(${range("Despesas", "F", expense.length)})`,
      ],
      [
        "Limites mensais somados",
        round(budgetTotal),
        `SUM(${range("Orçamentos", "C", months.length * categories.filter((c) => c.type === "expense").length)})`,
      ],
      ["Lançamentos", expense.length, null, "0"],
    ];
  else
    metrics = [
      [
        "Receitas do período",
        total(income),
        `SUM(${range("Receitas", "F", income.length)})`,
      ],
      [
        "Despesas do período",
        total(expense),
        `SUM(${range("Despesas", "F", expense.length)})`,
      ],
      ["Saldo do período", round(total(income) - total(expense)), "B6-B7"],
    ];
  metrics.forEach(([label, value, f, fmt], i) => {
    const r = i + 6;
    summary.getCell(`A${r}`).value = label;
    if (f) formula(summary, `B${r}`, f, value, fmt || moneyFormat);
    else {
      summary.getCell(`B${r}`).value = value;
      summary.getCell(`B${r}`).numFmt = fmt || moneyFormat;
    }
    summary.getRow(r).height = 27;
    summary.getCell(`B${r}`).font = {
      size: 14,
      bold: true,
      color: { argb: "FF2563EB" },
    };
  });
  summary.mergeCells("A10:L10");
  summary.getCell("A10").value = ["metas", "recorrencias"].includes(spec.kind)
    ? "Dados atuais. O período informado não filtra metas ou regras de recorrência."
    : "O saldo é do período selecionado, não um saldo bancário. Aportes em metas são controles separados.";
  summary.getCell("A10").font = {
    italic: true,
    size: 10,
    color: { argb: "FF6B7280" },
  };
  summary.mergeCells("A11:L11");
  summary.getCell("A11").value =
    "Edite valores em linhas existentes nas abas de dados para simular cenários. A planilha não altera o aplicativo.";
  summary.getCell("A11").font = {
    italic: true,
    size: 10,
    color: { argb: "FF6B7280" },
  };
  const graphs = [];
  if (!["metas", "recorrencias"].includes(spec.kind)) {
    summary.getRow(14).values = [
      "Mês",
      "Receitas incluídas",
      "Despesas incluídas",
      null,
      "Categoria de despesa",
      "Total",
    ];
    months.forEach((m, i) => {
      const r = 15 + i,
        [y, mo] = m.split("-").map(Number);
      summary.getCell(`A${r}`).value = m.slice(5) + "/" + m.slice(0, 4);
      for (const [col, name, rows, included] of [
        ["B", "Receitas", income, includeIncome],
        ["C", "Despesas", expense, includeExpense],
      ]) {
        const value = included
          ? total(rows.filter((t) => t.date.startsWith(m)))
          : 0;
        if (included)
          formula(
            summary,
            `${col}${r}`,
            `SUMIFS(${range(name, "F", rows.length)},${range(name, "A", rows.length)},">="&DATE(${y},${mo},1),${range(name, "A", rows.length)},"<"&DATE(${y},${mo + 1},1))`,
            value,
          );
        else summary.getCell(`${col}${r}`).value = 0;
      }
    });
    const cats = includeExpense
      ? categories
          .filter((c) => c.type === "expense")
          .map((c) => ({
            ...c,
            amount: total(expense.filter((t) => t.categoryId === c.id)),
          }))
          .filter((c) => c.amount > 0)
          .sort((a, b) => b.amount - a.amount)
      : [];
    cats.forEach((c, i) => {
      const r = i + 15;
      summary.getCell(`E${r}`).value = c.name;
      summary.getCell(`I${r}`).value = c.id;
      formula(
        summary,
        `F${r}`,
        `SUMIFS(${range("Despesas", "F", expense.length)},${range("Despesas", "I", expense.length)},I${r})`,
        c.amount,
      );
    });
    summary.getColumn(9).hidden = true;
    const row = Math.max(15 + months.length, 15 + cats.length) + 3;
    if (financial.length)
      graphs.push({
        type: "bar",
        title: "Evolução no período",
        row,
        col: 0,
        categories: months.map((m) => m.slice(5) + "/" + m.slice(0, 4)),
        categoryFormula: `'Resumo'!$A$15:$A$${14 + months.length}`,
        series: [
          ["Receitas", "B", income, includeIncome, "18C58C"],
          ["Despesas", "C", expense, includeExpense, "3B82F6"],
        ]
          .filter((x) => x[3])
          .map(([name, col, rows, _, color]) => ({
            name,
            color,
            values: months.map((m) =>
              total(rows.filter((t) => t.date.startsWith(m))),
            ),
            formula: `'Resumo'!$${col}$15:$${col}$${14 + months.length}`,
          })),
      });
    if (cats.length)
      graphs.push({
        type: "doughnut",
        title: "Distribuição das despesas",
        row,
        col: 6,
        categories: cats.map((c) => c.name),
        categoryFormula: `'Resumo'!$E$15:$E$${14 + cats.length}`,
        series: [
          {
            name: "Despesas",
            values: cats.map((c) => c.amount),
            formula: `'Resumo'!$F$15:$F$${14 + cats.length}`,
            color: "3B82F6",
          },
        ],
      });
    if (!financial.length)
      summary.getCell("A12").value =
        "Sem lançamentos no período. Não há gráficos a exibir.";
  } else if (spec.kind === "metas" && state.goals.length) {
    graphs.push({
      type: "bar",
      title: "Objetivo e acumulado por meta",
      row: 14,
      col: 0,
      categories: state.goals.map((g) => g.name),
      categoryFormula: range("Metas", "A", state.goals.length),
      series: [
        {
          name: "Objetivo",
          values: state.goals.map((g) => g.target),
          formula: range("Metas", "C", state.goals.length),
          color: "A375EC",
        },
        {
          name: "Acumulado",
          values: state.goals.map((g) => g.current),
          formula: range("Metas", "D", state.goals.length),
          color: "18C58C",
        },
      ],
    });
  } else if (spec.kind === "recorrencias" && state.recurring?.length)
    graphs.push({
      type: "doughnut",
      title: "Situação das recorrências",
      row: 14,
      col: 0,
      categories: metrics.map((m) => m[0]),
      categoryFormula: "'Resumo'!$A$6:$A$8",
      series: [
        {
          name: "Regras",
          values: metrics.map((m) => m[1]),
          formula: "'Resumo'!$B$6:$B$8",
          color: "3B82F6",
        },
      ],
    });
  summary.views = [{ state: "frozen", ySplit: 5, showGridLines: false }];
  summary.getRow(14).font = {
    bold: true,
    size: 10,
    color: { argb: "FF2563EB" },
  };
  const info = createSheet(
    wb,
    "Leia-me",
    ["Informação", "Detalhe"],
    [30, 110],
    "Como usar e interpretar sua planilha",
  );
  const explanations = [
    ["Titular", state.profile.name || "Usuário"],
    ["Tipo", reportNames[spec.kind]],
    ["Período dos lançamentos", dates],
    ["Categoria", spec.categoryId ? byCat(spec.categoryId) : "Todas"],
    [
      "Origem",
      "Registros desta conta no Y Finance. Nenhum valor foi inventado por IA.",
    ],
    [
      "Privacidade",
      "Este arquivo contém informações financeiras. Guarde-o em local seguro. Senhas, tokens, mensagens e dados de outros usuários não são exportados.",
    ],
    [
      "Monitoramento",
      "Os totais e gráficos refletem os registros incluídos. Fórmulas recalculam ao abrir no Excel ou LibreOffice e ao editar valores em linhas existentes. Para incluir novos lançamentos, gere outro arquivo no aplicativo; as referências não se expandem automaticamente para novas linhas.",
    ],
    [
      "Filtros",
      "Receitas, despesas e gastos por categoria usam as datas selecionadas. Metas e recorrências são a posição atual e não um histórico do período.",
    ],
    [
      "Orçamentos",
      "Utilizam os limites atuais por categoria, repetidos a cada mês do período. Meses parciais não têm limite proporcional. Categoria sem limite mostra restante e percentual como zero e situação Sem limite.",
    ],
    [
      "Recorrências",
      "São registros automáticos, não pagamentos bancários. Pausar ou encerrar não altera lançamentos já gerados.",
    ],
    [
      "Metas",
      "Aportes em metas não são descontados do saldo automaticamente. A planilha não move dinheiro nem grava mudanças no Y Finance.",
    ],
    [
      "Fórmulas e gráficos",
      "Excel e LibreOffice recalculam fórmulas. Alguns visualizadores mostram somente os valores calculados na exportação. Os gráficos são objetos editáveis do Excel.",
    ],
    [
      "Sem dados",
      "Abas vazias não representam erro: nenhum registro corresponde ao período ou não existem dados desse tipo.",
    ],
  ];
  explanations.forEach((r, i) => {
    info.getRow(i + 6).values = r;
    info.getRow(i + 6).height = i >= 6 ? 58 : 27;
  });
  finishRows(info, explanations.length + 5, 2);
  for (let row = 12; row <= explanations.length + 5; row++)
    info.getRow(row).height = 62;
  let buffer = Buffer.from(await wb.xlsx.writeBuffer());
  if (graphs.length) buffer = await addCharts(buffer, graphs);
  return {
    buffer,
    filename: `YFinance-${spec.kind}-${spec.start}-a-${spec.end}.xlsx`,
    spec,
  };
}
function chartXml(chart) {
  const strCache = `<c:strCache><c:ptCount val="${chart.categories.length}"/>${chart.categories.map((v, i) => `<c:pt idx="${i}"><c:v>${xml(v)}</c:v></c:pt>`).join("")}</c:strCache>`;
  const series = chart.series
    .map(
      (s, i) =>
        `<c:ser><c:idx val="${i}"/><c:order val="${i}"/><c:tx><c:v>${xml(s.name)}</c:v></c:tx>${chart.type === "bar" ? `<c:spPr><a:solidFill><a:srgbClr val="${s.color}"/></a:solidFill><a:ln><a:noFill/></a:ln></c:spPr>` : ""}<c:cat><c:strRef><c:f>${xml(chart.categoryFormula)}</c:f>${strCache}</c:strRef></c:cat><c:val><c:numRef><c:f>${xml(s.formula)}</c:f><c:numCache><c:formatCode>${chart.type === "bar" ? "#,##0.00" : "General"}</c:formatCode><c:ptCount val="${s.values.length}"/>${s.values.map((v, j) => `<c:pt idx="${j}"><c:v>${v}</c:v></c:pt>`).join("")}</c:numCache></c:numRef></c:val></c:ser>`,
    )
    .join("");
  const plot =
    chart.type === "bar"
      ? `<c:barChart><c:barDir val="col"/><c:grouping val="clustered"/><c:varyColors val="0"/>${series}<c:gapWidth val="90"/><c:axId val="100"/><c:axId val="200"/></c:barChart><c:catAx><c:axId val="100"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:axPos val="b"/><c:tickLblPos val="nextTo"/><c:crossAx val="200"/><c:crosses val="autoZero"/></c:catAx><c:valAx><c:axId val="200"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:axPos val="l"/><c:majorGridlines/><c:numFmt formatCode="#,##0.00" sourceLinked="0"/><c:tickLblPos val="nextTo"/><c:crossAx val="100"/><c:crosses val="autoZero"/></c:valAx>`
      : `<c:doughnutChart><c:varyColors val="1"/>${series}<c:holeSize val="60"/></c:doughnutChart>`;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><c:lang val="pt-BR"/><c:chart><c:title><c:tx><c:rich><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="pt-BR" sz="1400" b="1"/><a:t>${xml(chart.title)}</a:t></a:r></a:p></c:rich></c:tx><c:overlay val="0"/></c:title><c:autoTitleDeleted val="0"/><c:plotArea><c:layout/>${plot}</c:plotArea><c:legend><c:legendPos val="b"/><c:overlay val="0"/></c:legend><c:plotVisOnly val="1"/><c:dispBlanksAs val="zero"/></c:chart></c:chartSpace>`;
}
async function addCharts(buffer, charts) {
  const zip = await JSZip.loadAsync(buffer),
    ns = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
  const anchors = charts
    .map(
      (c, i) =>
        `<xdr:twoCellAnchor><xdr:from><xdr:col>${c.col}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${c.row}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>${c.col + 6}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${c.row + 18}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to><xdr:graphicFrame macro=""><xdr:nvGraphicFramePr><xdr:cNvPr id="${i + 2}" name="Gráfico ${i + 1}"/><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr><xdr:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/></xdr:xfrm><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart"><c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:r="${ns}" r:id="rId${i + 1}"/></a:graphicData></a:graphic></xdr:graphicFrame><xdr:clientData/></xdr:twoCellAnchor>`,
    )
    .join("");
  zip.file(
    "xl/drawings/drawing1.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">${anchors}</xdr:wsDr>`,
  );
  zip.file(
    "xl/drawings/_rels/drawing1.xml.rels",
    `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${charts.map((_, i) => `<Relationship Id="rId${i + 1}" Type="${ns}/chart" Target="../charts/chart${i + 1}.xml"/>`).join("")}</Relationships>`,
  );
  charts.forEach((c, i) =>
    zip.file(`xl/charts/chart${i + 1}.xml`, chartXml(c)),
  );
  const relPath = "xl/worksheets/_rels/sheet1.xml.rels";
  let rel = zip.file(relPath)
    ? await zip.file(relPath).async("string")
    : '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>';
  rel = rel.replace(
    "</Relationships>",
    `<Relationship Id="rIdYFinanceCharts" Type="${ns}/drawing" Target="../drawings/drawing1.xml"/></Relationships>`,
  );
  zip.file(relPath, rel);
  let sheet = await zip.file("xl/worksheets/sheet1.xml").async("string");
  sheet = sheet.replace(
    "</worksheet>",
    '<drawing r:id="rIdYFinanceCharts"/></worksheet>',
  );
  zip.file("xl/worksheets/sheet1.xml", sheet);
  let types = await zip.file("[Content_Types].xml").async("string");
  types = types.replace(
    "</Types>",
    `<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>${charts.map((_, i) => `<Override PartName="/xl/charts/chart${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>`).join("")}</Types>`,
  );
  zip.file("[Content_Types].xml", types);
  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}
