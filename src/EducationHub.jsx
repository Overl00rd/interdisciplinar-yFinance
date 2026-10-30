import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flag,
  GraduationCap,
  Lightbulb,
  ListChecks,
  LockKeyhole,
  Medal,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  TrendingUp,
  Wallet,
  XCircle,
  ExternalLink,
  CircleHelp,
  Save,
} from "lucide-react";
import { tracks, lessons, challenges } from "./lessons.js";
import { curriculum, quizPassScore } from "./curriculum.js";
import "./education.css";
const trackIcons = [Sprout, Wallet, TrendingUp];
const letter = (i) => String.fromCharCode(65 + i);
const progressFor = (state, id) => state.learning?.[id] || {};
const quizPassed = (p) => (p.quiz?.bestScore || 0) >= quizPassScore;
const number = (n) => String(n).padStart(2, "0");
function jump(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "start",
  });
}
function Milestones({ state, id }) {
  const p = progressFor(state, id);
  return (
    <div className="edu-milestones">
      <span className={state.completed.includes(id) ? "done" : ""}>
        <BookOpen size={13} />
        {state.completed.includes(id) ? "Leitura concluída" : "Leitura"}
      </span>
      <span className={p.challenge?.completedAt ? "done" : ""}>
        <Flag size={13} />
        {p.challenge?.completedAt
          ? "Desafio concluído"
          : p.challenge
            ? "Desafio em andamento"
            : "Desafio opcional"}
      </span>
      <span className={quizPassed(p) ? "done" : ""}>
        <ListChecks size={13} />
        {p.quiz?.attempts
          ? `Melhor quiz: ${p.quiz.bestScore}/3`
          : "Quiz: 3 perguntas"}
      </span>
    </div>
  );
}
function EducationStats({ state }) {
  const practiceDone = curriculum.filter(
      (_, id) => progressFor(state, id).challenge?.completedAt,
    ).length,
    passed = curriculum.filter((_, id) =>
      quizPassed(progressFor(state, id)),
    ).length;
  return (
    <div className="edu-stats">
      {[
        [
          BookOpen,
          state.completed.length,
          "Aulas concluídas",
          "de 17 leituras",
          "red",
        ],
        [
          Flag,
          practiceDone,
          "Desafios realizados",
          "de 17 práticas opcionais",
          "purple",
        ],
        [
          Medal,
          passed,
          "Quizzes aprovados",
          "2 ou 3 acertos por quiz",
          "green",
        ],
      ].map(([Icon, value, title, sub, color]) => (
        <div className="card edu-stat" key={title}>
          <span className={"icon-tile " + color}>
            <Icon size={21} />
          </span>
          <div>
            <span>{title}</span>
            <strong>
              {value}
              <small>/17</small>
            </strong>
            <p>{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
export default function EducationHub({ page, state, go, mutate, busy }) {
  const [tab, setTab] = useState("Trilhas"),
    [filter, setFilter] = useState("Todos");
  const parts = page.split("/");
  const id = parts[1] === "aula" ? Number(parts[2]) : null,
    tid = parts[1] === "trilha" ? Number(parts[2]) : null;
  const open = (id, section) =>
    go(`educacao/aula/${id}${section ? "/" + section : ""}`);
  const visited = Object.entries(state.learning || {})
    .filter(([id, p]) => curriculum[Number(id)] && p.visitedAt)
    .sort((a, b) => b[1].visitedAt.localeCompare(a[1].visitedAt));
  const next = visited.length
    ? Number(visited[0][0])
    : Math.max(
        0,
        lessons.findIndex((_, id) => !state.completed.includes(id)),
      );
  if (id !== null) {
    if (!Number.isInteger(id) || !curriculum[id])
      return (
        <div className="card empty">
          <h1>Aula não encontrada</h1>
          <button className="primary" onClick={() => go("educacao")}>
            Voltar às trilhas
          </button>
        </div>
      );
    return (
      <LessonReader
        key={id}
        id={id}
        section={parts[3]}
        state={state}
        go={go}
        mutate={mutate}
        busy={busy}
      />
    );
  }
  if (tid !== null) {
    const t = tracks[tid];
    if (!Number.isInteger(tid) || !t)
      return (
        <div className="card empty">
          <h1>Trilha não encontrada</h1>
          <button className="primary" onClick={() => go("educacao")}>
            Voltar às trilhas
          </button>
        </div>
      );
    const TrackIcon = trackIcons[tid];
    return (
      <div className="edu-page">
        <button className="back-btn" onClick={() => go("educacao")}>
          <ArrowLeft size={16} />
          Todas as trilhas
        </button>
        <section
          className="card edu-track-intro"
          style={{ "--track-accent": t.color }}
        >
          <span className="edu-eyebrow">
            TRILHA {number(tid + 1)} ·{" "}
            {["FUNDAMENTOS", "ORGANIZAÇÃO", "INVESTIMENTOS"][tid]}
          </span>
          <div>
            <h1>{t.title}</h1>
            <TrackIcon size={42} />
          </div>
          <p>{t.description}</p>
          <div className="edu-track-meta">
            <span>
              <BookOpen size={15} />
              {t.ids.length} aulas aprofundadas
            </span>
            <span>
              <Flag size={15} />
              {t.ids.length} desafios
            </span>
            <span>
              <ListChecks size={15} />
              {t.ids.length * 3} perguntas
            </span>
          </div>
        </section>
        <div className="edu-section-intro">
          <h2>Seu caminho de aprendizado</h2>
          <p>
            Leia, experimente e confira o que aprendeu. Você escolhe o ritmo.
          </p>
        </div>
        <div className="edu-lesson-list">
          {t.ids.map((id, i) => (
            <button
              className="card edu-lesson-row"
              key={id}
              onClick={() => open(id)}
            >
              <span
                className={
                  "lesson-number " +
                  (state.completed.includes(id) ? "done" : "")
                }
              >
                {state.completed.includes(id) ? (
                  <Check size={20} />
                ) : (
                  number(i + 1)
                )}
              </span>
              <div>
                <h3>{lessons[id][0]}</h3>
                <p>{curriculum[id].objectives[0]}</p>
                <Milestones state={state} id={id} />
              </div>
              <ChevronRight size={19} />
            </button>
          ))}
        </div>
      </div>
    );
  }
  const selectTab = (t) => {
    setTab(t);
    setFilter("Todos");
  };
  return (
    <div className="edu-page">
      <section className="education-hero edu-hero">
        <div>
          <span className="eyebrow">
            <GraduationCap size={16} />
            APRENDER. PRATICAR. EVOLUIR.
          </span>
          <h1>
            Mais conhecimento.
            <br />
            <span>Melhores escolhas.</span>
          </h1>
          <p>
            Entenda o seu dinheiro de verdade. Aulas aprofundadas,
            <br className="edu-desktop-break" /> desafios para a vida real e
            quizzes para fixar o aprendizado.
          </p>
          <div className="edu-hero-buttons">
            <button className="primary" onClick={() => open(next)}>
              {visited.length ? "Continuar aprendizado" : "Começar aprendizado"}
              <ArrowRight size={17} />
            </button>
            <span>17 aulas · no seu ritmo</span>
          </div>
        </div>
        <div className="education-art" aria-hidden="true">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="book-illustration">
            <BookOpen size={96} strokeWidth={1.15} />
            <div className="art-star">✦</div>
          </div>
          <span className="art-badge">
            <Sparkles size={17} />
            Conhecimento vira atitude
          </span>
        </div>
      </section>
      <EducationStats state={state} />
      <section className="card edu-resume">
        <div className="edu-resume-icon">
          <GraduationCap size={25} />
        </div>
        <div>
          <span>SEU PRÓXIMO PASSO</span>
          <h2>{lessons[next][0]}</h2>
          <div className="track">
            <i
              style={{
                width: (state.completed.length / 17) * 100 + "%",
                background: "var(--accent)",
              }}
            />
          </div>
          <p>
            {state.completed.length} de 17 aulas concluídas · desafios e quizzes
            têm progresso próprio
          </p>
        </div>
        <button className="secondary" onClick={() => open(next)}>
          Continuar
          <ArrowRight size={15} />
        </button>
      </section>
      <div
        className="tabs edu-tabs"
        role="tablist"
        aria-label="Seções de educação"
      >
        {["Trilhas", "Desafios", "Quizzes", "Dicas", "Meu progresso"].map(
          (t) => (
            <button
              key={t}
              role="tab"
              aria-label={t}
              id={"tab-" + t}
              aria-controls="edu-panel"
              aria-selected={tab === t}
              className={tab === t ? "active" : ""}
              onClick={() => selectTab(t)}
            >
              {t}
              {t === "Desafios" && <span>17</span>}
            </button>
          ),
        )}
      </div>
      <div id="edu-panel" role="tabpanel" aria-labelledby={"tab-" + tab}>
        {tab === "Trilhas" && (
          <>
            <div className="edu-section-intro">
              <h2>Um caminho para cada fase</h2>
              <p>
                Do primeiro orçamento a decisões mais conscientes sobre
                investimentos.
              </p>
            </div>
            <div className="three-grid tracks edu-tracks">
              {tracks.map((t, i) => {
                const done = t.ids.filter((id) =>
                    state.completed.includes(id),
                  ).length,
                  Icon = trackIcons[i];
                return (
                  <article className="card track-card" key={i}>
                    <div
                      className="track-art"
                      style={{
                        background: `linear-gradient(135deg,${t.color}22,${t.color}04)`,
                      }}
                    >
                      <Icon
                        size={48}
                        strokeWidth={1.4}
                        style={{ color: t.color }}
                      />
                      <b className="edu-track-num">0{i + 1}</b>
                      <span>
                        {["Fundamentos", "Organização", "Investimentos"][i]}
                      </span>
                    </div>
                    <div className="track-body">
                      <h2>{t.title}</h2>
                      <p>{t.description}</p>
                      <div className="edu-track-facts">
                        <span>
                          <BookOpen size={13} />
                          {t.ids.length} aulas
                        </span>
                        <span>
                          <Flag size={13} />
                          {t.ids.length} desafios
                        </span>
                        <span>
                          <ListChecks size={13} />
                          {t.ids.length * 3} questões
                        </span>
                      </div>
                      <div className="progress-label">
                        <small>
                          {done
                            ? `${done} de ${t.ids.length} leituras concluídas`
                            : "Seu primeiro passo começa aqui"}
                        </small>
                        <b>{Math.round((done / t.ids.length) * 100)}%</b>
                      </div>
                      <div className="track">
                        <i
                          style={{
                            width: (done / t.ids.length) * 100 + "%",
                            background: t.color,
                          }}
                        />
                      </div>
                      <button
                        className="secondary full"
                        onClick={() => go("educacao/trilha/" + i)}
                      >
                        {done ? "Continuar trilha" : "Explorar trilha"}
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="edu-how">
              <span className="icon-tile red">
                <Lightbulb size={21} />
              </span>
              <div>
                <h3>Não é só ler. É aprender a decidir.</h3>
                <p>
                  Cada aula conecta conceitos, um caso resolvido, um desafio
                  opcional e três perguntas com explicações. Você pode refazer
                  os quizzes quantas vezes quiser.
                </p>
              </div>
            </div>
          </>
        )}
        {tab === "Desafios" && (
          <>
            <div className="edu-list-heading">
              <div className="edu-section-intro">
                <h2>Leve o aprendizado para a vida</h2>
                <p>
                  Um desafio por aula. Use exemplos fictícios se preferir:
                  nenhuma atividade exige gastar ou investir.
                </p>
              </div>
              <select
                aria-label="Filtrar desafios"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {["Todos", "Não iniciados", "Em andamento", "Concluídos"].map(
                  (f) => (
                    <option key={f}>{f}</option>
                  ),
                )}
              </select>
            </div>
            <div className="edu-challenge-grid">
              {curriculum
                .map((c, id) => ({ c, id, p: progressFor(state, id) }))
                .filter(
                  ({ p }) =>
                    filter === "Todos" ||
                    (filter === "Não iniciados" && !p.challenge) ||
                    (filter === "Em andamento" &&
                      p.challenge &&
                      !p.challenge.completedAt) ||
                    (filter === "Concluídos" && p.challenge?.completedAt),
                )
                .map(({ c, id, p }) => (
                  <article key={id} className="card edu-challenge-tile">
                    <div className="section-heading">
                      <span className="icon-tile purple">
                        <Flag size={20} />
                      </span>
                      <span
                        className={
                          "badge " +
                          (p.challenge?.completedAt
                            ? "green"
                            : p.challenge
                              ? "orange"
                              : "neutral")
                        }
                      >
                        {p.challenge?.completedAt
                          ? "Concluído"
                          : p.challenge
                            ? "Em andamento"
                            : "Opcional"}
                      </span>
                    </div>
                    <span className="edu-kicker">
                      AULA {number(id + 1)} · {c.challenge.duration}
                    </span>
                    <h3>{c.challenge.title}</h3>
                    <p>{lessons[id][0]}</p>
                    <div className="edu-step-preview">
                      {(p.challenge?.steps || []).length}/3 etapas realizadas
                    </div>
                    <button
                      className="secondary full"
                      onClick={() => open(id, "desafio")}
                    >
                      {p.challenge?.completedAt
                        ? "Revisar desafio"
                        : p.challenge
                          ? "Continuar desafio"
                          : "Conhecer desafio"}
                      <ArrowRight size={15} />
                    </button>
                  </article>
                ))}
            </div>
            {!curriculum.some((_, id) => {
              const p = progressFor(state, id);
              return (
                filter === "Todos" ||
                (filter === "Não iniciados" && !p.challenge) ||
                (filter === "Em andamento" &&
                  p.challenge &&
                  !p.challenge.completedAt) ||
                (filter === "Concluídos" && p.challenge?.completedAt)
              );
            }) && (
              <div className="card empty">
                <Flag size={28} />
                <h3>Nenhum desafio nesta etapa</h3>
                <p>
                  Escolha “Todos” para encontrar uma prática que combina com
                  você.
                </p>
              </div>
            )}
            <details className="card edu-legacy">
              <summary>
                Desafios gerais{" "}
                <span>Suas atividades anteriores continuam salvas</span>
              </summary>
              <div className="three-grid">
                {challenges.map((c, i) => (
                  <div className="challenge" key={i}>
                    <h3>{c[0]}</h3>
                    <p>{c[1]}</p>
                    <button
                      className="secondary"
                      disabled={busy}
                      onClick={() =>
                        mutate(
                          "challenge.toggle",
                          { id: i },
                          state.challenges.includes(i)
                            ? "Desafio reaberto."
                            : "Conquista registrada!",
                        )
                      }
                    >
                      {state.challenges.includes(i)
                        ? "Concluído · desfazer"
                        : "Marcar como concluído"}
                    </button>
                  </div>
                ))}
              </div>
            </details>
          </>
        )}
        {tab === "Quizzes" && (
          <>
            <div className="edu-list-heading">
              <div className="edu-section-intro">
                <h2>Confira o que ficou com você</h2>
                <p>
                  Três perguntas por aula, com cenários, cálculos e feedback.
                  Dois acertos são suficientes para aprovação.
                </p>
              </div>
              <select
                aria-label="Filtrar quizzes"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {["Todos", "Não respondidos", "Para revisar", "Aprovados"].map(
                  (f) => (
                    <option key={f}>{f}</option>
                  ),
                )}
              </select>
            </div>
            <div className="edu-quiz-list">
              {curriculum
                .map((c, id) => ({ c, id, p: progressFor(state, id) }))
                .filter(
                  ({ p }) =>
                    filter === "Todos" ||
                    (filter === "Não respondidos" && !p.quiz?.attempts) ||
                    (filter === "Para revisar" &&
                      p.quiz?.attempts &&
                      !quizPassed(p)) ||
                    (filter === "Aprovados" && quizPassed(p)),
                )
                .map(({ id, p }) => (
                  <div className="card edu-quiz-tile" key={id}>
                    <span
                      className={
                        "icon-tile " + (quizPassed(p) ? "green" : "red")
                      }
                    >
                      <ListChecks size={21} />
                    </span>
                    <div>
                      <span className="edu-kicker">AULA {number(id + 1)}</span>
                      <h3>{lessons[id][0]}</h3>
                      <p>
                        {p.quiz?.attempts
                          ? `${p.quiz.attempts} tentativa(s) · melhor resultado: ${p.quiz.bestScore}/3`
                          : "3 perguntas · sem limite de tentativas"}
                        {p.quiz?.draft?.some((a) => a !== null)
                          ? " · respostas em andamento salvas"
                          : ""}
                      </p>
                    </div>
                    <span
                      className={
                        "badge " +
                        (quizPassed(p)
                          ? "green"
                          : p.quiz?.attempts
                            ? "orange"
                            : "neutral")
                      }
                    >
                      {quizPassed(p)
                        ? "Aprovado"
                        : p.quiz?.attempts
                          ? "Para revisar"
                          : "Não respondido"}
                    </span>
                    <button
                      className="secondary"
                      onClick={() => open(id, "quiz")}
                    >
                      {p.quiz?.attempts ? "Ver quiz" : "Responder"}
                      <ArrowRight size={15} />
                    </button>
                  </div>
                ))}
            </div>
            {!curriculum.some((_, id) => {
              const p = progressFor(state, id);
              return (
                filter === "Todos" ||
                (filter === "Não respondidos" && !p.quiz?.attempts) ||
                (filter === "Para revisar" &&
                  p.quiz?.attempts &&
                  !quizPassed(p)) ||
                (filter === "Aprovados" && quizPassed(p))
              );
            }) && (
              <div className="card empty">
                <ListChecks size={28} />
                <h3>Nenhum quiz neste filtro</h3>
                <p>Selecione “Todos” para explorar os quizzes das aulas.</p>
              </div>
            )}
          </>
        )}
        {tab === "Dicas" && (
          <>
            <div className="edu-section-intro">
              <h2>Pequenos lembretes, melhores decisões</h2>
              <p>Conecte uma dica rápida a uma aula completa.</p>
            </div>
            <div className="two-grid edu-tips">
              {[
                [
                  2,
                  "Dê tempo à sua decisão",
                  "Antes de uma compra não urgente, compare alternativas e espere. A pausa ajuda a separar utilidade de impulso.",
                ],
                [
                  3,
                  "Faça as contas anuais aparecerem",
                  "Uma despesa previsível não precisa virar emergência. Divida o valor pelos meses até o vencimento.",
                ],
                [
                  7,
                  "A parcela não conta a história toda",
                  "Compare prazo, soma dos pagamentos e CET antes de aceitar uma proposta de renegociação.",
                ],
                [
                  16,
                  "Confirme por outro caminho",
                  "Se uma mensagem pede dinheiro ou códigos, verifique a identidade por um canal que você encontrou independentemente.",
                ],
              ].map(([id, title, text]) => (
                <article className="card tip" key={id}>
                  <span className="icon-tile red">
                    <Lightbulb size={20} />
                  </span>
                  <h2>{title}</h2>
                  <p>{text}</p>
                  <button className="text-btn" onClick={() => open(id)}>
                    Aprofundar na aula
                    <ArrowRight size={15} />
                  </button>
                </article>
              ))}
            </div>
            <div className="card edu-sources">
              <h2>Continue em fontes confiáveis</h2>
              <p>
                Consulte materiais oficiais e as condições vigentes antes de
                qualquer decisão financeira.
              </p>
              <a
                href="https://www.bcb.gov.br/cidadaniafinanceira"
                target="_blank"
                rel="noreferrer"
              >
                Banco Central · cidadania financeira
                <ExternalLink size={14} />
              </a>
              <a
                href="https://www.gov.br/investidor/pt-br"
                target="_blank"
                rel="noreferrer"
              >
                Portal do Investidor · CVM
                <ExternalLink size={14} />
              </a>
              <a
                href="https://www.fgc.org.br/"
                target="_blank"
                rel="noreferrer"
              >
                FGC · regras e condições de cobertura
                <ExternalLink size={14} />
              </a>
            </div>
          </>
        )}
        {tab === "Meu progresso" && (
          <>
            <div className="edu-section-intro">
              <h2>Cada etapa conta uma conquista</h2>
              <p>
                A leitura, o desafio e o quiz são acompanhados separadamente.
                Seu histórico anterior foi preservado.
              </p>
            </div>
            <div className="card edu-progress-map">
              <div className="edu-progress-head">
                <span>Seu aprendizado</span>
                <span>Leitura</span>
                <span>Desafio</span>
                <span>Melhor quiz</span>
              </div>
              {lessons.map((l, id) => {
                const p = progressFor(state, id);
                return (
                  <div className="edu-progress-row" key={id}>
                    <button onClick={() => open(id)}>
                      <span>{number(id + 1)}</span>
                      {l[0]}
                      <ChevronRight size={14} />
                    </button>
                    <span
                      aria-label={
                        state.completed.includes(id)
                          ? "Leitura concluída"
                          : "Leitura pendente"
                      }
                    >
                      {state.completed.includes(id) ? (
                        <CheckCircle2 className="green-text" size={18} />
                      ) : (
                        <span className="edu-pending">—</span>
                      )}
                    </span>
                    <span>
                      {p.challenge?.completedAt ? (
                        <CheckCircle2 className="green-text" size={18} />
                      ) : p.challenge ? (
                        <span className="badge orange">
                          {p.challenge.steps.length}/3
                        </span>
                      ) : (
                        <span className="edu-pending">—</span>
                      )}
                    </span>
                    <span className={quizPassed(p) ? "green-text" : "muted"}>
                      {p.quiz?.attempts ? p.quiz.bestScore + "/3" : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="edu-how">
              <ShieldCheck size={23} />
              <div>
                <h3>Progresso que acompanha você</h3>
                <p>
                  Respostas do quiz, tentativas, etapas e reflexões salvas ficam
                  vinculadas à sua conta. A melhor nota é mantida mesmo quando
                  você decide tentar novamente.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      <p className="edu-disclaimer">
        <ShieldCheck size={14} />
        Conteúdo educativo, não uma recomendação individual de investimento.
        Atividades podem ser feitas com dados fictícios.
      </p>
    </div>
  );
}
function LessonReader({ id, section, state, go, mutate, busy }) {
  const c = curriculum[id],
    l = lessons[id],
    p = progressFor(state, id),
    tid = tracks.findIndex((t) => t.ids.includes(id)),
    t = tracks[tid];
  const [active, setActive] = useState("conteudo");
  useEffect(() => {
    mutate("learning.visit", { id }, null);
  }, [id]);
  useEffect(() => {
    if (section === "desafio" || section === "quiz") {
      requestAnimationFrame(() => jump("lesson-" + section));
      setActive(section);
    }
  }, [id, section]);
  const to = (target) => {
    setActive(target);
    jump("lesson-" + target);
  };
  return (
    <div className="edu-page edu-reader">
      <div className="edu-breadcrumb">
        <button onClick={() => go("educacao")}>Educação</button>
        <ChevronRight size={13} />
        <button onClick={() => go("educacao/trilha/" + tid)}>{t.title}</button>
        <ChevronRight size={13} />
        <span>Aula {number(id + 1)}</span>
      </div>
      <header className="edu-reader-heading">
        <div className="edu-reader-badges">
          <span className="badge red">AULA {number(id + 1)}</span>
          <span>
            <Clock size={14} />
            6–9 min de estudo
          </span>
          <span>
            <Flag size={14} />
            Prática opcional
          </span>
        </div>
        <h1>{l[0]}</h1>
        <p>{l[2]}</p>
        <Milestones state={state} id={id} />
      </header>
      <div className="edu-reader-grid">
        <div className="edu-reader-main">
          <article className="card edu-content" id="lesson-conteudo">
            <div className="edu-goals">
              <span className="icon-tile red">
                <Target size={23} />
              </span>
              <div>
                <span className="edu-kicker">
                  AO FINAL DESTA AULA, VOCÊ VAI
                </span>
                <ul>
                  {c.objectives.map((g) => (
                    <li key={g}>
                      <Check size={14} />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="edu-body">
              {c.sections.map((s, i) => (
                <section id={"concept-" + i} key={s.title}>
                  <span className="edu-section-number">
                    0{i + 1} / ENTENDA O CONCEITO
                  </span>
                  <h2>{s.title}</h2>
                  {s.paragraphs.map((paragraph, j) => (
                    <p key={j}>{paragraph}</p>
                  ))}
                </section>
              ))}
              <section className="edu-case">
                <span className="edu-kicker">
                  <BookOpen size={15} />
                  UM CASO PARA CONECTAR OS PONTOS
                </span>
                <h2>{c.caseStudy.title}</h2>
                <p>{c.caseStudy.text}</p>
                <div className="edu-calculation">{c.caseStudy.calculation}</div>
              </section>
              <aside className="edu-mistake">
                <CircleHelp size={21} />
                <div>
                  <h3>Um erro comum para evitar</h3>
                  <p>{c.mistake}</p>
                </div>
              </aside>
              <section className="edu-takeaways">
                <span className="edu-section-number">LEVE COM VOCÊ</span>
                <h2>O essencial, em três ideias</h2>
                {c.takeaways.map((text, i) => (
                  <p key={text}>
                    <span>{number(i + 1)}</span>
                    {text}
                  </p>
                ))}
              </section>
            </div>
            <div className="edu-read-complete">
              <div>
                <h3>
                  {state.completed.includes(id)
                    ? "Leitura concluída. Agora é com você!"
                    : "Terminou a leitura?"}
                </h3>
                <p>
                  A conclusão registra a leitura. Desafio e quiz têm resultados
                  separados.
                </p>
              </div>
              <button
                className={
                  state.completed.includes(id) ? "secondary" : "primary"
                }
                disabled={busy}
                onClick={() =>
                  mutate(
                    "lesson.toggle",
                    { id },
                    state.completed.includes(id)
                      ? "Leitura reaberta. Seus exercícios continuam salvos."
                      : "Leitura concluída. Que tal colocar em prática?",
                  )
                }
              >
                <CheckCircle2 size={17} />
                {state.completed.includes(id)
                  ? "Concluída · desfazer"
                  : "Marcar como concluída"}
              </button>
            </div>
          </article>
          <ChallengePanel
            key={"challenge-" + id}
            id={id}
            content={c.challenge}
            progress={p.challenge}
            mutate={mutate}
            busy={busy}
            go={go}
          />
          <QuizPanel
            key={"quiz-" + id}
            id={id}
            questions={c.quiz}
            progress={p.quiz}
            mutate={mutate}
            busy={busy}
          />
          <div className="edu-next-lesson">
            <button
              className="back-btn"
              onClick={() => go("educacao/trilha/" + tid)}
            >
              <ArrowLeft size={16} />
              Voltar à trilha
            </button>
            {id < 16 ? (
              <button
                className="secondary"
                onClick={() => go("educacao/aula/" + (id + 1))}
              >
                Próxima aula
                <ArrowRight size={17} />
              </button>
            ) : (
              <button className="primary" onClick={() => go("educacao")}>
                Voltar ao aprendizado
                <GraduationCap size={17} />
              </button>
            )}
          </div>
        </div>
        <aside className="edu-reader-aside">
          <div className="card edu-outline">
            <span className="edu-kicker">NESTA AULA</span>
            {[
              [
                BookOpen,
                "conteudo",
                "Entenda os conceitos",
                "Leitura e caso resolvido",
              ],
              [
                Flag,
                "desafio",
                "Coloque em prática",
                "Um desafio, três etapas",
              ],
              [
                ListChecks,
                "quiz",
                "Teste seu aprendizado",
                "3 perguntas comentadas",
              ],
            ].map(([Icon, key, title, sub]) => (
              <button
                className={active === key ? "active" : ""}
                key={key}
                onClick={() => to(key)}
              >
                <span>
                  <Icon size={19} />
                </span>
                <div>
                  <strong>{title}</strong>
                  <small>{sub}</small>
                </div>
                <ChevronRight size={14} />
              </button>
            ))}
            <div className="edu-outline-progress">
              <h3>Seu progresso nesta aula</h3>
              <div>
                <span>Leitura</span>
                {state.completed.includes(id) ? (
                  <CheckCircle2 size={16} className="green-text" />
                ) : (
                  <span>Pendente</span>
                )}
              </div>
              <div>
                <span>Desafio opcional</span>
                <span className={p.challenge?.completedAt ? "green-text" : ""}>
                  {p.challenge?.completedAt
                    ? "Concluído"
                    : p.challenge
                      ? `${p.challenge.steps.length}/3 etapas`
                      : "Não iniciado"}
                </span>
              </div>
              <div>
                <span>Melhor quiz</span>
                <span className={quizPassed(p) ? "green-text" : ""}>
                  {p.quiz?.attempts
                    ? `${p.quiz.bestScore}/3 acertos`
                    : "Ainda não feito"}
                </span>
              </div>
            </div>
          </div>
          <div className="edu-aside-note">
            <Lightbulb size={20} />
            <h3>Aprender não é acertar de primeira.</h3>
            <p>
              Leia as explicações, volte aos conceitos e tente outra vez. Sua
              melhor nota fica salva.
            </p>
          </div>
          <p className="edu-aside-disclaimer">
            <LockKeyhole size={14} />
            Não inclua senhas, documentos ou dados bancários nas reflexões.
          </p>
        </aside>
      </div>
      <p className="edu-disclaimer">
        Exemplos hipotéticos para educação financeira. Não constituem
        recomendação individual, promessa de retorno ou orientação tributária.
      </p>
    </div>
  );
}
function ChallengePanel({ id, content: c, progress: p, mutate, busy, go }) {
  const [reflection, setReflection] = useState(p?.reflection || "");
  const dirty = reflection.trim() !== (p?.reflection || "");
  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const done = !!p?.completedAt,
    steps = p?.steps || [];
  return (
    <section
      id="lesson-desafio"
      className={"card edu-practice " + (done ? "is-complete" : "")}
    >
      <div className="edu-block-heading">
        <span className="icon-tile purple">
          <Flag size={24} />
        </span>
        <div>
          <span className="edu-kicker">APRENDA FAZENDO · DESAFIO OPCIONAL</span>
          <h2>{c.title}</h2>
        </div>
        <span className={"badge " + (done ? "green" : "neutral")}>
          {done ? (
            <>
              <CheckCircle2 size={13} />
              Concluído
            </>
          ) : (
            <>
              <Clock size={13} />
              {c.duration}
            </>
          )}
        </span>
      </div>
      <p className="edu-block-description">{c.description}</p>
      <div className="edu-practice-note">
        <ShieldCheck size={16} />
        <p>
          Você pode usar dados fictícios. Não é necessário comprar, investir ou
          contratar crédito.
        </p>
      </div>
      {!p ? (
        <>
          <ol className="edu-preview-steps">
            {c.steps.map((step, i) => (
              <li key={step}>
                <span>{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <div className="edu-start-practice">
            <button
              className="primary"
              disabled={busy}
              onClick={() =>
                mutate(
                  "learning.challenge.start",
                  { id },
                  "Desafio iniciado. Faça no seu ritmo!",
                )
              }
            >
              <Flag size={16} />
              Começar desafio
            </button>
            <button className="text-btn" onClick={() => jump("lesson-quiz")}>
              Prefiro ir para o quiz
              <ArrowRight size={14} />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="edu-practice-progress">
            <span>{steps.length} de 3 etapas realizadas</span>
            <strong>{Math.round((steps.length / 3) * 100)}%</strong>
          </div>
          <div className="track">
            <i
              style={{
                width: (steps.length / 3) * 100 + "%",
                background: done ? "var(--green)" : "#a375ec",
              }}
            />
          </div>
          <div className="edu-checklist">
            {c.steps.map((step, i) => (
              <label className={steps.includes(i) ? "checked" : ""} key={step}>
                <input
                  type="checkbox"
                  checked={steps.includes(i)}
                  disabled={busy || done}
                  onChange={(e) =>
                    mutate(
                      "learning.challenge.step",
                      { id, step: i, done: e.target.checked },
                      null,
                    )
                  }
                />
                <span>{number(i + 1)}</span>
                <div>{step}</div>
              </label>
            ))}
          </div>
          {c.route && !done && (
            <button
              className="text-btn edu-context-link"
              onClick={() => {
                if (
                  dirty &&
                  !window.confirm(
                    "Sua reflexão ainda não foi salva. Deseja sair mesmo assim?",
                  )
                )
                  return;
                go(c.route);
              }}
            >
              Abrir{" "}
              {
                {
                  dashboard: "Dashboard",
                  despesas: "Despesas",
                  configuracoes: "Configurações",
                  metas: "Metas",
                  receitas: "Receitas",
                }[c.route]
              }{" "}
              para praticar
              <ArrowRight size={15} />
            </button>
          )}
          <div className="edu-reflection">
            <label htmlFor={"reflection-" + id}>Sua reflexão</label>
            <p id={"reflection-help-" + id}>{c.reflection}</p>
            <textarea
              id={"reflection-" + id}
              aria-describedby={"reflection-help-" + id}
              placeholder="Conte o que você percebeu e qual será seu próximo passo. Pode usar um exemplo fictício."
              rows={4}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              maxLength={2000}
              readOnly={done}
            />
            <div className="edu-reflection-meta">
              <span>
                {done
                  ? "Reflexão salva"
                  : dirty
                    ? "Rascunho não salvo — clique em Salvar reflexão"
                    : "Reflexão salva no servidor"}{" "}
                · {reflection.length}/2.000 caracteres
              </span>
              {!done && (
                <button
                  className="text-btn"
                  disabled={busy || !dirty}
                  onClick={async () => {
                    if (
                      await mutate(
                        "learning.challenge.note",
                        { id, reflection },
                        "Reflexão salva.",
                      )
                    )
                      setReflection(reflection.trim());
                  }}
                >
                  <Save size={14} />
                  Salvar reflexão
                </button>
              )}
            </div>
          </div>
          <div className="edu-practice-footer">
            <p>
              {done
                ? "Conquista registrada! Você pode reabrir para revisar sua prática."
                : "Para concluir, realize as três etapas e escreva uma reflexão de pelo menos 20 caracteres."}
            </p>
            <button
              className={done ? "secondary" : "primary"}
              disabled={
                busy ||
                (!done && (steps.length < 3 || reflection.trim().length < 20))
              }
              onClick={async () => {
                if (done)
                  await mutate(
                    "learning.challenge.reopen",
                    { id },
                    "Desafio reaberto.",
                  );
                else if (
                  await mutate(
                    "learning.challenge.complete",
                    { id, reflection },
                    "Desafio concluído! Conhecimento colocado em prática.",
                  )
                )
                  setReflection(reflection.trim());
              }}
            >
              {done ? <RotateCcw size={16} /> : <CheckCircle2 size={17} />}{" "}
              {done ? "Reabrir desafio" : "Concluir desafio"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
function QuizPanel({ id, questions, progress: p, mutate, busy }) {
  const result = p?.last && p.draft === null ? p.last : null;
  const answers =
    p?.draft || result?.answers || Array(questions.length).fill(null);
  const answered = answers.filter((a) => Number.isInteger(a)).length;
  const [formError, setFormError] = useState("");
  const resultRef = useRef();
  const submittedRef = useRef(false);
  useEffect(() => {
    if (result && submittedRef.current) {
      resultRef.current?.focus();
      submittedRef.current = false;
    }
  }, [result?.submittedAt]);
  async function submit(e) {
    e.preventDefault();
    if (answered < questions.length) {
      setFormError("Responda as três perguntas para conferir seu resultado.");
      return;
    }
    setFormError("");
    submittedRef.current = true;
    if (
      !(await mutate(
        "learning.quiz.submit",
        { id },
        "Quiz corrigido. Confira as explicações!",
      ))
    )
      submittedRef.current = false;
  }
  return (
    <section className="card edu-quiz" id="lesson-quiz">
      <div className="edu-block-heading">
        <span className="icon-tile red">
          <ListChecks size={24} />
        </span>
        <div>
          <span className="edu-kicker">RELEMBRE. RACIOCINE. RESPONDA.</span>
          <h2>Teste seu aprendizado</h2>
        </div>
        <span className="badge neutral">{questions.length} perguntas</span>
      </div>
      <p className="edu-block-description">
        Não é sobre decorar. Aplique os conceitos aos cenários abaixo e confira
        a explicação de cada resposta.
      </p>
      <div className="edu-quiz-rules">
        <span>
          <CheckCircle2 size={14} />
          Aprovação com 2 de 3 acertos
        </span>
        <span>
          <RotateCcw size={14} />
          Tentativas ilimitadas
        </span>
        <span>
          <ShieldCheck size={14} />
          Respostas salvas a cada escolha
        </span>
      </div>
      {result && (
        <div
          className={"edu-quiz-result " + (result.passed ? "passed" : "review")}
          ref={resultRef}
          tabIndex={-1}
          role="status"
          aria-label="Resultado do quiz"
        >
          <div
            className="edu-score-ring"
            style={{ "--score": (result.score / 3) * 100 + "%" }}
          >
            <strong>
              {result.score}
              <small>/3</small>
            </strong>
          </div>
          <div>
            <span className="edu-kicker">
              TENTATIVA {result.attempt} ·{" "}
              {Math.round((result.score / 3) * 100)}% DE ACERTOS
            </span>
            <h3>
              {result.score === 3
                ? "Você conectou todos os pontos!"
                : result.passed
                  ? "Muito bem! Você foi aprovado."
                  : "Vamos reforçar alguns conceitos?"}
            </h3>
            <p>
              {result.passed
                ? "Revise as explicações abaixo. Você pode tentar novamente para consolidar o que aprendeu."
                : "Errar faz parte. Leia as explicações, volte ao conteúdo e tente novamente no seu ritmo."}
            </p>
            <small>
              Melhor resultado: {p.bestScore}/3 · {p.attempts} tentativa(s)
            </small>
          </div>
        </div>
      )}
      <form onSubmit={submit}>
        <div className="edu-question-list">
          {questions.map((q, qi) => {
            const selected = answers[qi];
            const correct = selected === q.answer;
            return (
              <fieldset
                className="edu-question"
                key={qi}
                disabled={busy || !!result}
              >
                <legend>
                  <span>QUESTÃO {number(qi + 1)}</span>
                  {q.prompt}
                </legend>
                <div className="edu-options">
                  {q.options.map((option, oi) => {
                    const status = result
                      ? oi === q.answer
                        ? "correct"
                        : selected === oi
                          ? "incorrect"
                          : ""
                      : selected === oi
                        ? "selected"
                        : "";
                    return (
                      <label className={"edu-option " + status} key={oi}>
                        <input
                          type="radio"
                          name={"question-" + id + "-" + qi}
                          aria-label={option}
                          value={oi}
                          checked={selected === oi}
                          onChange={() => {
                            setFormError("");
                            mutate(
                              "learning.quiz.answer",
                              { id, question: qi, answer: oi },
                              null,
                            );
                          }}
                        />
                        <span className="edu-option-letter">{letter(oi)}</span>
                        <span>{option}</span>
                        {result && oi === q.answer ? (
                          <CheckCircle2 size={18} />
                        ) : result && selected === oi ? (
                          <XCircle size={18} />
                        ) : selected === oi ? (
                          <Check size={18} />
                        ) : null}
                      </label>
                    );
                  })}
                </div>
                {result && (
                  <div
                    className={
                      "edu-answer-feedback " +
                      (correct ? "correct" : "incorrect")
                    }
                  >
                    <strong>
                      {correct ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <CircleHelp size={16} />
                      )}{" "}
                      {correct
                        ? "Resposta correta!"
                        : `Vamos revisar · resposta correta: ${letter(q.answer)}`}
                    </strong>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </fieldset>
            );
          })}
        </div>
        {formError && (
          <p role="alert" className="form-error">
            {formError}
          </p>
        )}
        <div className="edu-quiz-footer">
          {result ? (
            <>
              <div>
                <strong>O aprendizado continua.</strong>
                <p>Sua melhor nota é preservada em todas as tentativas.</p>
              </div>
              <button
                type="button"
                className="secondary"
                disabled={busy}
                onClick={async () => {
                  if (
                    await mutate(
                      "learning.quiz.retry",
                      { id },
                      "Nova tentativa iniciada. Sua melhor nota foi mantida.",
                    )
                  ) {
                    setFormError("");
                    jump("lesson-quiz");
                  }
                }}
              >
                <RotateCcw size={16} />
                Tentar novamente
              </button>
            </>
          ) : (
            <>
              <div>
                <strong>
                  {answered} de {questions.length} respondidas
                </strong>
                <p>
                  {busy
                    ? "Salvando sua escolha..."
                    : "Você pode mudar as respostas antes de corrigir."}
                </p>
              </div>
              <button className="primary" disabled={busy}>
                <ListChecks size={17} />
                Corrigir quiz
              </button>
            </>
          )}
        </div>
      </form>
      {p?.history?.length > 0 && (
        <details className="edu-attempt-history">
          <summary>
            Seu histórico de tentativas <span>{p.attempts}</span>
          </summary>
          <p>
            Últimas 20 tentativas. A contagem total e a melhor nota são
            preservadas.
          </p>
          {[...p.history].reverse().map((h) => (
            <div key={h.attempt}>
              <span>Tentativa {h.attempt}</span>
              <time dateTime={h.submittedAt}>
                {new Date(h.submittedAt).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </time>
              <b className={h.passed ? "green-text" : "muted"}>
                {h.score}/{h.total} · {h.passed ? "Aprovado" : "Revisar"}
              </b>
            </div>
          ))}
        </details>
      )}
    </section>
  );
}
