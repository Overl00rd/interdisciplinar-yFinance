import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  TrendingDown,
  Tags,
  Target,
  GraduationCap,
  Bot,
  Settings,
  Wallet,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  Search,
  SlidersHorizontal,
  Download,
  Pencil,
  Trash2,
  X,
  Check,
  CheckCircle2,
  LogOut,
  Menu,
  Send,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Play,
  Clock,
  Plane,
  House,
  Smartphone,
  PiggyBank,
  Heart,
  ShoppingBag,
  Car,
  Utensils,
  CircleHelp,
  Sun,
  Moon,
  User,
  Lock,
  Mail,
  LoaderCircle,
  Flag,
  Sprout,
  MoreHorizontal,
  Repeat,
  Bell,
  FileSpreadsheet,
} from "lucide-react";
import EducationHub from "./EducationHub.jsx";
import LocalAssistant from "./LocalAssistant.jsx";
import {
  RecurringPage,
  NotificationCenter,
  ReportsPage,
} from "./FinanceTools.jsx";
import "./style.css";
const icons = {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  TrendingDown,
  Tags,
  Target,
  GraduationCap,
  Bot,
  Settings,
  Wallet,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  Search,
  SlidersHorizontal,
  Download,
  Pencil,
  Trash2,
  X,
  Check,
  CheckCircle2,
  LogOut,
  Menu,
  Send,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Play,
  Clock,
  Plane,
  House,
  Smartphone,
  PiggyBank,
  Heart,
  ShoppingBag,
  Car,
  Utensils,
  CircleHelp,
  Sun,
  Moon,
  User,
  Lock,
  Mail,
  LoaderCircle,
  Flag,
  Sprout,
  MoreHorizontal,
  Repeat,
  Bell,
  FileSpreadsheet,
};
const Icon = ({ name, size = 19, ...props }) => {
  const C = icons[name] || Wallet;
  return <C size={size} strokeWidth={1.7} {...props} />;
};
const nav = [
  ["dashboard", "Dashboard", "LayoutDashboard"],
  ["despesas", "Despesas", "Receipt"],
  ["receitas", "Receitas", "TrendingUp"],
  ["recorrencias", "Recorrências", "Repeat"],
  ["categorias", "Categorias", "Tags"],
  ["metas", "Metas", "Target"],
  ["relatorios", "Relatórios Excel", "FileSpreadsheet"],
  ["educacao", "Educação", "GraduationCap"],
  ["ia", "YFinance IA", "Bot"],
  ["configuracoes", "Configurações", "Settings"],
];
const today = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(
    new Date(),
  );
const brl = (n) =>
  Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const monthLabel = (m) =>
  new Date(m + "-15T12:00:00")
    .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    .replace(/^./, (c) => c.toUpperCase());
const dateLabel = (d) =>
  d ? new Date(d + "T12:00:00").toLocaleDateString("pt-BR") : "Sem prazo";
const sum = (a) => a.reduce((n, t) => n + t.amount, 0);
const catIcon = (n) =>
  ({
    Alimentação: "Utensils",
    Transporte: "Car",
    Saúde: "Heart",
    Moradia: "House",
    Compras: "ShoppingBag",
    Educação: "GraduationCap",
    Lazer: "Sparkles",
    Salário: "Wallet",
    Freelance: "TrendingUp",
    Reserva: "ShieldCheck",
    Viagens: "Plane",
    Eletrônicos: "Smartphone",
  })[n] || Tags;
