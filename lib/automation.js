import { randomUUID } from "node:crypto";
export const frequencies = {
  daily: "Diária",
  weekly: "Semanal",
  monthly: "Mensal",
  yearly: "Anual",
};
export const todayBR = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(
    new Date(),
  );
const iso = (d) => d.toISOString().slice(0, 10);
export function validDate(value) {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    iso(new Date(value)) === value
  );
}
export function dueDate(rule, index = rule.nextIndex || 0) {
  const [year, month, day] = rule.startDate.split("-").map(Number);
  if (rule.frequency === "daily" || rule.frequency === "weekly")
    return iso(
      new Date(
        Date.UTC(
          year,
          month - 1,
          day + index * (rule.frequency === "weekly" ? 7 : 1),
        ),
      ),
    );
  const target = new Date(
    Date.UTC(
      year + (rule.frequency === "yearly" ? index : 0),
      month - 1 + (rule.frequency === "monthly" ? index : 0),
      1,
    ),
  );
  const last = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  return iso(
    new Date(
      Date.UTC(
        target.getUTCFullYear(),
        target.getUTCMonth(),
        Math.min(day, last),
      ),
    ),
  );
}
export function nextOccurrence(rule) {
  if (rule.status === "ended") return null;
  const date = dueDate(rule);
  return (rule.endDate && date > rule.endDate) ||
    (rule.limit && rule.nextIndex >= rule.limit)
    ? null
    : date;
}
export function ensureAutomation(s) {
  let changed = false;
  for (const [key, value] of Object.entries({
    recurring: [],
    notifications: [],
    budgetAlerts: {},
  }))
    if (!s[key]) {
      s[key] = value;
      changed = true;
    }
  return changed;
}
export function processDue(s, today = todayBR()) {
  let changed = ensureAutomation(s);
  const created = [];
  for (const rule of s.recurring) {
    if (rule.status !== "active") continue;
    const category = s.categories.find(
      (c) => c.id === rule.categoryId && c.type === rule.type,
    );
    if (!category) {
      rule.status = "paused";
      rule.pauseReason =
        "Categoria indisponível. Edite a regra para continuar.";
      changed = true;
      continue;
    }
    let next = nextOccurrence(rule),
      count = 0;
    while (next && next <= today && count < 10000) {
      const occurrenceKey = `${rule.id}:${next}`;
      // nextIndex is persisted independently of transactions: deleting a posting never regenerates it.
      if (!s.transactions.some((t) => t.occurrenceKey === occurrenceKey)) {
        const txn = {
          id: randomUUID(),
          type: rule.type,
          description: rule.description,
          amount: rule.amount,
          date: next,
          categoryId: rule.categoryId,
          payment: rule.payment,
          notes: rule.notes,
          recurringId: rule.id,
          occurrenceKey,
          generatedAt: new Date().toISOString(),
        };
        s.transactions.push(txn);
        created.push(txn);
        rule.generatedCount = (rule.generatedCount || 0) + 1;
      }
      rule.lastDate = next;
      rule.nextIndex++;
      count++;
      changed = true;
      next = nextOccurrence(rule);
    }
    if (!next) {
      rule.status = "ended";
      rule.endedAt = today;
      changed = true;
    }
  }
  return { changed, created };
}
export function refreshBudgetAlerts(s, today = todayBR()) {
  let changed = ensureAutomation(s);
  const month = today.slice(0, 7),
    now = new Date().toISOString();
  for (const c of s.categories.filter(
    (c) => c.type === "expense" && c.budget > 0,
  )) {
    const cents = s.transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.categoryId === c.id &&
          t.date.startsWith(month),
      )
      .reduce((n, t) => n + Math.round(t.amount * 100), 0);
    const limitCents = Math.round(c.budget * 100),
      threshold =
        cents >= limitCents ? 100 : cents * 100 >= limitCents * 80 ? 80 : 0;
    const key = `${month}:${c.id}`,
      previous = s.budgetAlerts[key] || 0;
    if (threshold && threshold > previous) {
      s.notifications.unshift({
        id: randomUUID(),
        type: "budget",
        categoryId: c.id,
        categoryName: c.name,
        month,
        threshold,
        amount: cents / 100,
        budget: c.budget,
        percent: Math.round((cents / limitCents) * 100),
        title:
          threshold === 100
            ? `${c.name}: orçamento atingido`
            : `${c.name}: atenção ao orçamento`,
        createdAt: now,
        readAt: null,
      });
      s.budgetAlerts[key] = threshold;
      changed = true;
    }
  }
  if (s.notifications.length > 300) {
    s.notifications = s.notifications.slice(0, 300);
    changed = true;
  }
  return changed;
}
export function applyRecurringAction(
  s,
  action,
  p,
  { fail, text, money, today = todayBR() },
) {
  ensureAutomation(s);
  const find = () => {
    const r = s.recurring.find((r) => r.id === p.id);
    if (!r) throw fail("Recorrência não encontrada.", 404);
    return r;
  };
  if (action === "recurring.save") {
    const old = p.id ? find() : null;
    if (old?.status === "ended")
      throw fail(
        "Uma recorrência encerrada não pode ser editada. Crie uma nova.",
      );
    if (
      !["income", "expense"].includes(p.type) ||
      typeof p.frequency !== "string" ||
      !Object.hasOwn(frequencies, p.frequency)
    )
      throw fail("Tipo ou frequência inválidos.");
    const category = s.categories.find(
      (c) => c.id === p.categoryId && c.type === p.type,
    );
    if (!category) throw fail("Escolha uma categoria compatível.");
    if (!validDate(p.startDate) || p.startDate > "2099-12-31")
      throw fail("Informe uma data inicial válida até 2099.");
    if (!old && p.startDate < today)
      throw fail("A primeira ocorrência deve ser hoje ou uma data futura.");
    if (
      old &&
      (old.startDate !== p.startDate ||
        old.frequency !== p.frequency ||
        old.type !== p.type)
    )
      throw fail(
        "Data inicial, tipo e frequência não podem ser alterados. Encerre a regra e crie outra para mudar o calendário.",
      );
    const endDate = p.endDate || "";
    if (
      endDate &&
      (!validDate(endDate) ||
        endDate < p.startDate ||
        endDate < today ||
        endDate > "2099-12-31")
    )
      throw fail(
        "A data final deve ser hoje ou futura, após a data inicial e até 2099.",
      );
    const limit = p.limit === "" || p.limit == null ? null : Number(p.limit);
    if (
      limit !== null &&
      (!Number.isInteger(limit) ||
        limit < 1 ||
        limit > 1200 ||
        (old && limit <= old.nextIndex))
    )
      throw fail(
        "Informe de 1 a 1.200 ocorrências; ao editar, o limite deve superar as datas já processadas.",
      );
    const rule = {
      id: old?.id || randomUUID(),
      type: p.type,
      description: text(p.description, 120),
      amount: money(p.amount),
      categoryId: category.id,
      payment: text(p.payment || "Pix", 40),
      notes: typeof p.notes === "string" ? p.notes.slice(0, 1000) : "",
      frequency: p.frequency,
      startDate: p.startDate,
      endDate,
      limit,
      status: old?.status || "active",
      nextIndex: old?.nextIndex || 0,
      generatedCount: old?.generatedCount || 0,
      lastDate: old?.lastDate || "",
      createdAt: old?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    s.recurring = s.recurring.filter((r) => r.id !== rule.id).concat(rule);
  } else if (action === "recurring.pause") {
    const r = find();
    if (r.status !== "active")
      throw fail("Só é possível pausar uma recorrência ativa.");
    r.status = "paused";
    r.pausedAt = today;
  } else if (action === "recurring.resume") {
    const r = find();
    if (r.status !== "paused")
      throw fail("Só é possível retomar uma recorrência pausada.");
    // Paused dates are skipped, not charged retroactively. The original day remains the anchor.
    let n = 0;
    while (nextOccurrence(r) && dueDate(r) < today && n++ < 10000)
      r.nextIndex++;
    r.status = nextOccurrence(r) ? "active" : "ended";
    r.pauseReason = "";
    r.updatedAt = new Date().toISOString();
  } else if (action === "recurring.end") {
    const r = find();
    if (r.status === "ended") throw fail("Esta recorrência já foi encerrada.");
    r.status = "ended";
    r.endedAt = today;
  } else if (action === "recurring.check") {
    /* maintenance runs immediately after this action */
  } else throw fail("Ação de recorrência inválida.");
}
