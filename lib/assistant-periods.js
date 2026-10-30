import { validDate } from "./automation.js";
import { clean } from "./report-intent.js";

export const monthNames = [
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
export const iso = (date) => date.toISOString().slice(0, 10);
export const shiftDays = (date, amount) =>
  iso(new Date(Date.parse(date) + amount * 86400000));
export const dayLabel = (date) => date.split("-").reverse().join("/");
export const periodLabel = (p) =>
  p.start === p.end
    ? dayLabel(p.start)
    : `${dayLabel(p.start)} a ${dayLabel(p.end)}`;
export function calendarMonth(year, month, today, complete = false) {
  const start = iso(new Date(Date.UTC(year, month, 1)));
  let end = iso(new Date(Date.UTC(year, month + 1, 0)));
  if (!complete && start.slice(0, 7) === today.slice(0, 7)) end = today;
  return { start, end };
}
export function currentPeriod(today) {
  return { start: today.slice(0, 7) + "-01", end: today };
}
export function hasPeriod(text) {
  const q = clean(text);
  return (
    /\b(hoje|ontem|semana|mes|meses|ano|anos|dia|dias|historico|trimestre|semestre|desde|ate|entre)\b|\d{4}-\d{2}|\d{2}\/\d{2}|\b20\d{2}\b/.test(
      q,
    ) || monthNames.some((m) => new RegExp(`\\b${m}\\b`).test(q))
  );
}
const unclear = () => ({
  clarification:
    "Não consegui identificar esse período com segurança. Use “este mês”, “mês passado”, “últimos 30 dias” ou duas datas completas, como 01/09/2026 a 30/09/2026.",
});
export function parsePeriod(
  message,
  state,
  today,
  { inherited, compare = false } = {},
) {
  const q = clean(message),
    year = Number(today.slice(0, 4)),
    month = Number(today.slice(5, 7)) - 1;
  const complete = /mes(?:es)? (?:completo|inteiro)|mes todo/.test(q);
  const dates = (
    q.match(/\b(?:\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})\b/g) || []
  ).map((d) => (d.includes("/") ? d.split("/").reverse().join("-") : d));
  let period, previous;
  if (/periodo anterior/.test(q) && inherited && !compare) {
    period = comparisonPeriod(inherited, today);
  } else if (dates.length) {
    if (
      dates.some((d) => !validDate(d)) ||
      ![1, 2, ...(compare ? [4] : [])].includes(dates.length)
    )
      return unclear();
    if (dates.length === 1) {
      if (/desde|a partir/.test(q)) period = { start: dates[0], end: today };
      else if (/\b(ate|entre)\b/.test(q)) return unclear();
      else period = { start: dates[0], end: dates[0] };
    } else if (dates.length === 4) {
      previous = { start: dates[0], end: dates[1] };
      period = { start: dates[2], end: dates[3] };
    } else period = { start: dates[0], end: dates[1] };
  } else {
    const named = [
      ...q.matchAll(
        new RegExp(
          `\\b(${monthNames.join("|")})\\b(?:\\s+(?:de\\s+)?(20\\d{2}))?`,
          "g",
        ),
      ),
    ];
    const coded = [
      ...q.matchAll(
        /\b(20\d{2})-(0[1-9]|1[0-2])\b|\b(0[1-9]|1[0-2])\/(20\d{2})\b/g,
      ),
    ];
    const months = [
      ...named.map((m) => [Number(m[2] || year), monthNames.indexOf(m[1])]),
      ...coded.map((m) =>
        m[1]
          ? [Number(m[1]), Number(m[2]) - 1]
          : [Number(m[4]), Number(m[3]) - 1],
      ),
    ];
    if (months.length) {
      if (
        months.length > 2 ||
        (months.length === 2 && !compare) ||
        /\b(ate|entre)\b/.test(q)
      )
        return unclear();
      if (months.length === 1) {
        period = calendarMonth(...months[0], today, complete);
        if (/desde|a partir/.test(q)) period.end = today;
      } else {
        const sorted = months
          .map((m) => calendarMonth(...m, today, complete))
          .sort((a, b) => a.start.localeCompare(b.start));
        [previous, period] = sorted;
      }
    } else if (/ultimos?\s+(\d+)\s+dias?/.test(q)) {
      const n = Number(q.match(/ultimos?\s+(\d+)\s+dias?/)[1]);
      if (n < 1 || n > 3660)
        return { clarification: "Escolha de 1 a 3.660 dias para a análise." };
      period = { start: shiftDays(today, 1 - n), end: today };
    } else if (/ultimos?\s+(\d+)\s+mes/.test(q)) {
      const n = Number(q.match(/ultimos?\s+(\d+)\s+mes/)[1]);
      if (n < 1 || n > 120)
        return { clarification: "Escolha de 1 a 120 meses para a análise." };
      period = {
        start: calendarMonth(year, month - n + 1, today).start,
        end: today,
      };
    } else if (/semana passada|semana anterior|ultima semana/.test(q)) {
      const dow = (new Date(today + "T12:00:00Z").getUTCDay() + 6) % 7;
      period = {
        start: shiftDays(today, -dow - 7),
        end: shiftDays(today, -dow - 1),
      };
    } else if (/esta semana|desta semana|nessa semana|semana atual/.test(q)) {
      const dow = (new Date(today + "T12:00:00Z").getUTCDay() + 6) % 7;
      period = { start: shiftDays(today, -dow), end: today };
    } else if (
      /mes passado|mes anterior|ultimo mes/.test(q) &&
      !(compare && /este mes|mes atual/.test(q))
    ) {
      period = calendarMonth(year, month - 1, today, true);
    } else if (
      /ano passado|ano anterior/.test(q) &&
      !(compare && /este ano|ano atual/.test(q))
    ) {
      period = {
        start: `${year - 1}-01-01`,
        end: `${year - 1}-12-31`,
        calendar: "year",
      };
    } else if (/este ano|deste ano|ano atual/.test(q)) {
      period = { start: `${year}-01-01`, end: today, calendar: "year" };
    } else if (/\bontem\b/.test(q))
      period = { start: shiftDays(today, -1), end: shiftDays(today, -1) };
    else if (/\bhoje\b/.test(q)) period = { start: today, end: today };
    else if (/todo o historico|historico completo|todos os periodos/.test(q)) {
      const ds = state.transactions
        .map((t) => t.date)
        .filter((d) => d <= today)
        .sort();
      period = { start: ds[0] || currentPeriod(today).start, end: today };
    } else if (/\b20\d{2}\b/.test(q)) {
      const years = q.match(/\b20\d{2}\b/g);
      if (years.length !== 1) return unclear();
      period = {
        start: years[0] + "-01-01",
        calendar: "year",
        end: Number(years[0]) === year ? today : years[0] + "-12-31",
      };
    } else if (
      /este mes|esse mes|deste mes|desse mes|neste mes|nesse mes|mes atual|mes todo|mes inteiro|mes completo/.test(
        q,
      )
    )
      period = calendarMonth(year, month, today, complete);
    else if (hasPeriod(q)) return unclear();
    else
      period = inherited
        ? {
            start: inherited.start,
            end: inherited.end,
            ...(inherited.calendar ? { calendar: inherited.calendar } : {}),
          }
        : currentPeriod(today);
  }
  for (const p of [period, previous].filter(Boolean)) {
    if (
      !validDate(p.start) ||
      !validDate(p.end) ||
      p.start > p.end ||
      p.start < "1900-01-01" ||
      p.end > "2099-12-31"
    )
      return unclear();
    if ((Date.parse(p.end) - Date.parse(p.start)) / 86400000 > 3660)
      return { clarification: "Use um intervalo de até dez anos por análise." };
  }
  return { period, previous };
}
export function comparisonPeriod(p, today) {
  const y = Number(p.start.slice(0, 4)),
    m = Number(p.start.slice(5, 7)) - 1;
  if (p.calendar === "year") {
    const ey = Number(p.end.slice(0, 4)) - 1,
      em = Number(p.end.slice(5, 7)) - 1;
    const last = calendarMonth(ey, em, today, true).end;
    return {
      start: `${y - 1}-01-01`,
      end:
        last.slice(0, 8) +
        String(
          Math.min(Number(p.end.slice(8)), Number(last.slice(8))),
        ).padStart(2, "0"),
    };
  }
  if (p.start.endsWith("-01") && p.start.slice(0, 7) === p.end.slice(0, 7)) {
    const prior = calendarMonth(y, m - 1, today, true);
    const currentEnd = calendarMonth(y, m, today, true).end;
    if (p.end !== currentEnd)
      prior.end =
        prior.start.slice(0, 8) +
        String(
          Math.min(Number(p.end.slice(8)), Number(prior.end.slice(8))),
        ).padStart(2, "0");
    return prior;
  }
  const days =
    Math.round((Date.parse(p.end) - Date.parse(p.start)) / 86400000) + 1;
  return { start: shiftDays(p.start, -days), end: shiftDays(p.start, -1) };
}