async function api(url, body) {
  const r = await fetch("/api/" + url, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + (localStorage.getItem("yf-token") || ""),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) throw Error(data.error || "Não foi possível concluir.");
  if (data.token) localStorage.setItem("yf-token", data.token);
  return data;
}
function Logo() {
  return (
    <div className="logo">
      <img
        className="brand-logo"
        src="/images/yfinance-logo.png?v=1.2.3"
        width="39"
        height="42"
        alt="Y"
      />
      <div>
        <strong>Finance</strong>
        <small>educação financeira</small>
      </div>
    </div>
  );
}
function App() {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [page, setPage] = useState(location.pathname.slice(1) || "dashboard"),
    [month, setMonth] = useState(today().slice(0, 7)),
    [modal, setModal] = useState(null),
    [toast, setToast] = useState(""),
    [busy, setBusy] = useState(false),
    [mobile, setMobile] = useState(false),
    [hidden, setHidden] = useState(false),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("all"),
    [payment, setPayment] = useState("all"),
    [sort, setSort] = useState("date"),
    [filters, setFilters] = useState(false),
    [chatInput, setChatInput] = useState(""),
    [pendingChat, setPendingChat] = useState(""),
    [downloading, setDownloading] = useState(false),
    [reportPreset, setReportPreset] = useState(null);
  const dataRef = useRef(data),
    busyRef = useRef(busy),
    operationCounter = useRef(0);
  dataRef.current = data;
  busyRef.current = busy;
  const toastTimer = useRef();
  const chatSending = useRef(false);
  useEffect(() => {
    api("bootstrap", {})
      .then((d) => {
        setData(d);
        setHidden(d.state.settings.hide);
      })
      .catch((e) => setError(e.message));
    const pop = () => {
      setPage(location.pathname.slice(1) || "dashboard");
      setQuery("");
      setCategory("all");
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme =
      data?.state.settings.dark === false ? "light" : "dark";
  }, [data?.state.settings.dark]);
  useEffect(() => {
    if (
      page === "despesas" &&
      new URLSearchParams(location.search).get("nova") === "1" &&
      data
    ) {
      setModal({ kind: "transaction", type: "expense" });
      history.replaceState({}, "", "/despesas");
    }
  }, [page, !!data]);
  useEffect(() => {
    if (!data) return;
    let alive = true;
    const refresh = async () => {
      if (document.hidden || busyRef.current) return;
      const counter = operationCounter.current,
        token = localStorage.getItem("yf-token");
      try {
        const latest = await api("state");
        if (
          !alive ||
          busyRef.current ||
          counter !== operationCounter.current ||
          token !== localStorage.getItem("yf-token")
        )
          return;
        const oldIds = new Set(
          (dataRef.current?.state.notifications || []).map((n) => n.id),
        );
        const fresh = (latest.state.notifications || []).filter(
          (n) => !n.readAt && !oldIds.has(n.id),
        );
        if (
          JSON.stringify(latest.state) !==
          JSON.stringify(dataRef.current?.state)
        )
          setData(latest);
        if (fresh.length)
          notify(
            fresh.length === 1
              ? fresh[0].title
              : `${fresh.length} novos alertas de orçamento. Confira o sino.`,
          );
      } catch {
        /* Keep the current UI and retry on the next cycle. */
      }
    };
    const timer = setInterval(refresh, 30000);
    const visible = () => {
      if (!document.hidden) refresh();
    };
    document.addEventListener("visibilitychange", visible);
    return () => {
      alive = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [!!data]);
  async function downloadReport(spec) {
    if (downloading) return;
    if (
      hidden &&
      !window.confirm(
        "O Excel conterá os valores completos, mesmo com os valores ocultos na tela. Deseja baixar?",
      )
    )
      return;
    setDownloading(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (localStorage.getItem("yf-token") || ""),
        },
        body: JSON.stringify(spec),
      });
      if (!response.ok) {
        const error = await response.json();
        throw Error(error.error || "Não foi possível gerar a planilha.");
      }
      const blob = await response.blob();
      const filename =
        response.headers
          .get("content-disposition")
          ?.match(/filename="([^"]+)"/)?.[1] || "YFinance.xlsx";
      const url = URL.createObjectURL(blob),
        link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      notify("Planilha Excel gerada. O download foi iniciado.");
    } catch (e) {
      notify(e.message);
    } finally {
      setDownloading(false);
    }
  }
  function adjustReport(spec) {
    setReportPreset(spec);
    go("relatorios");
  }
  function notify(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 4000);
  }
  function go(path) {
    history.pushState({}, "", "/" + path);
    setPage(path);
    setMobile(false);
    setQuery("");
    setCategory("all");
    setPayment("all");
    window.scrollTo(0, 0);
  }
  async function mutate(action, payload, msg = "Salvo com sucesso!") {
    operationCounter.current++;
    setBusy(true);
    try {
      const d = await api("action", { action, payload });
      const oldIds = new Set(
        (dataRef.current?.state.notifications || []).map((n) => n.id),
      );
      const fresh = (d.state.notifications || []).filter(
        (n) => !n.readAt && !oldIds.has(n.id),
      );
      setData(d);
      if (fresh.length)
        notify(
          `${msg || "Registros atualizados."} • ${fresh.length === 1 ? fresh[0].title : `${fresh.length} novos alertas de orçamento.`}`,
        );
      else if (msg) notify(msg);
      return true;
    } catch (e) {
      notify(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function sendChat(message) {
    if (!message.trim() || busy || chatSending.current) return;
    chatSending.current = true;
    operationCounter.current++;
    if (message.trim() === chatInput.trim()) setChatInput("");
    setPendingChat(message);
    setBusy(true);
    try {
      setData(await api("chat", { message }));
    } catch (e) {
      notify(e.message);
      setChatInput((previous) => previous || message);
    } finally {
      setPendingChat("");
      setBusy(false);
      chatSending.current = false;
    }
  }
  if (!data)
    return (
      <div className="loading">
        <Logo />
        {error ? (
          <>
            <p>{error}</p>
            <button className="primary" onClick={() => location.reload()}>
              Tentar novamente
            </button>
          </>
        ) : (
          <>
            <LoaderCircle className="spin" />
            <p>Organizando seu espaço financeiro...</p>
          </>
        )}
      </div>
    );
  const s = data.state,
    money = (n) => (hidden ? "R$ •••••" : brl(n)),
    transactions = s.transactions.filter((t) => t.date.startsWith(month)),
    incomes = transactions.filter((t) => t.type === "income"),
    expenses = transactions.filter((t) => t.type === "expense"),
    income = sum(incomes),
    expense = sum(expenses),
    balance = income - expense,
    catById = (id) =>
      s.categories.find((c) => c.id === id) || {
        name: "Outros",
        color: "#8e919b",
      },
    spending = s.categories
      .filter((c) => c.type === "expense")
      .map((c) => ({
        ...c,
        total: sum(expenses.filter((t) => t.categoryId === c.id)),
        count: expenses.filter((t) => t.categoryId === c.id).length,
      }))
      .sort((a, b) => b.total - a.total),
    activeSpending = spending.filter((c) => c.total > 0),
    prevDate = new Date(month + "-15T12:00:00");
  prevDate.setMonth(prevDate.getMonth() - 1);
  const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`,
    prevTs = s.transactions.filter((t) => t.date.startsWith(prevMonth)),
    prevBalance =
      sum(prevTs.filter((t) => t.type === "income")) -
      sum(prevTs.filter((t) => t.type === "expense")),
    delta = balance - prevBalance;
  function MonthPicker() {
    return (
      <div className="month-picker">
        <Icon name="CalendarDays" size={16} />
        <label className="sr-only" htmlFor="global-month">
          Mês de referência
        </label>
        <span className="month-display">
          {monthLabel(month).replace(" de ", " ")}
          <Icon name="ChevronDown" size={13} />
        </span>
        <input
          id="global-month"
          aria-label="Mês de referência"
          onClick={(e) => {
            try {
              e.currentTarget.showPicker();
            } catch {}
          }}
          type="month"
          value={month}
          onChange={(e) => e.target.value && setMonth(e.target.value)}
        />
      </div>
    );
  }
  function Header({ title, description, action }) {
    return (
      <header className="page-header">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="header-actions">{action || <MonthPicker />}</div>
      </header>
    );
  }
  function Stat({ label, value, note, icon, color = "red" }) {
    return (
      <div className="card stat">
        <div className="stat-top">
          <span>{label}</span>
          <span className={"icon-tile " + color}>
            <Icon name={icon} />
          </span>
        </div>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    );
  }
  function Empty({
    title = "Nada por aqui ainda",
    text = "Comece adicionando seu primeiro registro.",
    action,
  }) {
    return (
      <div className="empty">
        <span className="empty-icon">
          <Icon name="Wallet" size={30} />
        </span>
        <h3>{title}</h3>
        <p>{text}</p>
        {action}
      </div>
    );
  }
  function Donut() {
    let offset = 0;
    return (
      <div className="donut-wrap">
        <div className="donut">
          <svg viewBox="0 0 240 240">
            <circle
              cx="120"
              cy="120"
              r="91"
              fill="none"
              stroke="var(--border)"
              strokeWidth="31"
            />
            {activeSpending.map((c) => {
              const length = (c.total / expense) * 571.77;
              const el = (
                <circle
                  key={c.id}
                  cx="120"
                  cy="120"
                  r="91"
                  fill="none"
                  stroke={c.color}
                  strokeWidth="31"
                  strokeDasharray={`${Math.max(0, length - 3)} ${571.77 - Math.max(0, length - 3)}`}
                  strokeDashoffset={-offset}
                  transform="rotate(-90 120 120)"
                />
              );
              offset += length;
              return el;
            })}
          </svg>
          <div className="donut-label">
            <small>Total de despesas</small>
            <strong>{money(expense)}</strong>
            <span>{expenses.length} lançamentos</span>
          </div>
        </div>
        <div className="legend">
          {activeSpending.length ? (
            activeSpending.map((c) => (
              <div className="legend-row" key={c.id}>
                <span
                  className="mini-tile"
                  style={{ color: c.color, background: c.color + "15" }}
                >
                  <Icon name={catIcon(c.name)} size={17} />
                </span>
                <div className="legend-data">
                  <div>
                    <span>{c.name}</span>
                    <strong>{money(c.total)}</strong>
                  </div>
                  <div className="track">
                    <i
                      style={{
                        width: (c.total / expense) * 100 + "%",
                        background: c.color,
                      }}
                    />
                  </div>
                </div>
                <small>{Math.round((c.total / expense) * 100)}%</small>
              </div>
            ))
          ) : (
            <p className="muted">Suas despesas aparecerão aqui.</p>
          )}
        </div>
      </div>
    );
  }
  function GoalMini({ g }) {
    const pct = Math.min(100, (g.current / g.target) * 100);
    return (
      <button className="goal-mini" onClick={() => go("metas")}>
        <div className="goal-mini-top">
          <span
            className="icon-tile"
            style={{ color: g.color, background: g.color + "16" }}
          >
            <Icon name={catIcon(g.category)} />
          </span>
          <div>
            <strong>{g.name}</strong>
            <small>
              {money(g.current)} / {money(g.target)}
            </small>
          </div>
          <b>{Math.round(pct)}%</b>
        </div>
        <div className="track">
          <i style={{ width: pct + "%", background: g.color }} />
        </div>
        <small>
          {pct >= 100
            ? "Meta conquistada! 🎉"
            : `Faltam ${money(g.target - g.current)}`}
        </small>
      </button>
    );
  }
  function Table({ items, compact = false }) {
    return items.length ? (
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Data</th>
              {!compact && <th>Pagamento</th>}
              <th className="right">Valor</th>
              <th className="right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => {
              const c = catById(t.categoryId);
              return (
                <tr key={t.id}>
                  <td>
                    <div className="description-cell">
                      <span
                        className="mini-tile"
                        style={{ color: c.color, background: c.color + "14" }}
                      >
                        <Icon name={catIcon(c.name)} size={17} />
                      </span>
                      <span>
                        {t.description}
                        {t.notes && <small>{t.notes}</small>}
                        {t.recurringId && (
                          <small className="recurring-source">
                            <Repeat size={11} />
                            Automático
                          </small>
                        )}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{ color: c.color, background: c.color + "13" }}
                    >
                      {c.name}
                    </span>
                  </td>
                  <td className="muted nowrap">{dateLabel(t.date)}</td>
                  {!compact && <td className="muted">{t.payment}</td>}
                  <td
                    className={
                      "right nowrap " +
                      (t.type === "income" ? "green-text" : "red-text")
                    }
                  >
                    {t.type === "income" ? "+" : "−"} {money(t.amount)}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="icon-btn"
                        aria-label={"Editar " + t.description}
                        onClick={() =>
                          setModal({
                            kind: "transaction",
                            type: t.type,
                            item: t,
                          })
                        }
                      >
                        <Icon name="Pencil" size={15} />
                      </button>
                      <button
                        className="icon-btn danger"
                        aria-label={"Excluir " + t.description}
                        onClick={() =>
                          setModal({
                            kind: "delete",
                            entity: "transaction",
                            item: t,
                          })
                        }
                      >
                        <Icon name="Trash2" size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : (
      <Empty
        title="Nenhum lançamento encontrado"
        text="Adicione um registro ou ajuste os filtros para visualizar seus lançamentos."
      />
    );
  }
  function Dashboard() {
    return (
      <>
        <Header
          title={
            <>
              Olá, {s.profile.name.split(" ")[0] || "você"}!{" "}
              <span className="wave">👋</span>
            </>
          }
          description="Vamos cuidar bem do seu dinheiro hoje?"
        />
        <section className="balance-card">
          <div className="balance-main">
            <div className="balance-title">
              <Icon name="Wallet" size={17} />
              Saldo disponível
              <button
                className="icon-btn"
                aria-label={hidden ? "Mostrar valores" : "Ocultar valores"}
                onClick={() => setHidden(!hidden)}
              >
                <Icon name={hidden ? "EyeOff" : "Eye"} size={17} />
              </button>
            </div>
            <div
              className={
                "balance-number " + (balance >= 0 ? "green-text" : "red-text")
              }
            >
              {money(balance)}
            </div>
            <div className="comparison">
              <span className={delta >= 0 ? "positive" : "negative"}>
                <Icon
                  name={delta >= 0 ? "ArrowUpRight" : "ArrowDownRight"}
                  size={13}
                />
                {money(Math.abs(delta))}
              </span>
              <small>vs. {monthLabel(prevMonth)}</small>
            </div>
          </div>
          <div className="balance-details">
            <div className="balance-detail income">
              <label>
                <Icon name="TrendingUp" size={15} />
                Receitas
              </label>
              <strong>{money(income)}</strong>
              <small>{monthLabel(month)}</small>
            </div>
            <div className="balance-detail expense">
              <label>
                <Icon name="TrendingDown" size={15} />
                Despesas
              </label>
              <strong>{money(expense)}</strong>
              <small>{expenses.length} lançamento(s)</small>
            </div>
          </div>
        </section>
        <div className="two-grid overview-stats">
          <div className="card overview-stat">
            <div className="stat-top">
              <span>Receitas do mês</span>
              <span className="icon-tile green">
                <Icon name="TrendingUp" />
              </span>
            </div>
            <strong>{money(income)}</strong>
            <button className="text-btn" onClick={() => go("receitas")}>
              Ver todas as receitas <Icon name="ArrowRight" size={13} />
            </button>
          </div>
          <div className="card overview-stat">
            <div className="stat-top">
              <span>Despesas do mês</span>
              <span className="icon-tile red">
                <Icon name="TrendingDown" />
              </span>
            </div>
            <strong>{money(expense)}</strong>
            <small className={balance >= 0 ? "green-text" : "red-text"}>
              <Icon name="ArrowDownRight" size={13} />
              {income > 0
                ? `${Math.round((expense / income) * 100)}% da sua renda utilizada neste mês`
                : "Registre receitas para acompanhar seu orçamento"}
            </small>
          </div>
        </div>
        <div className="dashboard-grid">
          <section className="card spending-card">
            <div className="section-heading">
              <div>
                <h2>Visão geral dos seus gastos</h2>
                <p>{monthLabel(month)}</p>
              </div>
              <button className="text-btn" onClick={() => go("despesas")}>
                Ver detalhes <Icon name="ArrowRight" size={14} />
              </button>
            </div>
            <Donut />
            <div className="insight-line">
              <Icon name="CircleHelp" size={16} />
              <p>
                {activeSpending[0] ? (
                  <>
                    <b>{activeSpending[0].name}</b> representa{" "}
                    {Math.round((activeSpending[0].total / expense) * 100)}% dos
                    seus gastos neste mês.
                  </>
                ) : (
                  "Cada registro ajuda você a entender melhor seu dinheiro."
                )}
              </p>
            </div>
          </section>
          <section className="card goals-card">
            <div className="section-heading">
              <h2>
                Suas metas <span className="count">{s.goals.length}</span>
              </h2>
              <button className="text-btn" onClick={() => go("metas")}>
                Ver todas
              </button>
            </div>
            <div className="goal-mini-list">
              {s.goals.length ? (
                s.goals.slice(0, 3).map((g) => <GoalMini key={g.id} g={g} />)
              ) : (
                <Empty
                  title="Seu próximo sonho começa aqui"
                  text="Crie uma meta e acompanhe cada conquista."
                  action={
                    <button
                      className="primary"
                      onClick={() => setModal({ kind: "goal" })}
                    >
                      Criar meta
                    </button>
                  }
                />
              )}
            </div>
          </section>
        </div>
        <section className="card recent-card">
          <div className="section-heading">
            <div>
              <h2>Últimas movimentações</h2>
              <p>Seu dinheiro, sempre acompanhado.</p>
            </div>
            <button className="text-btn" onClick={() => go("despesas")}>
              Ver lançamentos <Icon name="ArrowRight" size={14} />
            </button>
          </div>
          <Table
            compact
            items={[...transactions]
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 5)}
          />
        </section>
        <button
          className="floating primary"
          onClick={() => setModal({ kind: "transaction", type: "expense" })}
        >
          <Icon name="Plus" size={19} />
          Registrar despesa
        </button>
      </>
    );
  }
  function exportCSV(items) {
    const rows = [
      ["Descrição", "Categoria", "Data", "Pagamento", "Tipo", "Valor"],
      ...items.map((t) => [
        t.description,
        catById(t.categoryId).name,
        t.date,
        t.payment,
        t.type === "income" ? "Receita" : "Despesa",
        t.amount.toFixed(2).replace(".", ","),
      ]),
    ];
    const csv =
      "\uFEFF" +
      rows
        .map((row) =>
          row
            .map(
              (v) =>
                '"' +
                String(v)
                  .replace(/^[=+\-@]/, "'$&")
                  .replaceAll('"', '""') +
                '"',
            )
            .join(";"),
        )
        .join("\r\n");
    download(csv, `yfinance-${page}-${month}.csv`, "text/csv;charset=utf-8");
    notify("Exportação concluída.");
  }
  function download(content, name, type) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function Transactions({ type }) {
    const isIncome = type === "income",
      items = isIncome ? incomes : expenses;
    const sources = s.categories
      .filter((c) => c.type === type)
      .map((c) => ({
        ...c,
        total: sum(items.filter((t) => t.categoryId === c.id)),
      }))
      .sort((a, b) => b.total - a.total);
    const list = items
      .filter(
        (t) =>
          (category === "all" || t.categoryId === category) &&
          (payment === "all" || t.payment === payment) &&
          t.description.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) =>
        sort === "amount"
          ? b.amount - a.amount
          : sort === "oldest"
            ? a.date.localeCompare(b.date)
            : b.date.localeCompare(a.date),
      );
    return (
      <>
        <Header
          title={isIncome ? "Suas receitas" : "Suas despesas"}
          description={
            isIncome
              ? "Registre e acompanhe todo o dinheiro que entra. 💰"
              : "Organize seus gastos. Dê mais espaço para seus planos."
          }
          action={
            <button
              className="primary"
              onClick={() => setModal({ kind: "transaction", type })}
            >
              <Icon name="Plus" />
              Nova {isIncome ? "receita" : "despesa"}
            </button>
          }
        />
        <div className="three-grid">
          <Stat
            label={isIncome ? "Total recebido no mês" : "Total gasto no mês"}
            value={money(sum(items))}
            note={monthLabel(month)}
            icon={isIncome ? "TrendingUp" : "TrendingDown"}
            color={isIncome ? "green" : "red"}
          />
          <Stat
            label={isIncome ? "Receitas cadastradas" : "Despesas cadastradas"}
            value={items.length}
            note="lançamento(s) no mês"
            icon="Receipt"
            color="purple"
          />
          <Stat
            label={
              isIncome ? "Maior fonte de renda" : "Categoria com maior gasto"
            }
            value={money(sources[0]?.total || 0)}
            note={
              sources[0]?.total ? sources[0].name : "Sem registros neste mês"
            }
            icon="Tags"
            color="orange"
          />
        </div>
        {isIncome && (
          <section className="card income-chart">
            <div>
              <h2>Receitas vs. despesas</h2>
              <p className="muted">{monthLabel(month)}</p>
            </div>
            <div className="bar-compare">
              <div>
                <span>Receitas</span>
                <div className="track">
                  <i
                    style={{
                      width:
                        (income / Math.max(income, expense, 1)) * 100 + "%",
                      background: "var(--green)",
                    }}
                  />
                </div>
                <b className="green-text">{money(income)}</b>
              </div>
              <div>
                <span>Despesas</span>
                <div className="track">
                  <i
                    style={{
                      width:
                        (expense / Math.max(income, expense, 1)) * 100 + "%",
                      background: "var(--accent)",
                    }}
                  />
                </div>
                <b className="red-text">{money(expense)}</b>
              </div>
            </div>
            <div className="income-note">
              <Icon name={balance >= 0 ? "Sparkles" : "CircleHelp"} />
              <strong>
                {balance >= 0 ? "Sobrou" : "Faltou"} {money(Math.abs(balance))}{" "}
                no mês {balance >= 0 ? "🎉" : ""}
              </strong>
              <small>
                {balance >= 0
                  ? "Cada passo conta. Continue cuidando do seu futuro!"
                  : "Revise suas despesas e confira suas receitas."}
              </small>
            </div>
          </section>
        )}
        <section className="card transactions-card">
          <div className="filters">
            <MonthPicker />
            <div className="search">
              <Icon name="Search" size={17} />
              <input
                aria-label="Buscar lançamento"
                placeholder="Buscar lançamento..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              className={"secondary " + (filters ? "selected" : "")}
              onClick={() => setFilters(!filters)}
            >
              <Icon name="SlidersHorizontal" size={16} />
              Filtros{category !== "all" ? " •" : ""}
            </button>
            <button className="secondary" onClick={() => exportCSV(list)}>
              <Icon name="Download" size={16} />
              <span className="hide-small">Exportar</span>
            </button>
            <button
              className="secondary"
              onClick={() =>
                adjustReport({
                  kind: isIncome ? "receitas" : "despesas",
                  start: month + "-01",
                  end: new Date(
                    Date.UTC(
                      Number(month.slice(0, 4)),
                      Number(month.slice(5, 7)),
                      0,
                    ),
                  )
                    .toISOString()
                    .slice(0, 10),
                  categoryId: category === "all" ? "" : category,
                })
              }
            >
              <FileSpreadsheet size={16} />
              <span className="hide-small">Excel</span>
            </button>
          </div>
          {filters && (
            <div className="filter-options">
              <select
                aria-label="Filtrar por categoria"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="all">Todas as categorias</option>
                {s.categories
                  .filter((c) => c.type === type)
                  .map((c) => (
                    <option value={c.id} key={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
              <select
                aria-label="Filtrar pagamento"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
              >
                <option value="all">Todos os pagamentos</option>
                {[
                  "Pix",
                  "Dinheiro",
                  "Cartão de crédito",
                  "Cartão de débito",
                  "Boleto",
                  "Transferência",
                  "Outros",
                ].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
              <button
                className="text-btn"
                onClick={() => {
                  setCategory("all");
                  setPayment("all");
                  setQuery("");
                }}
              >
                Limpar filtros
              </button>
            </div>
          )}
          <div className="table-meta">
            <span>
              {list.length} {isIncome ? "receita(s)" : "despesa(s)"}
            </span>
            <select
              aria-label="Ordenar lançamentos"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="date">Data (recente)</option>
              <option value="oldest">Data (antiga)</option>
              <option value="amount">Maior valor</option>
            </select>
          </div>
          <Table items={list} />
        </section>
      </>
    );
  }
  function Goals() {
    const total = s.goals.reduce((n, g) => n + g.current, 0);
    return (
      <>
        <Header
          title="Suas metas financeiras 🎯"
          description="Transforme seus planos em objetivos e acompanhe cada conquista!"
          action={
            <button
              className="primary"
              onClick={() => setModal({ kind: "goal" })}
            >
              <Icon name="Plus" />
              Criar nova meta
            </button>
          }
        />
        <div className="three-grid">
          <Stat
            label="Total acumulado"
            value={money(total)}
            note="Cada passo é uma conquista"
            icon="PiggyBank"
            color="green"
          />
          <Stat
            label="Objetivo total"
            value={money(s.goals.reduce((n, g) => n + g.target, 0))}
            note="Seus planos para o futuro"
            icon="Target"
          />
          <Stat
            label="Metas concluídas"
            value={`${s.goals.filter((g) => g.current >= g.target).length} / ${s.goals.length}`}
            note="Continue construindo seus sonhos"
            icon="Flag"
            color="purple"
          />
        </div>
        <div className="three-grid goal-grid">
          {s.goals.map((g) => {
            const pct = Math.min(100, (g.current / g.target) * 100),
              remaining = Math.max(0, g.target - g.current),
              months = g.date
                ? Math.max(
                    1,
                    Math.ceil(
                      (new Date(g.date + "T12:00:00") -
                        new Date(today() + "T12:00:00")) /
                        2629800000,
                    ),
                  )
                : 0;
            return (
              <article className="card goal-card" key={g.id}>
                <div className="section-heading">
                  <span
                    className="icon-tile large"
                    style={{ background: g.color + "16", color: g.color }}
                  >
                    <Icon name={catIcon(g.category)} size={24} />
                  </span>
                  <div className="row-actions">
                    <button
                      className="icon-btn"
                      aria-label={"Editar meta " + g.name}
                      onClick={() => setModal({ kind: "goal", item: g })}
                    >
                      <Icon name="Pencil" size={16} />
                    </button>
                    <button
                      className="icon-btn danger"
                      aria-label={"Excluir meta " + g.name}
                      onClick={() =>
                        setModal({ kind: "delete", entity: "goal", item: g })
                      }
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
                <h2>{g.name}</h2>
                <p className="muted">{g.category}</p>
                <div className="goal-amounts">
                  <div>
                    <small>Atual</small>
                    <strong>{money(g.current)}</strong>
                  </div>
                  <div className="right">
                    <small>Objetivo</small>
                    <b>{money(g.target)}</b>
                  </div>
                </div>
                <div className="progress-label">
                  <span>Progresso</span>
                  <strong style={{ color: g.color }}>{pct.toFixed(1)}%</strong>
                </div>
                <div className="track">
                  <i style={{ width: pct + "%", background: g.color }} />
                </div>
                <div className="goal-details">
                  <div>
                    <small>Faltam</small>
                    <b>{money(remaining)}</b>
                  </div>
                  <div>
                    <small>Prazo</small>
                    <b>{dateLabel(g.date)}</b>
                  </div>
                </div>
                <p className="goal-tip">
                  <Icon
                    name={pct >= 100 ? "CheckCircle2" : "CircleHelp"}
                    size={16}
                  />
                  {pct >= 100
                    ? "Você conseguiu! Que venham as próximas conquistas."
                    : g.date
                      ? g.date < today()
                        ? "O prazo passou. Atualize sua meta e continue avançando."
                        : `Guarde ${money(remaining / months)}/mês para atingir no prazo.`
                      : "Sem prazo definido — acompanhe seu progresso livremente."}
                </p>
                <button
                  className="secondary full"
                  onClick={() => setModal({ kind: "deposit", item: g })}
                >
                  <Icon name="Plus" size={17} />
                  Guardar dinheiro
                </button>
              </article>
            );
          })}
        </div>
        {!s.goals.length && (
          <div className="card">
            <Empty
              title="Qual é o seu próximo sonho?"
              text="Uma viagem, uma reserva ou uma nova conquista. Comece com uma meta."
              action={
                <button
                  className="primary"
                  onClick={() => setModal({ kind: "goal" })}
                >
                  Criar primeira meta
                </button>
              }
            />
          </div>
        )}
        <p className="page-footnote">
          <Icon name="CircleHelp" size={15} />
          As metas são um controle separado: os aportes não descontam
          automaticamente do saldo.
        </p>
      </>
    );
  }
  function Categories() {
    return (
      <>
        <Header
          title="Categorias"
          description="Entenda para onde seu dinheiro vai, uma categoria por vez. 📊"
          action={
            <button
              className="primary"
              onClick={() => setModal({ kind: "category" })}
            >
              <Icon name="Plus" />
              Nova categoria
            </button>
          }
        />
        <div className="category-toolbar">
          <MonthPicker />
          <span className="muted">
            Total do mês: <b className="text">{money(expense)}</b>
          </span>
        </div>
        <div className="three-grid category-grid">
          {spending.map((c) => {
            const pct = c.budget ? (c.total / c.budget) * 100 : 0;
            return (
              <article className="card category-card" key={c.id}>
                <div className="section-heading">
                  <span
                    className="icon-tile"
                    style={{ color: c.color, background: c.color + "15" }}
                  >
                    <Icon name={catIcon(c.name)} />
                  </span>
                  <div className="row-actions">
                    <button
                      className="icon-btn"
                      aria-label={"Editar categoria " + c.name}
                      onClick={() => setModal({ kind: "category", item: c })}
                    >
                      <Icon name="Pencil" size={15} />
                    </button>
                    <button
                      className="icon-btn danger"
                      aria-label={"Excluir categoria " + c.name}
                      onClick={() =>
                        setModal({
                          kind: "delete",
                          entity: "category",
                          item: c,
                        })
                      }
                    >
                      <Icon name="Trash2" size={15} />
                    </button>
                  </div>
                </div>
                <h2>{c.name}</h2>
                <p className="muted small">
                  {c.count} lançamento(s) ·{" "}
                  {expense ? Math.round((c.total / expense) * 100) : 0}% do
                  total
                </p>
                <div className="category-amount">{money(c.total)}</div>
                <div className="category-bars">
                  {Array.from({ length: 6 }, (_, i) => {
                    const d = new Date(month + "-15T12:00:00");
                    d.setMonth(d.getMonth() - (5 - i));
                    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
                      value = sum(
                        s.transactions.filter(
                          (t) =>
                            t.categoryId === c.id && t.date.startsWith(key),
                        ),
                      );
                    const max = Math.max(
                      c.total,
                      ...s.transactions
                        .filter((t) => t.categoryId === c.id)
                        .map((t) =>
                          sum(
                            s.transactions.filter(
                              (x) =>
                                x.categoryId === c.id &&
                                x.date.slice(0, 7) === t.date.slice(0, 7),
                            ),
                          ),
                        ),
                      1,
                    );
                    return (
                      <div
                        key={i}
                        title={`${monthLabel(key)}: ${money(value)}`}
                      >
                        <i
                          style={{
                            height: Math.max(3, (value / max) * 55),
                            background: i === 5 ? c.color : c.color + "45",
                          }}
                        />
                        <small>
                          {d
                            .toLocaleDateString("pt-BR", { month: "short" })
                            .replace(".", "")}
                        </small>
                      </div>
                    );
                  })}
                </div>
                <div className="progress-label">
                  <span>Orçamento</span>
                  <small className={pct > 100 ? "red-text" : "muted"}>
                    {c.budget
                      ? pct > 100
                        ? `Excedeu ${money(c.total - c.budget)}`
                        : `Restam ${money(c.budget - c.total)}`
                      : "Não definido"}
                  </small>
                </div>
                <div className="track">
                  <i
                    style={{
                      width: Math.min(100, pct) + "%",
                      background: pct > 100 ? "var(--accent)" : c.color,
                    }}
                  />
                </div>
                <small className="muted">
                  {money(c.total)} de {money(c.budget)}
                </small>
              </article>
            );
          })}
        </div>
        <section className="card">
          <div className="section-heading">
            <div>
              <h2>Categorias de receitas</h2>
              <p>Organize suas fontes de renda.</p>
            </div>
          </div>
          <div className="category-chips">
            {s.categories
              .filter((c) => c.type === "income")
              .map((c) => (
                <div className="category-chip" key={c.id}>
                  <Icon name={catIcon(c.name)} size={17} />
                  {c.name}
                  <button
                    className="icon-btn"
                    aria-label={"Editar categoria " + c.name}
                    onClick={() => setModal({ kind: "category", item: c })}
                  >
                    <Icon name="Pencil" size={14} />
                  </button>
                  <button
                    className="icon-btn danger"
                    aria-label={"Excluir categoria " + c.name}
                    onClick={() =>
                      setModal({ kind: "delete", entity: "category", item: c })
                    }
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
              ))}
          </div>
        </section>
      </>
    );
  }
  function Education() {
    return (
      <EducationHub page={page} state={s} go={go} mutate={mutate} busy={busy} />
    );
  }
  function Assistant() {
    return (
      <LocalAssistant
        state={s}
        aiMode={data.aiMode}
        busy={busy}
        pending={pendingChat}
        chatInput={chatInput}
        setChatInput={setChatInput}
        onSend={sendChat}
        onClear={() => setModal({ kind: "clear-chat" })}
        onDownload={downloadReport}
        downloading={downloading}
        onAdjustReport={adjustReport}
        go={go}
        hidden={hidden}
        onReveal={() => setHidden(false)}
        notify={notify}
      />
    );
  }
  function SettingsPage() {
    return (
      <>
        <Header
          title="Configurações"
          description="Personalize sua experiência no Y Finance."
          action={
            <button
              className="secondary"
              onClick={() =>
                download(
                  JSON.stringify(s, null, 2),
                  "yfinance-backup.json",
                  "application/json",
                )
              }
            >
              <Icon name="Download" size={16} />
              Exportar meus dados
            </button>
          }
        />
        <div className="settings-grid">
          <div>
            <section className="card setting-card">
              <h2>
                <Icon name="User" />
                Perfil
              </h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await mutate("profile.save", {
                    name: new FormData(e.currentTarget).get("name"),
                  });
                }}
              >
                <div className="profile-photo">
                  {(s.profile.name || "U")[0].toUpperCase()}
                </div>
                <Field label="Nome">
                  <input
                    name="name"
                    defaultValue={s.profile.name}
                    required
                    maxLength={80}
                  />
                </Field>
                <Field label="E-mail">
                  <input
                    value={
                      s.profile.email ||
                      "Modo demonstração — sem e-mail vinculado"
                    }
                    readOnly
                  />
                </Field>
                <button className="primary" disabled={busy}>
                  Salvar perfil
                </button>
              </form>
            </section>
            <section className="card setting-card">
              <h2>
                <Icon name="Sun" />
                Aparência
              </h2>
              <div className="toggle-row">
                <div>
                  <strong>Modo escuro</strong>
                  <small>O visual original do Y Finance</small>
                </div>
                <button
                  role="switch"
                  aria-label="Modo escuro"
                  aria-checked={s.settings.dark}
                  className={"toggle " + (s.settings.dark ? "on" : "")}
                  onClick={() =>
                    mutate("settings.save", { dark: !s.settings.dark })
                  }
                >
                  <span />
                </button>
              </div>
              <div className="toggle-row">
                <div>
                  <strong>Ocultar valores por padrão</strong>
                  <small>Esconde saldos ao abrir o aplicativo</small>
                </div>
                <button
                  role="switch"
                  aria-label="Ocultar valores por padrão"
                  aria-checked={s.settings.hide}
                  className={"toggle " + (s.settings.hide ? "on" : "")}
                  onClick={async () => {
                    if (
                      await mutate("settings.save", { hide: !s.settings.hide })
                    )
                      setHidden(!s.settings.hide);
                  }}
                >
                  <span />
                </button>
              </div>
            </section>
            <section className="card setting-card">
              <h2>
                <Icon name="ShieldCheck" />
                Sua conta
              </h2>
              <p>
                {data.demo
                  ? "Você está em uma demonstração individual, com dados fictícios. Crie uma conta para começar suas finanças do zero."
                  : "Sua conta tem dados separados e senha protegida. Os registros são salvos neste servidor."}
              </p>
              {data.demo ? (
                <div className="button-group">
                  <button className="primary" onClick={() => go("register")}>
                    Criar minha conta
                  </button>
                  <button className="secondary" onClick={() => go("login")}>
                    Já tenho conta
                  </button>
                </div>
              ) : (
                <button
                  className="secondary"
                  onClick={async () => {
                    await api("logout", {});
                    localStorage.removeItem("yf-token");
                    location.href = "/login";
                  }}
                >
                  <Icon name="LogOut" size={16} />
                  Sair da conta
                </button>
              )}
            </section>
          </div>
          <section className="card setting-card budgets">
            <h2>
              <Icon name="Wallet" />
              Orçamentos por categoria
            </h2>
            <p>
              Defina limites mensais. Acompanhe em Categorias quando seus gastos
              se aproximarem do orçamento.
            </p>
            {s.categories
              .filter((c) => c.type === "expense")
              .map((c) => (
                <form
                  className="budget-row"
                  key={c.id}
                  onSubmit={(e) => {
                    e.preventDefault();
                    mutate("budget.save", {
                      id: c.id,
                      budget: new FormData(e.currentTarget).get("budget"),
                    });
                  }}
                >
                  <label htmlFor={"budget-" + c.id}>
                    <span
                      className="mini-tile"
                      style={{ color: c.color, background: c.color + "15" }}
                    >
                      <Icon name={catIcon(c.name)} size={17} />
                    </span>
                    {c.name}
                  </label>
                  <div>
                    <span>R$</span>
                    <input
                      id={"budget-" + c.id}
                      name="budget"
                      aria-label={"Orçamento de " + c.name}
                      type="number"
                      min="0"
                      max="1000000000000"
                      step="0.01"
                      defaultValue={c.budget}
                    />
                    <button className="secondary" disabled={busy}>
                      Salvar
                    </button>
                  </div>
                </form>
              ))}
          </section>
        </div>
      </>
    );
  }
  function Auth() {
    const register = page === "register";
    return (
      <div className="auth-screen">
        <div className="auth-brand">
          <Logo />
          <h1>
            Seu dinheiro.
            <br />
            Seus planos.
            <br />
            <span>Seu futuro.</span>
          </h1>
          <p>
            Um lugar para organizar sua vida financeira
            <br />e dar o próximo passo com confiança.
          </p>
          <div className="auth-decoration">
            <div />
            <div />
            <div />
            <Icon name="TrendingUp" size={100} />
          </div>
          <small>Gestão e educação financeira, do seu jeito.</small>
        </div>
        <div className="auth-content">
          <button className="back-btn" onClick={() => go("dashboard")}>
            <Icon name="ArrowLeft" size={16} />
            Voltar à demonstração
          </button>
          <div className="auth-form-wrap">
            <span className="icon-tile large red">
              <Icon name={register ? "User" : "Lock"} size={25} />
            </span>
            <h1>{register ? "Crie sua conta" : "Bem-vindo de volta"}</h1>
            <p>
              {register
                ? "Seu próximo capítulo financeiro começa aqui."
                : "Acesse sua conta e continue de onde parou."}
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const f = Object.fromEntries(new FormData(e.currentTarget));
                if (register && f.password !== f.confirm) {
                  notify("As senhas não coincidem.");
                  return;
                }
                setBusy(true);
                try {
                  const d = await api(
                    "auth/" + (register ? "register" : "login"),
                    f,
                  );
                  setData(d);
                  setHidden(d.state.settings.hide);
                  go("dashboard");
                  notify(
                    register ? "Sua conta foi criada!" : "Bem-vindo de volta!",
                  );
                } catch (e) {
                  notify(e.message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {register && (
                <Field label="Nome">
                  <input
                    autoComplete="name"
                    name="name"
                    required
                    placeholder="Como podemos chamar você?"
                    maxLength={80}
                  />
                </Field>
              )}
              <Field label="E-mail">
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                />
              </Field>
              <Field label="Senha">
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete={register ? "new-password" : "current-password"}
                  placeholder={
                    register ? "Pelo menos 8 caracteres" : "Sua senha"
                  }
                />
              </Field>
              {register && (
                <Field label="Confirmar senha">
                  <input
                    type="password"
                    name="confirm"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    placeholder="Digite sua senha novamente"
                  />
                </Field>
              )}
              <button className="primary full" disabled={busy}>
                {busy ? <LoaderCircle className="spin" size={18} /> : null}
                {register ? "Criar conta" : "Entrar"}
                <Icon name="ArrowRight" size={17} />
              </button>
            </form>
            <p className="auth-switch">
              {register ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
              <button
                className="text-btn"
                onClick={() => go(register ? "login" : "register")}
              >
                {register ? "Entrar" : "Criar conta"}
              </button>
            </p>
            <p className="auth-note">
              <Icon name="ShieldCheck" size={15} />
              Login próprio deste aplicativo. Não use sua senha do Base44.
            </p>
          </div>
        </div>
      </div>
    );
  }
  const rootPage = page.split("/")[0];
  return (
    <>
      {["login", "register"].includes(page) ? (
        Auth()
      ) : (
        <div className="app-shell">
          {mobile && (
            <div className="sidebar-overlay" onClick={() => setMobile(false)} />
          )}
          <aside className={"sidebar " + (mobile ? "open" : "")}>
            <div className="sidebar-brand">
              <Logo />
              <button
                className="icon-btn mobile-close"
                aria-label="Fechar menu"
                onClick={() => setMobile(false)}
              >
                <Icon name="X" />
              </button>
            </div>
            <div className="nav-label">MEU FINANCEIRO</div>
            <nav>
              {nav.map(([url, label, icon], i) => (
                <React.Fragment key={url}>
                  {url === "educacao" && <div className="nav-divider" />}
                  <a
                    aria-label={label}
                    href={"/" + url}
                    className={rootPage === url ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      go(url);
                    }}
                  >
                    <Icon name={icon} size={19} />
                    <span>{label}</span>
                    {url === "ia" && <span className="nav-new">BETA</span>}
                  </a>
                </React.Fragment>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <div className="sidebar-tip">
                <span className="tip-spark">
                  <Icon name="Sparkles" size={17} />
                </span>
                <strong>Seu futuro começa hoje.</strong>
                <p>
                  Um pequeno passo por dia
                  <br />
                  faz toda a diferença.
                </p>
                <button onClick={() => go("educacao")}>
                  Continue aprendendo
                  <Icon name="ArrowUpRight" size={15} />
                </button>
              </div>
              <button
                className="profile-link"
                onClick={() => go("configuracoes")}
              >
                <span className="avatar">
                  {(s.profile.name || "U")[0].toUpperCase()}
                </span>
                <div>
                  <strong>{s.profile.name || "Seu perfil"}</strong>
                  <small>
                    {data.demo ? "Conta demonstração" : "Minha conta"}
                  </small>
                </div>
                <Icon name="ChevronRight" size={16} />
              </button>
            </div>
          </aside>
          <div className="main-shell">
            <div className="mobile-header">
              <button
                className="icon-btn"
                aria-label="Abrir menu"
                onClick={() => setMobile(true)}
              >
                <Icon name="Menu" />
              </button>
              <Logo />
              <button
                className="icon-btn"
                aria-label="Ocultar ou mostrar valores"
                onClick={() => setHidden(!hidden)}
              >
                <Icon name={hidden ? "EyeOff" : "Eye"} size={18} />
              </button>
            </div>
            <div className="top-strip">
              <span>
                <i />
                Seu espaço financeiro
              </span>
              <div>
                {data.demo ? (
                  <button onClick={() => go("register")} className="demo-label">
                    Dados demonstrativos <Icon name="ArrowUpRight" size={13} />
                  </button>
                ) : (
                  <span className="saved-label">
                    <Icon name="ShieldCheck" size={13} />
                    Dados salvos
                  </span>
                )}
                <button
                  className="notification-trigger"
                  aria-label={`Notificações: ${(s.notifications || []).filter((n) => !n.readAt).length} não lidas`}
                  onClick={() => go("notificacoes")}
                >
                  <Bell size={18} />
                  {(s.notifications || []).some((n) => !n.readAt) && (
                    <span>
                      {Math.min(
                        99,
                        s.notifications.filter((n) => !n.readAt).length,
                      )}
                    </span>
                  )}
                </button>
                <span className="top-separator" />
                <button
                  className="icon-btn"
                  aria-label={hidden ? "Mostrar valores" : "Ocultar valores"}
                  onClick={() => setHidden(!hidden)}
                >
                  <Icon name={hidden ? "EyeOff" : "Eye"} size={16} />
                </button>
                <button
                  className="avatar small-avatar"
                  aria-label="Meu perfil"
                  onClick={() => go("configuracoes")}
                >
                  {(s.profile.name || "U")[0].toUpperCase()}
                </button>
              </div>
            </div>
            <main>
              {rootPage === "dashboard" &&
                (s.notifications || []).some((n) => !n.readAt) && (
                  <div className="budget-alert-banner">
                    <Bell size={17} />
                    <p>
                      <strong>
                        {s.notifications.filter((n) => !n.readAt).length}{" "}
                        alerta(s) de orçamento
                      </strong>{" "}
                      esperando sua atenção.
                    </p>
                    <button
                      className="text-btn"
                      onClick={() => go("notificacoes")}
                    >
                      Ver alertas
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}
              {rootPage === "dashboard" ? (
                Dashboard()
              ) : rootPage === "despesas" ? (
                Transactions({ type: "expense" })
              ) : rootPage === "receitas" ? (
                Transactions({ type: "income" })
              ) : rootPage === "metas" ? (
                Goals()
              ) : rootPage === "categorias" ? (
                Categories()
              ) : rootPage === "educacao" ? (
                Education()
              ) : rootPage === "ia" ? (
                Assistant()
              ) : rootPage === "recorrencias" ? (
                <RecurringPage
                  state={s}
                  mutate={mutate}
                  busy={busy}
                  money={money}
                  go={go}
                />
              ) : rootPage === "notificacoes" ? (
                <NotificationCenter
                  state={s}
                  mutate={mutate}
                  busy={busy}
                  money={money}
                  onBudget={(selectedMonth) => {
                    setMonth(selectedMonth);
                    go("categorias");
                  }}
                />
              ) : rootPage === "relatorios" ? (
                <ReportsPage
                  key={JSON.stringify(reportPreset)}
                  state={s}
                  preset={reportPreset}
                  onDownload={downloadReport}
                  downloading={downloading}
                  money={money}
                  go={go}
                />
              ) : rootPage === "configuracoes" ? (
                SettingsPage()
              ) : (
                <Empty
                  title="Página não encontrada"
                  action={
                    <button className="primary" onClick={() => go("dashboard")}>
                      Voltar ao dashboard
                    </button>
                  }
                />
              )}
              <footer>
                <Logo />
                <span>Mais clareza hoje. Mais liberdade amanhã.</span>
                <span>Y Finance © {new Date().getFullYear()}</span>
              </footer>
            </main>
          </div>
        </div>
      )}
      {modal && (
        <Modal
          model={modal}
          close={() => setModal(null)}
          state={s}
          busy={busy}
          mutate={mutate}
        />
      )}
      <div aria-live="polite" className={"toast " + (toast ? "show" : "")}>
        <Icon name="CircleHelp" size={18} />
        {toast}
        <button
          className="icon-btn"
          aria-label="Fechar aviso"
          onClick={() => setToast("")}
        >
          <Icon name="X" size={15} />
        </button>
      </div>
    </>
  );
}
function Field({ label, children, hint }) {
  const id = React.useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {React.cloneElement(children, { id })}
      {hint && <small>{hint}</small>}
    </div>
  );
}
function Modal({ model: m, close, state: s, busy, mutate }) {
  const [formError, setFormError] = useState("");
  const ref = useRef();
  const item = m.item || {};
  const [type, setType] = useState(item.type || m.type || "expense");
  useEffect(() => {
    const previous = document.activeElement;
    const key = (e) => {
      if (e.key === "Escape" && !busy) close();
      if (e.key === "Tab") {
        const els = [
          ...ref.current.querySelectorAll(
            "button:not(:disabled),input,select,textarea",
          ),
        ];
        const first = els[0],
          last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    ref.current.querySelector("input,button")?.focus();
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [busy]);
  const title =
    m.kind === "transaction"
      ? `${item.id ? "Editar" : "Nova"} ${type === "income" ? "receita" : "despesa"}`
      : m.kind === "goal"
        ? `${item.id ? "Editar" : "Criar nova"} meta`
        : m.kind === "category"
          ? `${item.id ? "Editar" : "Nova"} categoria`
          : m.kind === "deposit"
            ? "Um passo mais perto da sua meta"
            : m.kind === "clear-chat"
              ? "Limpar conversa?"
              : "Excluir registro?";
  async function submit(e) {
    e.preventDefault();
    setFormError("");
    const values = Object.fromEntries(new FormData(e.currentTarget));
    let action,
      payload = { ...values };
    if (m.kind === "transaction") {
      action = "transaction.save";
      payload = { ...values, id: item.id, type };
    } else if (m.kind === "goal") {
      action = "goal.save";
      payload = { ...values, id: item.id, current: values.current || 0 };
    } else if (m.kind === "category") {
      action = "category.save";
      payload = { ...values, id: item.id, type };
    } else if (m.kind === "deposit") {
      action = "goal.deposit";
      payload = { id: item.id, amount: values.amount };
    } else if (m.kind === "delete") {
      action = m.entity + ".delete";
      payload = { id: item.id };
    } else if (m.kind === "clear-chat") {
      action = "chat.clear";
      payload = {};
    }
    if (
      await mutate(
        action,
        payload,
        m.kind === "delete"
          ? "Registro excluído."
          : m.kind === "deposit"
            ? "Aporte registrado. Mais perto do seu objetivo!"
            : "Salvo com sucesso!",
      )
    )
      close();
    else
      setFormError(
        "Não foi possível concluir. Confira o aviso e tente novamente.",
      );
  }
  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) close();
      }}
    >
      <section
        className="modal"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-heading">
          <span className="icon-tile red">
            <Icon
              name={
                m.kind === "goal" || m.kind === "deposit"
                  ? "Target"
                  : m.kind === "delete"
                    ? "Trash2"
                    : m.kind === "category"
                      ? "Tags"
                      : "Receipt"
              }
            />
          </span>
          <button
            className="icon-btn"
            aria-label="Fechar formulário"
            disabled={busy}
            onClick={close}
          >
            <Icon name="X" />
          </button>
        </div>
        <h2 id="modal-title">{title}</h2>
        <p className="modal-description">
          {m.kind === "transaction"
            ? "Cada registro deixa sua vida financeira mais clara."
            : m.kind === "goal"
              ? "Dê um nome ao seu plano e comece a construir."
              : m.kind === "deposit"
                ? item.name
                : m.kind === "delete"
                  ? "Essa ação não pode ser desfeita. Os demais registros serão mantidos."
                  : m.kind === "clear-chat"
                    ? "Todas as mensagens desta conversa serão removidas."
                    : "Organize suas finanças do seu jeito."}
        </p>
        <form onSubmit={submit}>
          {m.kind === "transaction" && (
            <>
              <Field
                label={
                  type === "income" ? "Nome da receita" : "Nome da despesa"
                }
              >
                <input
                  name="description"
                  required
                  maxLength={120}
                  defaultValue={item.description}
                  placeholder={
                    type === "income"
                      ? "Ex.: Salário mensal"
                      : "Ex.: Compras no mercado"
                  }
                />
              </Field>
              <div className="two-grid">
                <Field label="Valor (R$)">
                  <input
                    name="amount"
                    type="number"
                    min="0.01"
                    max="1000000000000"
                    step="0.01"
                    required
                    defaultValue={item.amount}
                    placeholder="0,00"
                  />
                </Field>
                <Field label="Data">
                  <input
                    name="date"
                    type="date"
                    required
                    defaultValue={item.date || today()}
                  />
                </Field>
              </div>
              <Field label="Categoria">
                <select
                  name="categoryId"
                  required
                  defaultValue={item.categoryId || ""}
                >
                  <option value="" disabled>
                    Selecione uma categoria
                  </option>
                  {s.categories
                    .filter((c) => c.type === type)
                    .map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </Field>
              <Field label="Forma de pagamento">
                <select name="payment" defaultValue={item.payment || "Pix"}>
                  {[
                    "Pix",
                    "Dinheiro",
                    "Cartão de crédito",
                    "Cartão de débito",
                    "Boleto",
                    "Transferência",
                    "Outros",
                  ].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
              <Field label="Observações (opcional)">
                <textarea
                  name="notes"
                  maxLength={1000}
                  defaultValue={item.notes}
                  placeholder="Algum detalhe que você quer lembrar?"
                  rows={3}
                />
              </Field>
            </>
          )}
          {m.kind === "goal" && (
            <>
              <Field label="Nome da meta">
                <input
                  name="name"
                  required
                  maxLength={120}
                  defaultValue={item.name}
                  placeholder="Ex.: Minha reserva de emergência"
                />
              </Field>
              <div className="two-grid">
                <Field label="Objetivo (R$)">
                  <input
                    name="target"
                    type="number"
                    min="0.01"
                    max="1000000000000"
                    step="0.01"
                    defaultValue={item.target}
                    required
                    placeholder="0,00"
                  />
                </Field>
                <Field label="Já guardado (R$)">
                  <input
                    name="current"
                    type="number"
                    min="0"
                    max="1000000000000"
                    step="0.01"
                    defaultValue={item.current || 0}
                  />
                </Field>
              </div>
              <Field label="Categoria">
                <select
                  name="category"
                  defaultValue={item.category || "Reserva"}
                >
                  {[
                    "Reserva",
                    "Viagens",
                    "Eletrônicos",
                    "Moradia",
                    "Educação",
                    "Veículo",
                    "Outros",
                  ].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
              <div className="two-grid">
                <Field label="Prazo (opcional)">
                  <input name="date" type="date" defaultValue={item.date} />
                </Field>
                <Field label="Cor">
                  <input
                    name="color"
                    type="color"
                    defaultValue={item.color || "#3b82f6"}
                  />
                </Field>
              </div>
            </>
          )}
          {m.kind === "category" && (
            <>
              <Field label="Nome da categoria">
                <input
                  name="name"
                  required
                  maxLength={50}
                  defaultValue={item.name}
                  placeholder="Ex.: Academia"
                />
              </Field>
              <Field label="Tipo">
                <select
                  name="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                </select>
              </Field>
              <div className="two-grid">
                <Field label="Orçamento mensal (R$)">
                  <input
                    name="budget"
                    type="number"
                    min="0"
                    max="1000000000000"
                    step="0.01"
                    defaultValue={item.budget || 0}
                  />
                </Field>
                <Field label="Cor">
                  <input
                    name="color"
                    type="color"
                    defaultValue={item.color || "#3b82f6"}
                  />
                </Field>
              </div>
            </>
          )}
          {m.kind === "deposit" && (
            <>
              <div className="deposit-summary">
                <span>
                  Já guardado<strong>{brl(item.current)}</strong>
                </span>
                <Icon name="ArrowRight" />
                <span>
                  Objetivo<strong>{brl(item.target)}</strong>
                </span>
              </div>
              <Field label="Quanto você quer guardar? (R$)">
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  max="1000000000000"
                  step="0.01"
                  required
                  placeholder="0,00"
                />
              </Field>
              <p className="page-footnote">
                Este aporte atualiza apenas a meta, sem descontar do saldo
                financeiro.
              </p>
            </>
          )}
          {m.kind === "delete" && (
            <div className="delete-name">{item.description || item.name}</div>
          )}
          {formError && (
            <p className="form-error" role="alert">
              {formError}
            </p>
          )}
          <div className="modal-actions">
            <button
              type="button"
              className="secondary"
              onClick={close}
              disabled={busy}
            >
              Cancelar
            </button>
            <button className="primary" disabled={busy}>
              {busy && <LoaderCircle className="spin" size={17} />}
              <Icon name={m.kind === "delete" ? "Trash2" : "Check"} size={17} />
              {m.kind === "delete"
                ? "Sim, excluir"
                : m.kind === "clear-chat"
                  ? "Limpar conversa"
                  : m.kind === "deposit"
                    ? "Guardar dinheiro"
                    : m.kind === "transaction"
                      ? `Salvar ${type === "income" ? "receita" : "despesa"}`
                      : "Salvar"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
