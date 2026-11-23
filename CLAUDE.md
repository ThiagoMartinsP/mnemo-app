# MNEMO — Guia rápido para novos chats

> Leia isto primeiro. Resumo do projeto, da arquitetura e do estado atual da implementação.
> A fonte de verdade das **regras do algoritmo** é o `SPECS.md` (seções citadas como §N abaixo).

## O que é

Backend de um planejador de estudos com repetição espaçada. O usuário cadastra **matérias**
(com data de prova opcional) e **tópicos**; o sistema calcula um **score** por tópico e gera
um ranking do que estudar hoje. Unidade de estudo = bloco de 45+ min, não flashcard.

Escopo do roadmap: Parte 1 = núcleo do algoritmo (spec fechada), Parte 2 = API/banco
(em andamento), Parte 3 = front-end (só scaffold + console de testes; ver "Fatias").

## Stack

- Java 21, Spring Boot **4.0.8** (starters `webmvc`, `data-jpa`, `validation`, `h2console`)
- H2 (runtime) — sem configuração de datasource em `application.properties`, ou seja,
  banco **em memória**: os dados somem a cada restart. Use `POST /test/seedDataBase` para popular.
- Maven wrapper (rodar de dentro de `spring-boot/`): `./mvnw spring-boot:run` · `./mvnw test` (no Windows: `mvnw.cmd`)
- Repositório: https://github.com/ThiagoMartinsP/mnemo-app — branch `main`. **Monorepo**: `spring-boot/` (back-end) e `react/` (front-end)
- Front-end (`react/`): scaffold padrão do Vite 8 + React 19 + TypeScript (lint com `oxlint`),
  ainda sem telas. `npm run dev` sobe na porta 5173; o back-end roda na 8080, então chamar a API
  vai exigir CORS no Spring ou `server.proxy` no `vite.config.ts`.
- Console de testes provisório: `spring-boot/src/main/resources/static/index.html` (HTML puro,
  servido pelo próprio Spring em `http://localhost:8080/`, mesma origem → sem CORS).

## Estrutura (`spring-boot/src/main/java/mnemo/app`)

| Camada | Arquivo | Papel |
|---|---|---|
| entities | `Materia` | `id`, `nome`, `dataProva` (a prova vive na matéria, §1), `@OneToMany topicos` |
| entities | `Topico` | `id`, `nome`, `ultimaVezVisto`, `nivel`, `dificuldade`, `@ManyToOne materia` (obrigatória) |
| entities | `Sessao` | `id`, `dia`, `avaliacao` (`double`), `duracao` (`LocalTime`), `@OneToOne topico` — esboço, sem construtor/getters/setters |
| dto | `TopicoPontuado` | `record (Topico topico, double score)` — item do ranking |
| repository | `MateriaRepository`, `TopicoRepository`, `SessaoRepository` | `JpaRepository` puros |
| services | `CalculadoraDeScore` | classe estática final com a fórmula do score (§5) |
| services | `RankingService` | carrega todos os tópicos, pontua e ordena desc |
| services | `MateriaService`, `TopicoService` | CRUD mínimo (criar/listar) |
| services | `TestsService` | seed de dados provisório (4 matérias, 10 tópicos com cenários da spec) |
| controller | `MateriaController` | `POST /materia`, `GET /materia` |
| controller | `TopicoController` | `POST /topico`, `GET /topico` |
| controller | `RankingController` | `GET /ranking?date=YYYY-MM-DD` (padrão: hoje) |
| controller | `TestsController` | `POST /test/seedDataBase` (provisório) |

Convenções de código:
- Injeção via construtor (sem `@Autowired`), nomes de domínio em português.
- JSON: datas no formato `dd/MM/yyyy`; campos compostos em snake_case via `@JsonProperty`
  (`data_prova`, `ultima_vez_visto`). O query param `date` do ranking é ISO (`YYYY-MM-DD`).
- Commits em português no estilo Conventional Commits (`feat:`, `refactor:`, `test:`).

Exemplo de payloads:
```json
POST /materia  { "nome": "Cálculo 3", "data_prova": "20/10/2026" }
POST /topico   { "nome": "Integrais de linha", "ultima_vez_visto": "24/09/2026",
                 "nivel": 0, "dificuldade": 0.5, "materia": { "id": 1 } }
```

## O algoritmo em uma tela (detalhes: SPECS.md §5)

```
score              = pressão × g(dif) × h(diasAtéProva)
pressão            = diasDesde(ultimaVezVisto) ÷ (INTERVALOS[nivel] × f(dif))   // ilimitada
INTERVALOS         = {1, 3, 6, 12, 24}          // nivel ∈ [0, 4], não passa do topo
f(d) = 1 + 0.6·(0.5 − d)   // desce com a dificuldade (encurta intervalo)
g(d) = 1 + 0.6·(d − 0.5)   // sobe com a dificuldade (multiplica score)
h    = 1 + (C − 1)·t²,  t = clamp((12 − dias)/12, 0, 1),  C = 3 ;  sem prova → h = 1
```

