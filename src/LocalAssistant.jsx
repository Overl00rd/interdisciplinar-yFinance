import React, { useRef, useEffect } from "react";
import {
  Bot,
  User,
  ArrowRight,
  ArrowUpRight,
  Send,
  Trash2,
  Sparkles,
  ShieldCheck,
  CircleHelp,
  Copy,
  CheckCircle2,
  LoaderCircle,
  FileSpreadsheet,
  CalendarDays,
  TrendingDown,
  Repeat,
  Target,
  Heart,
  Eye,
  Info,
} from "lucide-react";
import { ReportAttachment } from "./FinanceTools.jsx";
import "./local-assistant.css";
const currency = (n) =>
  Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const labelDate = (d) => d?.split("-").reverse().join("/");
const allowedPages = new Set([
  "receitas",
  "despesas",
  "categorias",
  "metas",
  "recorrencias",
  "relatorios",
  "configuracoes",
  "educacao",
  "notificacoes",
]);
const starters = [
  [TrendingDown, "Entender meus gastos", "Analise meus gastos"],
  [CalendarDays, "Comparar períodos", "Compare meus gastos com o mês passado"],
  [ShieldCheck, "Revisar os limites", "Como estão meus orçamentos?"],
  [Target, "Planejar uma meta", "Como estão minhas metas?"],
  [
    Repeat,
    "Olhar os próximos dias",
    "Veja minhas recorrências nos próximos 30 dias",
  ],
  [
    FileSpreadsheet,
    "Levar para o Excel",
    "Gere uma planilha completa deste mês",
  ],
];
function InsightBody({ insight, go }) {
  if (!insight) return null;
  return (
    <>
      {insight.metrics?.length > 0 && (
        <div className="assistant-metrics">
          {insight.metrics.map((m, i) => (
            <div key={i}>
              <span>{m.label}</span>
              <strong className={m.value < 0 ? "is-negative" : ""}>
                {m.format === "currency"
                  ? currency(m.value)
                  : m.format === "percent"
                    ? Number(m.value).toLocaleString("pt-BR", {
                        maximumFractionDigits: 1,
                      }) + "%"
                    : Number(m.value).toLocaleString("pt-BR")}
              </strong>
            </div>
          ))}
        </div>
      )}
      {insight.table?.rows?.length > 0 && (
        <div
          className="assistant-table-wrap"
          tabIndex={0}
          role="region"
          aria-label="Detalhes da análise"
        >
          <table>
            <thead>
              <tr>
                {insight.table.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {insight.table.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((v, j) => (
                    <td key={j}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {insight.note && (
        <div className="assistant-method">
          <Info size={13} />
          <p>{insight.note}</p>
        </div>
      )}
      {insight.actions?.some((a) => allowedPages.has(a.page)) && (
        <div className="assistant-actions">
          {insight.actions
            .filter((a) => allowedPages.has(a.page))
            .map((a, i) => (
              <button key={i} className="text-btn" onClick={() => go(a.page)}>
                {a.label}
                <ArrowUpRight size={13} />
              </button>
            ))}
        </div>
      )}
    </>
  );
}
export default function LocalAssistant({
  state,
  aiMode,
  busy,
  pending,
  chatInput,
  setChatInput,
  onSend,
  onClear,
  onDownload,
  downloading,
  onAdjustReport,
  go,
  hidden,
  onReveal,
  notify,
}) {
  const history = useRef(),
    input = useRef(),
    wasSending = useRef(false);
  useEffect(() => {
    const container = history.current;
    if (!container || hidden) return;
    if (pending) container.scrollTop = container.scrollHeight;
    else {
      const latest = [
        ...container.querySelectorAll(".chat-message.assistant"),
      ].at(-1);
      if (latest)
        container.scrollTop +=
          latest.getBoundingClientRect().top -
          container.getBoundingClientRect().top -
          12;
    }
  }, [state.chat?.length, pending, hidden]);
  useEffect(() => {
    if (wasSending.current && !pending && !hidden)
      input.current?.focus({ preventScroll: true });
    wasSending.current = !!pending;
  }, [pending, hidden]);
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
  const current = state.transactions.filter(
    (t) => t.date >= today.slice(0, 7) + "-01" && t.date <= today,
  );
  const total = (type) =>
    current
      .filter((t) => t.type === type)
      .reduce((n, t) => n + Math.round(t.amount * 100), 0) / 100;
  const income = total("income"),
    expense = total("expense"),
    balance = Math.round((income - expense) * 100) / 100;
  const chat = state.chat || [],
    last = chat.filter((c) => c.role === "assistant").at(-1),
    suggestions = last?.insight?.suggestions || [];
  const money = (n) => (hidden ? "R$ •••••" : currency(n));
  async function copyAnswer(message) {
    const table = message.insight?.table;
    const text = [
      message.insight?.title,
      message.content,
      table
        ? [
            table.headers.join(" | "),
            ...table.rows.map((r) => r.join(" | ")),
          ].join("\n")
        : "",
      message.insight?.note,
    ]
      .filter(Boolean)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      notify("Resposta copiada.");
    } catch {
      notify(
        "Não foi possível copiar automaticamente. Selecione o texto da resposta para copiar.",
      );
    }
  }
  return (
    <div className="local-assistant">
      <header className="page-header">
        <div>
          <h1>YFinance IA</h1>
          <p>Seu dinheiro explicado, com dados e próximos passos.</p>
        </div>
        <div className="assistant-status">
          <i />
          {aiMode ? "Local + IA opcional" : "Local · sem chave de IA"}
        </div>
      </header>
      <div className="ai-grid">
        <section className="card chat-card">
          <div className="chat-heading">
            <span className="assistant-bot-mark">
              <Bot size={23} />
            </span>
            <div>
              <h2>Seu assistente financeiro</h2>
              <small>Analisa, compara e ajuda você a planejar.</small>
            </div>
            <button
              className="icon-btn"
              aria-label="Como funciona o assistente"
              disabled={busy || hidden}
              onClick={() => onSend("Como funciona?")}
            >
              <CircleHelp size={18} />
            </button>
            <button
              className="icon-btn"
              aria-label="Limpar conversa"
              disabled={busy || !chat.length}
              onClick={onClear}
            >
              <Trash2 size={17} />
            </button>
          </div>
          <div className="assistant-context-bar">
            <ShieldCheck size={14} />
            <span>
              Seus registros. Cálculos locais. Nenhuma alteração pelo chat.
            </span>
          </div>
          {hidden ? (
            <div className="assistant-private">
              <span className="icon-tile red">
                <Eye size={24} />
              </span>
              <h2>Suas mensagens podem conter valores.</h2>
              <p>
                A conversa está oculta junto com os valores financeiros da tela.
                Isso não apaga o histórico.
              </p>
              <button className="primary" onClick={onReveal}>
                <Eye size={16} />
                Mostrar conversa
              </button>
            </div>
          ) : (
            <>
              <div
                className="chat-messages"
                ref={history}
                role="log"
                aria-label="Histórico da conversa"
                aria-live="polite"
                aria-relevant="additions text"
              >
                {!chat.length ? (
                  <div className="assistant-welcome">
                    <span className="assistant-welcome-kicker">
                      <Sparkles size={14} />
                      MAIS CLAREZA, UMA PERGUNTA POR VEZ
                    </span>
                    <h2>Por onde vamos começar?</h2>
                    <p>
                      Olá, {state.profile.name.split(" ")[0] || "você"}. Escolha
                      uma análise ou escreva sua pergunta. Você pode continuar
                      com “e no mês passado?” ou pedir uma planilha do mesmo
                      período.
                    </p>
                    <div className="assistant-starters">
                      {starters.map(([Icon, title, prompt]) => (
                        <button
                          key={title}
                          disabled={busy}
                          onClick={() => onSend(prompt)}
                        >
                          <Icon size={18} />
                          <span>{title}</span>
                          <ArrowUpRight size={13} />
                        </button>
                      ))}
                    </div>
                    <p className="assistant-welcome-note">
                      Sou um assistente local por regras, não uma IA generativa.
                      Se eu não entender um pedido, peço detalhes em vez de
                      inventar informações.
                    </p>
                  </div>
                ) : (
                  <div className="assistant-history-note">
                    <Bot size={13} />
                    Histórico desta conta · análises usam os dados disponíveis
                    no momento da resposta.
                  </div>
                )}
                {chat.map((c, i) => (
                  <article className={"chat-message " + c.role} key={c.id || i}>
                    <span className="chat-avatar">
                      {c.role === "user" ? (
                        <User size={17} />
                      ) : (
                        <Bot size={18} />
                      )}
                    </span>
                    <div>
                      {c.role === "assistant" && c.insight && (
                        <div className="assistant-response-header">
                          <span>
                            {c.mode === "ai"
                              ? "IA CONECTADA"
                              : c.report
                                ? "EXCEL DA SUA CONTA"
                                : "ANÁLISE LOCAL"}
                          </span>
                          {c.insight.count !== undefined && (
                            <span>{c.insight.count} registro(s)</span>
                          )}
                        </div>
                      )}
                      {c.insight?.title && <h3>{c.insight.title}</h3>}
                      {c.insight?.context?.period &&
                        !["goal", "reserve"].includes(
                          c.insight.context.intent,
                        ) && (
                          <div className="assistant-period">
                            <CalendarDays size={12} />
                            {labelDate(c.insight.context.period.start)} a{" "}
                            {labelDate(c.insight.context.period.end)}
                          </div>
                        )}
                      <p>{c.content}</p>
                      {c.role === "assistant" && (
                        <>
                          <InsightBody insight={c.insight} go={go} />
                          {c.report && (
                            <ReportAttachment
                              report={c.report}
                              onDownload={onDownload}
                              downloading={downloading}
                              onAdjust={onAdjustReport}
                            />
                          )}
                          <div className="assistant-message-footer">
                            <small>
                              {c.createdAt
                                ? new Date(c.createdAt).toLocaleTimeString(
                                    "pt-BR",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      timeZone: "America/Sao_Paulo",
                                    },
                                  )
                                : "Resposta salva"}
                            </small>
                            {c === last && c.insight?.context && !c.report && (
                              <button
                                className="assistant-explain"
                                disabled={busy}
                                onClick={() => onSend("Como você calculou?")}
                              >
                                <CircleHelp size={13} /> Entender cálculo
                              </button>
                            )}
                            <button
                              className="icon-btn"
                              aria-label="Copiar resposta"
                              title="Copiar resposta"
                              onClick={() => copyAnswer(c)}
                            >
                              <Copy size={13} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </article>
                ))}
                {pending && (
                  <>
                    <article className="chat-message user assistant-pending">
                      <span className="chat-avatar">
                        <User size={17} />
                      </span>
                      <div>
                        <p>{pending}</p>
                      </div>
                    </article>
                    <div className="chat-typing" role="status">
                      <LoaderCircle className="spin" size={15} />
                      Consultando seus registros...
                    </div>
                  </>
                )}
                {!busy && suggestions.length > 0 && (
                  <div className="assistant-followups">
                    <span>CONTINUE A CONVERSA</span>
                    <div>
                      {suggestions.slice(0, 4).map((text) => (
                        <button key={text} onClick={() => onSend(text)}>
                          {text}
                          <ArrowRight size={12} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <form
                className="chat-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSend(chatInput);
                }}
              >
                <textarea
                  ref={input}
                  rows={2}
                  aria-label="Mensagem para o assistente"
                  placeholder="Ex.: quanto gastei em Alimentação no mês passado?"
                  value={chatInput}
                  maxLength={2000}
                  disabled={busy}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      !e.nativeEvent.isComposing
                    ) {
                      e.preventDefault();
                      if (chatInput.trim() && !busy) onSend(chatInput);
                    }
                  }}
                />
                <button
                  className="primary icon-btn"
                  aria-label="Enviar mensagem"
                  disabled={!chatInput.trim() || busy}
                >
                  {pending ? (
                    <LoaderCircle className="spin" size={17} />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </form>
              <div className="assistant-composer-hint">
                <span>Enter envia · Shift + Enter quebra linha</span>
                <span>{chatInput.length}/2000</span>
              </div>
            </>
          )}
          <p className="chat-disclaimer">
            Orientações educativas. Sem acesso ao banco, pagamentos ou cotações
            em tempo real.
          </p>
        </section>
        <aside className="assistant-sidebar">
          <section className="card financial-health">
            <h2>
              <Heart size={18} />
              Seu momento financeiro
            </h2>
            <p className="assistant-health-period">
              Este mês, até {labelDate(today)} · somente registros
            </p>
            {[
              [
                "Base de análise",
                `${current.length} lançamento(s) no período`,
                current.length ? "Registrado" : "Sem base",
                current.length ? "neutral" : "orange",
              ],
              [
                "Entradas e saídas",
                !current.length
                  ? "Cadastre movimentações para começar"
                  : !income
                    ? "Confira se faltam receitas"
                    : expense > income
                      ? "Despesas acima das receitas"
                      : "Despesas não superam as receitas",
                !income
                  ? "Sem base"
                  : expense > income
                    ? "Atenção"
                    : "No registro",
                !income ? "neutral" : expense > income ? "orange" : "green",
              ],
              [
                "Saldo registrado",
                money(balance),
                !current.length
                  ? "Sem base"
                  : balance < 0
                    ? "Negativo"
                    : "Do período",
                !current.length ? "neutral" : balance < 0 ? "orange" : "green",
              ],
              [
                "Metas financeiras",
                `${state.goals.length} objetivo(s) cadastrado(s)`,
                state.goals.length ? "Consultar" : "Comece aqui",
                "neutral",
              ],
              [
                "Recorrências",
                `${(state.recurring || []).filter((r) => r.status === "active").length} regra(s) ativa(s)`,
                "Planejamento",
                "neutral",
              ],
            ].map(([title, note, status, color]) => (
              <div className="health-item" key={title}>
                <div>
                  <h3>{title}</h3>
                  <p>{note}</p>
                </div>
                <span className={"badge " + color}>{status}</span>
              </div>
            ))}
            <div className="assistant-next-step">
              <Sparkles size={18} />
              <h3>
                {current.length
                  ? "Confira o que vem pela frente"
                  : "Comece por uma base confiável"}
              </h3>
              <p>
                {current.length
                  ? "Saldo positivo não garante dinheiro livre: veja os próximos vencimentos e os registros que ainda faltam."
                  : "Registre receitas e despesas antes de transformar uma análise em decisão. Dados incompletos mudam as conclusões."}
              </p>
              <button
                className="text-btn"
                disabled={busy || hidden}
                onClick={() =>
                  current.length
                    ? onSend("Veja minhas próximas recorrências")
                    : go("despesas")
                }
              >
                {current.length
                  ? "Ver próximas recorrências"
                  : "Registrar despesas"}
                <ArrowRight size={13} />
              </button>
            </div>
          </section>
          <section className="card assistant-side-help">
            <span className="icon-tile green">
              <FileSpreadsheet size={21} />
            </span>
            <h3>Da conversa para a planilha.</h3>
            <p>
              Depois de uma análise, peça “gere Excel desse período” para levar
              o recorte com você.
            </p>
            <button className="text-btn" onClick={() => go("relatorios")}>
              Abrir Relatórios Excel
              <ArrowUpRight size={13} />
            </button>
          </section>
          <div className="assistant-trust">
            <CheckCircle2 size={15} />
            <p>
              Você pode limpar o histórico sem apagar receitas, despesas ou
              metas. Nenhum comando financeiro é executado pela conversa.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
