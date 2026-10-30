# Y Finance
Integrantes do grupo: Levi Sousa, Pedro Arruda, Vitor Silva e Vítor Rangel

Aplicativo de organização e educação financeira com receitas, despesas, categorias, metas, recorrências automáticas, alertas internos, relatórios Excel e assistente local sem chave de IA.

## Instalar e executar

Requisitos: Node.js **20.19+ ou 22.12+** e npm.

Abra o terminal **dentro da pasta `yfinance` que contém `package.json` e `package-lock.json`**. No Windows, confira com `dir package.json, package-lock.json`. Não use `npm init` para contornar uma pasta incorreta.

```bash
npm ci
npm run build
npm start
```

Acesse **http://localhost:3000**. Mantenha o terminal aberto; **Ctrl + C** encerra o servidor. Nas próximas execuções, sem alterações no código, basta `npm start`.

## Editar

O código-fonte foi preservado. Para desenvolver, depois de `npm ci`:

```bash
npm run dev
```

Para executar a interface atualizada em produção, pare o servidor, rode `npm run build` e inicie novamente com `npm start`. Não exponha o modo de desenvolvimento publicamente.

O projeto mínimo contém somente os comandos `dev`, `build` e `start`. Testes auxiliares, Docker, documentação extra e ferramentas de formatação foram removidos; a formatação existente do código foi mantida.

## Arquivos necessários

- `server.js`: autenticação, API e persistência.
- `lib/`: cálculos, assistente, recorrências, alertas e Excel.
- `src/`: interface, estilos e conteúdo educacional. `src/curriculum.js` também é usado pelo servidor; **não remova essa pasta**.
- `public/`: logotipo, ícones, fontes locais e sua licença.
- `index.html`: entrada da interface.
- `package.json` e `package-lock.json`: comandos e dependências.
- `data/`: contas, sessões, lançamentos, conversas e progresso. **Não apagar nem compartilhar publicamente.**
- `.gitignore`: evita versionar dados privados, credenciais e arquivos gerados.
- `node_modules/`: dependências instaladas por `npm ci`.
- `dist/`: interface compilada por `npm run build`, necessária para `npm start`.

`node_modules/` e `dist/` são gerados, mas necessários para executar a instalação. Após o build, um ambiente exclusivamente de produção pode usar `npm prune --omit=dev`. Para editar ou recompilar depois, execute `npm ci` novamente.

## Dados e atualização

A primeira utilização permite uma demonstração com dados fictícios. Cadastre uma conta para começar sem esses lançamentos. Login e senha são locais ao aplicativo; Google e recuperação de senha por e-mail não estão conectados.

Antes de atualizar, pare o servidor e faça backup de **`data/`** e de **`.env`**, se existir. Atualize os arquivos de código sem substituir seus dados por arquivos de outra instalação. Depois execute `npm ci`, `npm run build` e `npm start`. A prévia desta conversa não atualiza automaticamente a cópia do seu computador.

O banco é `data/database.json`, adequado a uma instalação pequena com **um único processo** e armazenamento persistente. Não execute várias instâncias gravando no mesmo arquivo. Para publicação, use HTTPS, backups e disco persistente; revise segurança e privacidade antes de receber dados financeiros reais.

## Regras importantes

- Saldo é receitas menos despesas registradas no recorte, não saldo bancário. Aportes em metas são independentes e não descontam automaticamente desse saldo.
- Recorrências criam registros no vencimento, **não realizam pagamentos**. O servidor verifica a cada minuto e recupera pendências de regras ativas ao reiniciar. Ao retomar uma regra pausada, datas anteriores a hoje são ignoradas; o limite de ocorrências inclui essas datas.
- Alertas de orçamento aparecem somente no aplicativo, em 80% e 100%, sem repetir o mesmo nível/categoria/mês.
- Excel usa os dados atuais da conta no momento do download. Metas, limites e regras são a posição atual. Editar a planilha não altera o aplicativo. Downloads contêm valores completos mesmo quando ocultos na tela.
- Educação mantém 17 aulas, desafios opcionais e 51 questões. Leitura, práticas e quizzes são independentes; novas tentativas preservam a melhor nota.
- O assistente usa regras e cálculos locais: **não é uma IA generativa**. Não acessa bancos ou cotações nem altera registros pelo chat. Perguntas não reconhecidas podem solicitar esclarecimento.

Experimente: **“Analise meus gastos” → “E no mês passado?” → “E em Lazer?” → “Gere Excel desse período”**. Use o nome de uma categoria cadastrada. O botão **Entender cálculo** explica o método. O Excel exporta registros reais, não simulações, buscas textuais ou a tabela comparativa do chat.

## Configuração opcional

O servidor usa a porta `3000`; a variável `PORT` permite alterá-la. Ele carrega `.env`, quando esse arquivo existe. Nunca publique credenciais nem as coloque no frontend.

Não é necessário configurar IA. Deixe `AI_API_KEY` vazia para funcionamento exclusivamente local. A integração externa opcional usa `AI_API_KEY`, `AI_MODEL` e `AI_API_URL`; pedidos não reconhecidos localmente podem enviar mensagens e informações financeiras ao fornecedor e gerar custos. Avalie privacidade e consentimento antes de habilitá-la para outras pessoas.