- Dificuldade ∈ [0, 1], neutro 0.5; atualizada por EMA `α = 0.12`, alvos tranquilo→0,
  com esforço→0.5, esqueci→1 (§5.2).
- Avaliação pós-sessão: **Tranquilo** sobe 1 nível · **Com esforço** mantém · **Esqueci** reseta para 0 (§2.3).
- Alocação diária: usuário informa horas livres; piso de 45 min por bloco, divide igualmente
  entre os tópicos de maior score (§4.7).
- **Invariantes que não podem quebrar:**
  - `h` tem teto finito (`C`); a pressão não tem teto (§4.8 — proteção anti-abandono).
  - `hoje` é passado de cima para todos os fatores; nenhum fator chama `LocalDate.now()` (§4.9, §5.7).
  - Tudo em `double`; nada de literais `float` nem divisão inteira (§5.5, §5.7).
  - `f` e `g` não podem ser invertidas — tópico difícil tem que ter score **maior** (§5.4).
- "Pressão" é só o termo de esquecimento; o fator de prova se chama **multiplicador** (§5.7).

## Fatias (fluxo do usuário) — estado atual

A SPECS não define fatias; esta divisão segue o fluxo cadastrar → ver o que estudar →
estudar e avaliar → planejar o dia. Nenhuma está completa de ponta a ponta.

| # | Fatia | Estado |
|---|---|---|
| 1 | Cadastro de matérias e tópicos | **Parcial** — criar/listar funcionam; falta editar/excluir, `@Valid` e defaults no `POST /topico` |
| 2 | Ranking do dia (score, §5) | **Funciona com bugs** — ver divergências abaixo (prova nula, `12f`, clamp de `nivel`, teste §5.4) |
| 3 | Avaliação pós-sessão (§2, §5.2) | **Só esboço** — entidade `Sessao` + repositório; sem service/endpoint. Sem ela `nivel` e `dificuldade` nunca mudam |
| 4 | Alocação diária por horas livres (§4.7) | **Não iniciada** — depende da decisão sobre trava por tópico (§6.1) |
| 5 | Front-end | Console HTML de testes em `static/`; `react/` só com scaffold do Vite |

## Estado atual — pendências e divergências conhecidas

Divergências entre código e spec (checar antes de mexer no score):
- `CalculadoraDeScore.calculate` já lê `topic.getMateria().getDataProva()`, mas **falta o guard
  de `null`** → `h = 1` (§5.6): matéria sem prova faz `ChronoUnit.DAYS.between(today, null)`
  lançar NPE e derruba o `GET /ranking` inteiro. O seed não expõe isso (todas as matérias têm prova).
- Usa literais `12f` em `calculateExamPressure` (spec pede `double`).
- `INTERVALOS[level]` não tem clamp de `nivel` — `nivel > 4` lança `ArrayIndexOutOfBounds`.
- `POST /topico` não aplica defaults: sem `ultima_vez_visto` o ranking dá NPE; sem
  `dificuldade` ela fica `0.0` em vez de `0.5` (§4.3, §5.1).
- Construtor `Topico(String, LocalDate dataProva, ...)` tem parâmetro `dataProva` não usado
  e chama `LocalDate.now()` internamente.
- `Topico.nome` mapeia para a coluna `name` (as demais colunas estão em português).
- `TestsController` tem import não usado `org.aspectj.weaver.ast.Test`.
- `Sessao`: `@OneToOne` com `Topico` está errado (um tópico tem várias sessões → `@ManyToOne`);
  `avaliacao` é `double`, mas a escala tem 3 valores discretos (§2.1) — um `enum` encaixa melhor;
  a entidade não tem construtor, getters nem setters.

Ainda não implementado:
- Service + endpoint de avaliação pós-sessão (registrar `Sessao`, aplicar a escada §2.3,
  atualizar `dificuldade` via EMA e `ultimaVezVisto`).
- Alocação diária por horas livres (§4.7).
- Testes: só existe `contextLoads`. A spec pede no mínimo o teste de ordenação por
  dificuldade (dois tópicos iguais, `d = 0.9` vs `d = 0.1` → o difícil com score maior).
- Banco persistente, validação (`@Valid`) nos endpoints, tratamento de erros.

Em aberto na spec (não decidir sozinho — perguntar ao usuário): trava por tópico (§6.1),
cobertura antes da prova, comportamento de `h` pós-prova, arquivamento de tópicos/matérias (§6.3).

## Preferências do usuário

- Responder em português.
- Em mudanças de front-end ou de infraestrutura (cliente/servidor, requisições), dar
  explicações mais técnicas do que está sendo feito.
