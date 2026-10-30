import React, { useEffect, useRef, useState } from "react";
import {
  Repeat,
  Plus,
  CalendarDays,
  CalendarClock,
  Pause,
  Play,
  Pencil,
  Square,
  ArrowRight,
  Check,
  CheckCheck,
  CheckCircle2,
  Bell,
  BellRing,
  ShieldCheck,
  Info,
  X,
  FileSpreadsheet,
  Download,
  LoaderCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  SlidersHorizontal,
  Copy,
  AlertTriangle,
} from "lucide-react";
import "./finance-tools.css";
const today = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(
    new Date(),
  );
const dayLabel = (d) =>
  d ? new Date(d + "T12:00:00").toLocaleDateString("pt-BR") : "—";
const moneyDefault = (n) =>
  Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const freqs = {
  daily: "Diária",
  weekly: "Semanal",
  monthly: "Mensal",
  yearly: "Anual",
};
const statusNames = { active: "Ativa", paused: "Pausada", ended: "Encerrada" };
export const reportKinds = [
  [
    "completo",
    "Relatório completo",
    "Uma visão completa do seu dinheiro, em um só arquivo.",
    Wallet,
    [
      "Resumo",
      "Receitas",
      "Despesas",
      "Orçamentos",
      "Metas",
      "Recorrências",
      "Leia-me",
    ],
  ],
  [
    "despesas",
    "Despesas",
    "Acompanhe os gastos, categorias e formas de pagamento.",
    TrendingDown,
    ["Resumo", "Despesas", "Leia-me"],
  ],
  [
    "receitas",
    "Receitas",
    "Organize as entradas e acompanhe suas fontes de renda.",
    TrendingUp,
    ["Resumo", "Receitas", "Leia-me"],
  ],
  [
    "orcamentos",
    "Orçamentos",
    "Compare os limites atuais com os gastos de cada mês.",
    SlidersHorizontal,
    ["Resumo", "Despesas", "Orçamentos", "Leia-me"],
  ],
  [
    "metas",
    "Metas financeiras",
    "Objetivos, valores acumulados e progresso atual.",
    Target,
    ["Resumo", "Metas", "Leia-me"],
  ],
  [
    "recorrencias",
    "Recorrências",
    "Consulte regras, valores, status e próximos vencimentos.",
    Repeat,
    ["Resumo", "Recorrências", "Leia-me"],
  ],
];
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
function ToolDialog({ title, children, close, busy, icon: Icon = Repeat }) {
  const ref = useRef();
  useEffect(() => {
    const old = document.activeElement;
    document.body.style.overflow = "hidden";
    ref.current.querySelector("input,button")?.focus();
    const key = (e) => {
      if (e.key === "Escape" && !busy) close();
      if (e.key === "Tab") {
        const els = [
          ...ref.current.querySelectorAll(
            "button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled)",
          ),
        ];
        if (e.shiftKey && document.activeElement === els[0]) {
          e.preventDefault();
          els.at(-1)?.focus();
        } else if (!e.shiftKey && document.activeElement === els.at(-1)) {
          e.preventDefault();
          els[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", key);
      old?.focus();
    };
  }, [busy]);
  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) close();
      }}
    >
      <section
        ref={ref}
        className="modal finance-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="finance-dialog-title"
      >
        <div className="modal-heading">
          <span className="icon-tile red">
            <Icon size={23} />
          </span>
          <button
            className="icon-btn"
            aria-label="Fechar formulário"
            disabled={busy}
            onClick={close}
          >
            <X size={19} />
          </button>
        </div>
        <h2 id="finance-dialog-title">{title}</h2>
        {children}
      </section>
    </div>
  );
}
export function RecurringPage({
  state,
  mutate,
  busy,
  money = moneyDefault,
  go,
}) {
  const [filter, setFilter] = useState("all"),
    [form, setForm] = useState(null),
    [confirmation, setConfirmation] = useState(null);
  const rules = state.recurring || [],
    active = rules.filter((r) => r.status === "active");
  const week = new Date(Date.parse(today()) + 7 * 86400000)
    .toISOString()
    .slice(0, 10);
  const generated = state.transactions.filter(
    (t) => t.recurringId && t.date.startsWith(today().slice(0, 7)),
  );
  const filtered = rules
    .filter((r) => filter === "all" || r.status === filter)
    .sort(
      (a, b) =>
        ({ active: 0, paused: 1, ended: 2 })[a.status] -
          { active: 0, paused: 1, ended: 2 }[b.status] ||
        (a.nextDue || "9999").localeCompare(b.nextDue || "9999"),
    );
  return (
    <div className="finance-tools">
      <header className="page-header">
        <div>
          <h1>Lançamentos recorrentes</h1>
          <p>Você organiza uma vez. Seus registros acompanham o calendário.</p>
        </div>
        <button className="primary" onClick={() => setForm({})}>
          <Plus size={18} />
          Nova recorrência
        </button>
      </header>
      <div className="three-grid finance-stat-grid">
        {[
          [
            Repeat,
            active.length,
            "Recorrências ativas",
            "Regras que geram lançamentos",
            "red",
          ],
          [
            CalendarClock,
            active.filter((r) => r.nextDue && r.nextDue <= week).length,
            "Vencem em até 7 dias",
            "Quantidade de regras, não de parcelas",
            "purple",
          ],
          [
            CheckCircle2,
            generated.length,
            "Gerados neste mês",
            "Registros presentes nas suas finanças",
            "green",
          ],
        ].map(([Icon, n, title, note, color]) => (
          <div className="card finance-stat" key={title}>
            <div>
              <span>{title}</span>
              <strong>{n}</strong>
              <small>{note}</small>
            </div>
            <span className={"icon-tile " + color}>
              <Icon size={21} />
            </span>
          </div>
        ))}
      </div>
      <div className="automation-banner">
        <span className="automation-live">
          <i />
          AUTOMAÇÃO ATIVA
        </span>
        <p>
          Os registros são criados no vencimento, no horário de São Paulo. Se o
          servidor ficar desligado, os vencidos são processados ao voltar.
        </p>
        <button
          className="text-btn"
          disabled={busy}
          onClick={() =>
            mutate(
              "recurring.check",
              {},
              "Vencimentos verificados. Seus registros estão atualizados.",
            )
          }
        >
          <Repeat size={14} />
          Verificar agora
        </button>
      </div>
      <div className="finance-list-toolbar">
        <div className="finance-filter-tabs">
          {[
            ["all", "Todas"],
            ["active", "Ativas"],
            ["paused", "Pausadas"],
            ["ended", "Encerradas"],
          ].map(([key, label]) => (
            <button
              className={filter === key ? "active" : ""}
              aria-pressed={filter === key}
              key={key}
              onClick={() => setFilter(key)}
            >
              {label}
              <span>
                {key === "all"
                  ? rules.length
                  : rules.filter((r) => r.status === key).length}
              </span>
            </button>
          ))}
        </div>
        <span>{filtered.length} regra(s)</span>
      </div>
      {!filtered.length ? (
        <div className="card finance-empty">
          <span className="icon-tile large red">
            <Repeat size={28} />
          </span>
          <h2>
            {rules.length
              ? "Nenhuma recorrência neste filtro"
              : "Menos tarefas repetidas. Mais controle."}
          </h2>
          <p>
            {rules.length
              ? "Escolha outro filtro para consultar suas regras."
              : "Cadastre seu salário, aluguel ou assinaturas. No vencimento, o lançamento entra automaticamente nas receitas ou despesas."}
          </p>
          {!rules.length && (
            <button className="primary" onClick={() => setForm({})}>
              <Plus size={17} />
              Criar primeira recorrência
            </button>
          )}
        </div>
      ) : (
        <div className="recurring-grid">
          {filtered.map((r) => {
            const cat = state.categories.find((c) => c.id === r.categoryId);
            return (
              <article className={"card recurring-card " + r.status} key={r.id}>
                <div className="section-heading">
                  <span
                    className={
                      "icon-tile " + (r.type === "income" ? "green" : "red")
                    }
                  >
                    {r.type === "income" ? (
                      <TrendingUp size={22} />
                    ) : (
                      <TrendingDown size={22} />
                    )}
                  </span>
                  <span
                    className={
                      "badge " +
                      (r.status === "active"
                        ? "green"
                        : r.status === "paused"
                          ? "orange"
                          : "neutral")
                    }
                  >
                    {statusNames[r.status]}
                  </span>
                </div>
                <h2>{r.description}</h2>
                <p className="recurring-category">
                  {cat?.name || "Categoria indisponível"}
                  <span>·</span>
                  {r.type === "income" ? "Receita" : "Despesa"}
                </p>
                <div className="recurring-amount">
                  <strong>{money(r.amount)}</strong>
                  <span>{freqs[r.frequency]?.toLowerCase()}</span>
                </div>
                <div className="recurring-next">
                  <CalendarDays size={17} />
                  <div>
                    <span>
                      {r.status === "active"
                        ? "Próximo lançamento"
                        : r.status === "paused"
                          ? "Geração pausada"
                          : "Geração encerrada"}
                    </span>
                    <strong>
                      {r.status === "active"
                        ? dayLabel(r.nextDue)
                        : r.status === "paused"
                          ? "Até você retomar"
                          : "Histórico preservado"}
                    </strong>
                  </div>
                </div>
                <div className="recurring-details">
                  <span>
                    Início <b>{dayLabel(r.startDate)}</b>
                  </span>
                  <span>
                    Gerados <b>{r.generatedCount || 0}</b>
                  </span>
                  <span>
                    Fim <b>{r.endDate ? dayLabel(r.endDate) : "Sem data"}</b>
                  </span>
                  <span>
                    Limite <b>{r.limit ? `${r.limit} datas` : "Sem limite"}</b>
                  </span>
                </div>
                {r.pauseReason && <p className="form-error">{r.pauseReason}</p>}
                <div className="recurring-actions">
                  {r.status !== "ended" ? (
                    <>
                      <button className="secondary" onClick={() => setForm(r)}>
                        <Pencil size={14} />
                        Editar
                      </button>
                      <button
                        className="secondary"
                        disabled={busy}
                        onClick={() =>
                          setConfirmation({
                            rule: r,
                            action: r.status === "active" ? "pause" : "resume",
                          })
                        }
                      >
                        {r.status === "active" ? (
                          <Pause size={14} />
                        ) : (
                          <Play size={14} />
                        )}{" "}
                        {r.status === "active" ? "Pausar" : "Retomar"}
                      </button>
                      <button
                        className="icon-btn danger"
                        aria-label={"Encerrar " + r.description}
                        disabled={busy}
                        onClick={() =>
                          setConfirmation({ rule: r, action: "end" })
                        }
                      >
                        <Square size={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      className="secondary full"
                      onClick={() =>
                        setForm({
                          ...r,
                          id: undefined,
                          startDate: today(),
                          endDate: "",
                          limit: "",
                        })
                      }
                    >
                      <Copy size={14} />
                      Criar semelhante
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
      <div className="finance-help">
        <ShieldCheck size={18} />
        <div>
          <h3>Automatiza o registro, não o pagamento.</h3>
          <p>
            O Y Finance não movimenta sua conta bancária. Confirme seus extratos
            e corrija lançamentos quando necessário. Pausar ou encerrar uma
            regra não apaga o que já foi registrado.
          </p>
          <button className="text-btn" onClick={() => go("despesas")}>
            Consultar despesas
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
      {form && (
        <RecurringForm
          key={form.id || "new"}
          item={form}
          state={state}
          busy={busy}
          mutate={mutate}
          close={() => setForm(null)}
        />
      )}
      {confirmation && (
        <ToolDialog
          title={
            {
              pause: "Pausar recorrência?",
              resume: "Retomar recorrência?",
              end: "Encerrar recorrência?",
            }[confirmation.action]
          }
          busy={busy}
          close={() => setConfirmation(null)}
        >
          <p className="modal-description">
            <strong>{confirmation.rule.description}</strong>
            <br />
            {confirmation.action === "pause"
              ? "As próximas datas não serão registradas enquanto a regra estiver pausada. Lançamentos já criados serão mantidos."
              : confirmation.action === "resume"
                ? "As datas anteriores a hoje ocorridas durante a pausa serão ignoradas. Se hoje for um vencimento, o lançamento será criado agora."
                : "A regra não gerará novos registros e não poderá ser reativada. Seus lançamentos anteriores serão mantidos; você poderá criar uma regra semelhante."}
          </p>
          <div className="modal-actions">
            <button
              className="secondary"
              onClick={() => setConfirmation(null)}
              disabled={busy}
            >
              Cancelar
            </button>
            <button
              className="primary"
              disabled={busy}
              onClick={async () => {
                if (
                  await mutate(
                    "recurring." + confirmation.action,
                    { id: confirmation.rule.id },
                    "Recorrência atualizada.",
                  )
                )
                  setConfirmation(null);
              }}
            >
              {busy ? (
                <LoaderCircle className="spin" size={16} />
              ) : (
                <Check size={16} />
              )}
              Confirmar
            </button>
          </div>
        </ToolDialog>
      )}
    </div>
  );
}
function RecurringForm({ item, state, busy, mutate, close }) {
  const editing = !!item.id,
    [type, setType] = useState(item.type || "expense"),
    [start, setStart] = useState(item.startDate || today()),
    [freq, setFreq] = useState(item.frequency || "monthly"),
    [error, setError] = useState("");
  async function save(e) {
    e.preventDefault();
    setError("");
    const p = Object.fromEntries(new FormData(e.currentTarget));
    if (
      await mutate(
        "recurring.save",
        { ...p, id: item.id, type, startDate: start, frequency: freq },
        editing
          ? "Regra atualizada. Os lançamentos anteriores não foram alterados."
          : "Recorrência criada. Os vencimentos de hoje já foram registrados.",
      )
    )
      close();
    else
      setError("Não foi possível salvar. Confira o aviso e revise os campos.");
  }
  return (
    <ToolDialog
      title={editing ? "Editar recorrência" : "Nova recorrência"}
      busy={busy}
      close={close}
    >
      <p className="modal-description">
        {editing
          ? "As alterações de valor e categoria valem apenas para os próximos lançamentos."
          : "Programe uma receita ou despesa e deixe o calendário cuidar dos próximos registros."}
      </p>
      <form onSubmit={save}>
        <div className="recurring-type">
          <button
            type="button"
            disabled={editing || busy}
            className={type === "expense" ? "selected expense" : ""}
            onClick={() => setType("expense")}
          >
            <TrendingDown size={16} />
            Despesa
          </button>
          <button
            type="button"
            disabled={editing || busy}
            className={type === "income" ? "selected income" : ""}
            onClick={() => setType("income")}
          >
            <TrendingUp size={16} />
            Receita
          </button>
        </div>
        <Field label="Descrição">
          <input
            name="description"
            required
            maxLength={120}
            defaultValue={item.description}
            placeholder={
              type === "income"
                ? "Ex.: Salário mensal"
                : "Ex.: Assinatura de streaming"
            }
          />
        </Field>
        <div className="two-grid">
          <Field label="Valor por ocorrência (R$)">
            <input
              name="amount"
              required
              type="number"
              min="0.01"
              max="1000000000000"
              step="0.01"
              defaultValue={item.amount}
              placeholder="0,00"
            />
          </Field>
          <Field label="Frequência">
            <select
              value={freq}
              disabled={editing}
              onChange={(e) => setFreq(e.target.value)}
            >
              {Object.entries(freqs).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Categoria">
          <select
            name="categoryId"
            key={type}
            required
            defaultValue={item.type === type ? item.categoryId || "" : ""}
          >
            <option value="" disabled>
              Selecione uma categoria
            </option>
            {state.categories
              .filter((c) => c.type === type)
              .map((c) => (
                <option key={c.id} value={c.id}>
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
        <div className="two-grid">
          <Field label="Primeira data">
            <input
              type="date"
              value={start}
              min={editing ? undefined : today()}
              max="2099-12-31"
              required
              disabled={editing}
              onChange={(e) => setStart(e.target.value)}
            />
          </Field>
          <Field label="Data final (opcional)">
            <input
              type="date"
              name="endDate"
              min={start > today() ? start : today()}
              max="2099-12-31"
              defaultValue={item.endDate || ""}
            />
          </Field>
        </div>
        <Field
          label="Quantidade de datas (opcional)"
          hint="Deixe em branco para repetir sem limite. Datas ignoradas durante uma pausa contam no calendário do limite."
        >
          <input
            name="limit"
            type="number"
            min={editing ? (item.nextIndex || 0) + 1 : 1}
            max="1200"
            step="1"
            defaultValue={item.limit || ""}
            placeholder="Ex.: 12"
          />
        </Field>
        <Field label="Observações (opcional)">
          <textarea
            name="notes"
            rows={2}
            maxLength={1000}
            defaultValue={item.notes || ""}
          />
        </Field>
        {["monthly", "yearly"].includes(freq) && (
          <p className="recurring-form-note">
            <Info size={15} />
            Quando o dia não existir no mês, será usado o último dia. Nas
            próximas ocorrências, o dia original é mantido.
          </p>
        )}
        {!editing && start === today() && (
          <p className="recurring-form-note immediate">
            <CalendarClock size={16} />A primeira data é hoje. Ao salvar, o
            primeiro lançamento entrará no saldo automaticamente.
          </p>
        )}
        {editing && (
          <p className="recurring-form-note">
            <Info size={15} />
            Para mudar o tipo, a primeira data ou a frequência, encerre esta
            regra e crie uma nova.
          </p>
        )}
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <div className="modal-actions">
          <button
            type="button"
            className="secondary"
            disabled={busy}
            onClick={close}
          >
            Cancelar
          </button>
          <button className="primary" disabled={busy}>
            {busy ? (
              <LoaderCircle className="spin" size={16} />
            ) : (
              <Check size={16} />
            )}{" "}
            {editing ? "Salvar alterações" : "Criar e ativar"}
          </button>
        </div>
      </form>
    </ToolDialog>
  );
}
export function NotificationCenter({
  state,
  mutate,
  busy,
  money = moneyDefault,
  onBudget,
}) {
  const [filter, setFilter] = useState("unread"),
    notifications = state.notifications || [],
    unread = notifications.filter((n) => !n.readAt),
    list = filter === "unread" ? unread : notifications;
  return (
    <div className="finance-tools">
      <header className="page-header">
        <div>
          <h1>Seus alertas</h1>
          <p>Um aviso na hora certa faz diferença no fim do mês.</p>
        </div>
        <button
          className="secondary"
          disabled={busy || !unread.length}
          onClick={() =>
            mutate(
              "notification.readAll",
              {},
              "Todos os alertas foram marcados como lidos.",
            )
          }
        >
          <CheckCheck size={17} />
          Marcar todas como lidas
        </button>
      </header>
      <section className="card alerts-intro">
        <span className="icon-tile large orange">
          <BellRing size={25} />
        </span>
        <div>
          <h2>Seu orçamento, acompanhado de perto.</h2>
          <p>
            Avisamos ao atingir <b>80%</b> e <b>100%</b> do limite mensal de uma
            categoria. O alerta é enviado uma vez por nível, categoria e mês —
            sem repetições a cada acesso.
          </p>
        </div>
        <div className="alerts-unread">
          <strong>{unread.length}</strong>
          <small>não lido(s)</small>
        </div>
      </section>
      <div className="finance-list-toolbar">
        <div className="finance-filter-tabs">
          <button
            className={filter === "unread" ? "active" : ""}
            onClick={() => setFilter("unread")}
          >
            Não lidas<span>{unread.length}</span>
          </button>
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            Todas<span>{notifications.length}</span>
          </button>
        </div>
        <span>Somente dentro do aplicativo</span>
      </div>
      {!list.length ? (
        <div className="card finance-empty">
          <span className="icon-tile large green">
            <CheckCircle2 size={28} />
          </span>
          <h2>
            {filter === "unread"
              ? "Tudo em dia por aqui"
              : "Nenhum alerta por enquanto"}
          </h2>
          <p>
            {filter === "unread"
              ? "Você não tem alertas pendentes. Os limites continuam sendo acompanhados."
              : "Defina os limites das categorias e registre seus gastos. Avisaremos quando você se aproximar do orçamento."}
          </p>
        </div>
      ) : (
        <div className="notification-list">
          {list.map((n) => (
            <article
              className={
                "card notification-card " +
                (n.readAt ? "read" : "unread") +
                " " +
                (n.threshold === 100 ? "critical" : "warning")
              }
              key={n.id}
            >
              <span
                className={
                  "icon-tile " + (n.threshold === 100 ? "red" : "orange")
                }
              >
                {n.threshold === 100 ? (
                  <AlertTriangle size={21} />
                ) : (
                  <Bell size={21} />
                )}
              </span>
              <div className="notification-body">
                <div className="notification-top">
                  <span
                    className={
                      "badge " + (n.threshold === 100 ? "red" : "orange")
                    }
                  >
                    {n.threshold}% do limite
                  </span>
                  <time dateTime={n.createdAt}>
                    {new Date(n.createdAt).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                      timeZone: "America/Sao_Paulo",
                    })}
                  </time>
                  {!n.readAt && (
                    <span className="notification-dot" aria-label="Não lida" />
                  )}
                </div>
                <h2>{n.title}</h2>
                <p>
                  No mês {n.month.slice(5)}/{n.month.slice(0, 4)}, você
                  registrou <b>{money(n.amount)}</b> de um limite de{" "}
                  <b>{money(n.budget)}</b> nesta categoria.
                </p>
                <div className="notification-meter">
                  <div className="track">
                    <i
                      style={{
                        width: Math.min(n.percent, 100) + "%",
                        background:
                          n.threshold === 100 ? "var(--danger)" : "#f4a454",
                      }}
                    />
                  </div>
                  <span>{n.percent}% utilizado no momento do alerta</span>
                </div>
                <div className="notification-actions">
                  <button
                    className="text-btn"
                    onClick={() => onBudget(n.month)}
                  >
                    Ver orçamento
                    <ArrowRight size={14} />
                  </button>
                  {!n.readAt ? (
                    <button
                      className="secondary"
                      disabled={busy}
                      onClick={() =>
                        mutate(
                          "notification.read",
                          { id: n.id },
                          "Alerta marcado como lido.",
                        )
                      }
                    >
                      <Check size={14} />
                      Marcar como lida
                    </button>
                  ) : (
                    <span>
                      <CheckCheck size={14} />
                      Lida
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      <p className="page-footnote">
        <Info size={15} />
        Alertas consideram o mês atual. O histórico mostra os valores no momento
        do aviso; editar despesas ou limites não altera avisos já registrados.
        Quando um gasto salta diretamente para 100%, enviamos apenas o alerta de
        100%.
      </p>
    </div>
  );
}
function periodPreset(name) {
  const now = today(),
    y = Number(now.slice(0, 4)),
    m = Number(now.slice(5, 7)) - 1;
  return name === "last"
    ? {
        start: new Date(Date.UTC(y, m - 1, 1)).toISOString().slice(0, 10),
        end: new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10),
      }
    : name === "year"
      ? { start: `${y}-01-01`, end: now }
      : { start: now.slice(0, 7) + "-01", end: now };
}
export function ReportsPage({
  state,
  preset,
  onDownload,
  downloading,
  money = moneyDefault,
  go,
}) {
  const [kind, setKind] = useState(preset?.kind || "completo"),
    [start, setStart] = useState(preset?.start || periodPreset().start),
    [end, setEnd] = useState(preset?.end || periodPreset().end),
    [categoryId, setCategoryId] = useState(preset?.categoryId || ""),
    [period, setPeriod] = useState(preset ? "custom" : "current");
  const current = reportKinds.find((r) => r[0] === kind) || reportKinds[0],
    snapshot = ["metas", "recorrencias"].includes(kind);
  const selected = state.transactions.filter(
    (t) =>
      t.date >= start &&
      t.date <= end &&
      (!categoryId || t.categoryId === categoryId) &&
      (kind === "receitas"
        ? t.type === "income"
        : ["despesas", "orcamentos"].includes(kind)
          ? t.type === "expense"
          : true),
  );
  const income = selected
      .filter((t) => t.type === "income")
      .reduce((n, t) => n + t.amount, 0),
    expense = selected
      .filter((t) => t.type === "expense")
      .reduce((n, t) => n + t.amount, 0);
  const invalid = !start || !end || start > end;
  function chooseKind(key) {
    setKind(key);
    setCategoryId("");
  }
  return (
    <div className="finance-tools">
      <header className="page-header">
        <div>
          <h1>Seu dinheiro em planilhas</h1>
          <p>
            Transforme seus registros em uma visão que você pode levar com você.
          </p>
        </div>
        <button className="secondary" onClick={() => go("ia")}>
          <SparkleIcon />
          Pedir ao assistente
        </button>
      </header>
      <section className="report-hero">
        <div>
          <span className="finance-eyebrow">
            <FileSpreadsheet size={15} />
            EXCEL FEITO COM OS SEUS DADOS
          </span>
          <h2>
            Mais clareza.
            <br />
            <span>Dentro e fora do aplicativo.</span>
          </h2>
          <p>
            Planilhas organizadas, com fórmulas, gráficos editáveis e filtros.
            Escolha o que precisa acompanhar e baixe em .xlsx.
          </p>
          <div className="report-benefits">
            <span>
              <CheckCircle2 size={14} />
              Dados reais da conta
            </span>
            <span>
              <CheckCircle2 size={14} />
              Sem chave de IA
            </span>
            <span>
              <CheckCircle2 size={14} />
              Compatível com Excel
            </span>
          </div>
        </div>
        <div className="spreadsheet-art" aria-hidden="true">
          <div className="sheet-art-back" />
          <div className="sheet-art-front">
            <div className="sheet-art-top">
              <FileSpreadsheet size={20} />
              <span>Y FINANCE</span>
              <i />
            </div>
            <div className="sheet-art-grid">
              {Array.from({ length: 15 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
            <div className="sheet-art-bars">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <span className="sheet-art-chip">.xlsx</span>
          </div>
        </div>
      </section>
      <div className="report-workspace">
        <div>
          <section className="card report-config">
            <div className="section-heading">
              <div>
                <span className="finance-step">01 / ESCOLHA SEU RELATÓRIO</span>
                <h2>O que você quer acompanhar?</h2>
              </div>
            </div>
            <div className="report-type-grid">
              {reportKinds.map(([key, title, description, Icon]) => (
                <button
                  key={key}
                  className={"report-type " + (kind === key ? "selected" : "")}
                  aria-pressed={kind === key}
                  onClick={() => chooseKind(key)}
                >
                  <span className="report-type-icon">
                    <Icon size={20} />
                  </span>
                  <div>
                    <strong>{title}</strong>
                    <p>{description}</p>
                  </div>
                  {kind === key ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <span className="report-radio" />
                  )}
                </button>
              ))}
            </div>
          </section>
          <section className="card report-config">
            <span className="finance-step">02 / DEFINA OS FILTROS</span>
            <h2>Seu período, seu recorte.</h2>
            {snapshot ? (
              <div className="report-snapshot-note">
                <Info size={18} />
                <p>
                  Esta planilha mostra a <b>posição atual</b> das{" "}
                  {kind === "metas" ? "metas" : "regras de recorrência"}. O
                  período não filtra esses registros.
                </p>
              </div>
            ) : (
              <>
                <div className="period-presets">
                  {[
                    ["current", "Este mês"],
                    ["last", "Mês passado"],
                    ["year", "Este ano"],
                    ["custom", "Personalizado"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      className={period === key ? "selected" : ""}
                      onClick={() => {
                        setPeriod(key);
                        if (key !== "custom") {
                          const p = periodPreset(key);
                          setStart(p.start);
                          setEnd(p.end);
                        }
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="two-grid">
                  <Field label="Data inicial">
                    <input
                      type="date"
                      value={start}
                      onChange={(e) => {
                        setStart(e.target.value);
                        setPeriod("custom");
                      }}
                    />
                  </Field>
                  <Field label="Data final">
                    <input
                      type="date"
                      value={end}
                      min={start}
                      onChange={(e) => {
                        setEnd(e.target.value);
                        setPeriod("custom");
                      }}
                    />
                  </Field>
                </div>
                <Field label="Filtrar categoria">
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">Todas as categorias</option>
                    {state.categories
                      .filter((c) =>
                        kind === "receitas"
                          ? c.type === "income"
                          : ["despesas", "orcamentos"].includes(kind)
                            ? c.type === "expense"
                            : true,
                      )
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </Field>
                {invalid && (
                  <p className="form-error" role="alert">
                    Escolha uma data inicial anterior ou igual à data final.
                  </p>
                )}
              </>
            )}
            <p className="report-filter-note">
              <Info size={14} />
              {kind === "completo"
                ? "Datas e categoria filtram os lançamentos. Metas e recorrências mostram a posição atual."
                : kind === "orcamentos"
                  ? "Os gastos usam o período selecionado; os limites são os valores atuais, sem rateio em meses parciais."
                  : "Os dados são uma fotografia no momento do download. A planilha não altera os registros no aplicativo."}
            </p>
          </section>
        </div>
        <aside className="card report-preview">
          <div className="report-file-icon">
            <FileSpreadsheet size={29} />
            <span>XLSX</span>
          </div>
          <span className="finance-step">PRONTO PARA LEVAR</span>
          <h2>{current[1]}</h2>
          <p>
            {snapshot
              ? "Posição atual da sua conta"
              : `${dayLabel(start)} a ${dayLabel(end)}`}
          </p>
          {categoryId && (
            <span className="badge green">
              {state.categories.find((c) => c.id === categoryId)?.name}
            </span>
          )}
          <div className="report-counts">
            <div>
              <span>
                {snapshot ? "Registros atuais" : "Lançamentos no período"}
              </span>
              <strong>
                {kind === "metas"
                  ? state.goals.length
                  : kind === "recorrencias"
                    ? (state.recurring || []).length
                    : selected.length}
              </strong>
            </div>
            {!snapshot && (
              <div>
                <span>
                  {kind === "receitas"
                    ? "Total de receitas"
                    : kind === "despesas" || kind === "orcamentos"
                      ? "Total de despesas"
                      : "Saldo do período"}
                </span>
                <strong>
                  {money(
                    kind === "receitas"
                      ? income
                      : kind === "despesas" || kind === "orcamentos"
                        ? expense
                        : income - expense,
                  )}
                </strong>
              </div>
            )}
          </div>
          <h3>Abas incluídas</h3>
          <div className="report-sheet-list">
            {current[4].map((tab) => (
              <span key={tab}>
                <Check size={13} />
                {tab}
              </span>
            ))}
          </div>
          <div className="report-extras">
            <span>
              <CheckCircle2 size={14} />
              Valores numéricos e fórmulas de totais
            </span>
            <span>
              <CheckCircle2 size={14} />
              Gráficos quando houver dados
            </span>
            <span>
              <CheckCircle2 size={14} />
              Cabeçalhos fixos e filtros
            </span>
          </div>
          <button
            className="primary report-download full"
            disabled={downloading || invalid}
            onClick={() =>
              onDownload({
                kind,
                start,
                end,
                categoryId: snapshot ? "" : categoryId,
              })
            }
          >
            {downloading ? (
              <LoaderCircle className="spin" size={18} />
            ) : (
              <Download size={18} />
            )}{" "}
            {downloading ? "Gerando planilha..." : "Baixar Excel"}
          </button>
          <p className="report-privacy">
            <ShieldCheck size={14} />O arquivo contém valores completos, mesmo
            se estiverem ocultos na tela. Guarde-o em local seguro.
          </p>
        </aside>
      </div>
      <div className="finance-help">
        <Info size={19} />
        <div>
          <h3>Use para acompanhar, comparar e planejar.</h3>
          <p>
            Você pode editar valores em linhas existentes para simular cenários.
            Para incluir novos lançamentos e atualizar o histórico, gere outra
            planilha. Fórmulas e gráficos recalculam no Excel ou LibreOffice; as
            alterações no arquivo não são enviadas ao aplicativo.
          </p>
        </div>
      </div>
    </div>
  );
}
function SparkleIcon() {
  return <FileSpreadsheet size={16} />;
}
export function ReportAttachment({
  report,
  onDownload,
  downloading,
  onAdjust,
}) {
  const kind = reportKinds.find((r) => r[0] === report.kind) || reportKinds[0];
  return (
    <div className="chat-report-attachment">
      <div>
        <span className="icon-tile green">
          <FileSpreadsheet size={22} />
        </span>
        <div>
          <strong>{kind[1]}</strong>
          <small>
            {["metas", "recorrencias"].includes(report.kind)
              ? "Posição atual"
              : `${dayLabel(report.start)} a ${dayLabel(report.end)}`}{" "}
            · .xlsx
          </small>
        </div>
      </div>
      <p>
        {kind[4].length} abas · dados atuais no momento do download · sem
        valores inventados.
      </p>
      <div className="chat-report-actions">
        <button
          className="primary"
          disabled={downloading}
          onClick={() => onDownload(report)}
        >
          {downloading ? (
            <LoaderCircle className="spin" size={15} />
          ) : (
            <Download size={15} />
          )}
          Baixar Excel
        </button>
        <button className="text-btn" onClick={() => onAdjust(report)}>
          Ajustar filtros
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
