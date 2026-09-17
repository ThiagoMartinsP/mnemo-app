# MNEMO — Núcleo do algoritmo (Parte 1)

**Data:** 2026-09-17
**Status:** núcleo concretizado — as quatro funções da fórmula do score têm forma e valores
de partida (seção 5). Restam apenas os itens de julgamento e os deferidos (seção 6).
**Escopo:** apenas o núcleo de decisão. API (Parte 2) e front-end (Parte 3) fora do escopo.

Este documento detalha a Parte 1 da spec conceitual. Onde ele diverge do documento
conceitual, ele prevalece — as divergências estão marcadas explicitamente.

> **Mudanças desta versão (em relação a 2026-09-01):** toda a antiga seção 5.2 ("valores a
> definir") foi resolvida e migrou para a nova **seção 5 (Núcleo concretizado)**. As seções
> "Em aberto" e "Riscos" foram renumeradas para 6 e 7. Decisões inline (2.4, 4.1, 4.6, 4.8)
> ganharam ponteiros para os valores concretos.

---

## 1. Modelo de dados do tópico

O tópico é a unidade de acompanhamento. Cada tópico carrega:

| Campo | Descrição |
|---|---|
| `materia` | matéria à qual pertence (a prova vive aqui, não no tópico) |
| `ultimaVezVisto` | data da última sessão de estudo, ou da criação se nunca estudado |
| `nivel` | degrau atual na escada de intervalos |
| `dificuldade` | traço inferido, contínuo, atualizado por média móvel |

O nome `ultimaVezVisto` foi escolhido em vez de "última revisão" porque o primeiro
contato com um tópico não é uma revisão, e o campo precisa cobrir os dois casos.

**Distinção importante:** `ultimaVezVisto` é o dado armazenado. A *pressão de
esquecimento* é o valor derivado que entra na pontuação (seção 3). Os nomes são
mantidos separados de propósito: na calibração se mexe no cálculo, não na data.

**Reafirmação (implementação):** `dataProva` pertence à `Materia`, não ao `Topico`. A rampa
de prova é a mesma para todos os tópicos de uma matéria; duplicar a data por tópico obrigaria
a sincronizar N cópias e abriria espaço para inconsistência. Ver seção 5.7.

---

## 2. Avaliação pós-sessão e suas consequências

### 2.1 A escala

Três níveis:

- **Esqueci**
- **Com esforço**
- **Tranquilo**

**Divergência da spec conceitual,** que previa quatro níveis (fácil/médio/difícil/esqueci).
Motivo: a escala de quatro não é um eixo único. Fácil → médio → difícil é um contínuo
de esforço, mas difícil → esqueci é uma quebra categórica, não mais um degrau. Além
disso, a distinção entre "difícil" e "médio" tende a variar mais com o humor do usuário
do que com o tópico, e instabilidade é especialmente cara num dado que alimenta uma média.

### 2.2 O que a pergunta mede

A avaliação é sobre o **estado no início da sessão** — quanto o usuário ainda lembrava
ao reabrir o assunto, antes de revisar.

Isso é deliberado. A unidade aqui é um bloco de estudo de 45+ minutos, não um flashcard
de dez segundos. Ao fim de 45 minutos estudando um assunto, o usuário provavelmente o
domina; perguntar "como foi a sessão?" produziria "ok" quase sempre e o sinal perderia
valor. O que carrega informação é se o intervalo anterior aguentou.

### 2.3 Efeito na escada

Cada avaliação tem um efeito único e não ambíguo:

| Avaliação | Efeito no nível |
|---|---|
| Tranquilo | sobe um degrau (o intervalo aguentou, pode esticar) |
| Com esforço | permanece (o intervalo está calibrado) |
| Esqueci | reset para o degrau inicial |

Os dois primeiros são movimento contínuo; o terceiro é descontinuidade — coerente com
a natureza da escala.

### 2.4 Efeito na dificuldade

Média móvel exponencial, com adaptação **lenta** (ordem de 10–15% de peso por avaliação).
Tranquilo empurra para baixo, com esforço é aproximadamente neutro, esqueci empurra para cima.

Consequência desejada: são necessários vários "esqueci" ao longo de semanas para um tópico
ser classificado como difícil.

*(Fórmula, régua e valores concretos: seções 5.1 e 5.2.)*

---

## 3. Dificuldade como traço, não como estado

Esta é a decisão que mais restringe o resto do desenho.

A palavra "dificuldade" estava fazendo dois trabalhos na spec conceitual:

- **Traço** — "este tópico é intrinsecamente custoso para mim". Muda ao longo de semanas.
- **Estado** — "não estou lembrando disto agora". Muda a cada sessão.

**Decisão: a escada carrega o estado, a dificuldade carrega o traço.**

Motivo: o sistema já tem um mecanismo para o estado. Esqueceu → reset da escada → intervalo
curto → pressão de esquecimento alta → o tópico sobe. Se a dificuldade também reagisse
forte ao "esqueci", o mesmo evento seria contado três vezes (intervalo curto, modificador
que encurta ainda mais, e bônus de dificuldade na pontuação).

**Isto dissolve a maior parte do risco "ciclo vicioso do esqueci" da seção 8 da spec
conceitual.** O ciclo não nascia da reserva mínima — nascia da contagem tripla. Com a
separação, "esqueci" apenas reseta a escada: o tópico volta no dia seguinte, é estudado,
e se correr bem sobe de degrau e sai da frente. Esse é o comportamento correto, não uma
patologia.

*(A dificuldade vive numa régua contínua `[0, 1]`, neutro em `0.5` — ver seção 5.1.)*

---

## 4. Decisões fechadas

### 4.1 Intervalos entre revisões — escada + modificador de dificuldade

A escada define o intervalo base por degrau. A dificuldade inferida estica ou encurta esse
intervalo base.

Escolhido em vez de SM-2 clássico porque SM-2 foi desenhado para flashcards atômicos, e o
ajuste fino do fator de facilidade é pouco intuitivo quando a unidade é um bloco de estudo
sobre um assunto inteiro. Escolhido em vez de escada pura porque a dificuldade já precisa
existir como dado de primeira classe para a pontuação — reaproveitá-la aqui não adiciona
estado novo.

*(Escada e modificador concretos: seções 5.3 e 5.4.)*

### 4.2 O fator "novidade" foi eliminado

**Divergência da spec conceitual,** que listava novidade como quarto fator da pontuação.

Motivo: um tópico nunca estudado não tem pressão *baixa*, tem pressão **indefinida** — não
existe intervalo previsto em relação ao qual ele esteja atrasado. Um "pequeno incentivo"
era um remendo externo para isso.

**Solução:** o tópico recebe `ultimaVezVisto` no momento da criação e entra na escada no
degrau inicial. Como esse degrau é o de intervalo mais curto, em um ou dois dias o tópico
já tem pressão alta e sobe sozinho. O conteúdo da aula de hoje volta ao usuário logo — que
era exatamente o comportamento que a novidade tentava produzir, agora emergindo da mecânica
existente em vez de um fator dedicado.

O sistema passa a ter três fatores, cada um com papel distinto: uma necessidade, um
modificador dela, e uma pressão de prazo.

### 4.3 Data de um tópico novo — data de registro

`ultimaVezVisto` de um tópico novo é sempre a data de cadastro. Sem edição, sem perguntar
a data da aula.

Limitação conhecida e aceita: se o usuário assiste aula na terça e cadastra no sábado, o
sistema tratará o conteúdo como fresco quando já se passaram quatro dias. Cadastro em lote
é plausível justamente em semanas apertadas.

Aceito por simplicidade. Reversível a baixo custo — tornar o campo editável é acrescentar
um campo, sem mexer no núcleo.

### 4.4 Forma da pontuação — base com multiplicadores

```
score = pressão_de_esquecimento × modificador_dificuldade × multiplicador_prova
```

A forma não foi escolhida por estética, mas por eliminação, a partir do que cada fator
de fato é:

- **Pressão de esquecimento** é a única medida contínua e genuína de necessidade → base.
- **Dificuldade** não é uma necessidade independente; um tópico difícil não precisa de
  atenção *por ser* difícil, precisa de atenção *mais cedo* → modula.
- **Prova** não é uma medida de memória, é um prazo, e vive na matéria, não no tópico →
  modula.

**Multiplicativo confirmado (revisão desta sessão).** Levantou-se a hipótese de somar o
fator de prova (por ele ser prazo, não memória, o argumento do "portão" não se aplica a ele
como se aplica à dificuldade). Rejeitada mesmo assim: somar cria um piso alto para *toda* a
matéria em prova (um segundo tier de prioridade dura) que empurra a matéria negligenciada
para o fundo — remando contra a proteção anti-abandono da 4.8. O multiplicativo **escala** a
pressão que já existe e mantém todas as matérias no mesmo eixo; o aditivo **translada** e
cria dominância. O desconforto que motiva "somar prova" é, na verdade, *cobertura* (6.3), que
pede regra separada, não um fator de score sobrecarregado — o mesmo erro de "dois trabalhos
num campo" que a seção 3 desfez.

### 4.5 Pressão de esquecimento — razão, não valor absoluto

```
pressão = (dias desde ultimaVezVisto) ÷ (intervalo previsto para o nível atual)
```

Esta normalização importa mais que qualquer peso do sistema. Dois dias de atraso sobre um
intervalo de três dias é urgente; dois dias sobre um intervalo de trinta é irrelevante.
Usar dias absolutos trataria os dois casos como iguais.

**A pressão é ilimitada por construção** — ver seção 4.8, onde isso vira uma garantia.

### 4.6 Prova — rampa contínua no nível da matéria

A partir de um horizonte fixo antes da data (ordem de 14 dias), a matéria ganha um
multiplicador que cresce conforme a data se aproxima. Fora do horizonte, sem efeito.

Escolhido em vez de janela fixa porque a janela cria um degrau brusco: no dia 15 a matéria
é irrelevante, no dia 14 domina a agenda. Escolhido em vez de encurtar os intervalos da
escada porque isso misturaria prazo com memória e poluiria a escada com estado temporário
que precisaria ser desfeito depois.

*(Horizonte, forma da curva e teto concretos: seção 5.6. Decidido nesta sessão: horizonte de
**12** dias, rampa **acelerada** — `t²` — e teto **C = 3**.)*

### 4.7 Alocação — piso de 45 min com divisão igual

O usuário informa apenas o total de horas livres do dia. O algoritmo:

1. calcula quantos tópicos cabem sem violar o piso de 45 minutos;
2. seleciona os de maior score;
3. divide o tempo do dia igualmente entre eles.

Exemplos:

| Dia | Resultado |
|---|---|
| 1h | 1 tópico, 60 min |
| 2h | 2 tópicos, 60 min cada |
| 3h | 3 tópicos de 60 min |
| 2h, mas só 1 tópico pressionando | 1 tópico, 120 min |

**Reenquadramento em relação à discussão inicial:** o parâmetro é um **piso**, não uma
duração fixa de slot. "Todo bloco tem exatamente 30 min" é uma afirmação sobre a qual é
difícil ter convicção; "menos de 45 min não rende" é uma percepção que o usuário tem ao
usar. Efeitos colaterais: o problema do resto desaparece (1h20 vira dois blocos de 40, não
dois de 30 mais um caco de 20) e dias com poucos tópicos pressionando geram blocos mais
longos automaticamente.

Isto atende diretamente ao risco "fragmentação excessiva" da seção 8 da spec conceitual:
blocos curtos demais são impossíveis por construção.

**Consequência dimensional:** com piso de 45 min e dias de 1–2h, a semana tem tipicamente
**7 a 12 blocos no total**. Todo o resto do desenho precisa assumir esse volume baixo.

### 4.8 Sem reserva anti-negligência explícita

**Divergência da spec conceitual,** que previa reserva mínima de tempo para matérias
negligenciadas.

Primeiro, a reserva *diária* é incompatível com o piso de 45 min: num dia de 1h existe um
bloco só, então ou a matéria pega o dia inteiro ou não pega nada. Não há fatia para reservar.

Segundo, o sintoma real é semanal, não diário. A matéria não é esquecida por perder uma
disputa num dia; é esquecida por perder todos os dias durante semanas, enquanto o
multiplicador de prova de outra matéria domina.

**Decisão: nenhuma regra explícita. A proteção emerge das taxas de crescimento.**

> **Invariante de calibração — obrigatório.**
> A pressão de esquecimento cresce **sem limite** (uma matéria abandonada há 21 dias com
> intervalo de 3 tem pressão 7, e continua subindo). O multiplicador de prova **precisa
> ter teto**.
>
> Com isso, a matéria negligenciada ultrapassa a matéria em prova sozinha, e a proteção
> da seção 8 emerge da mecânica. Sem isso — se a rampa puder crescer indefinidamente —
> ela vence qualquer coisa e a matéria negligenciada nunca volta, que é exatamente o
> problema que motivou o projeto.

**Teto fixado nesta sessão: `C = 3`** (seção 5.6). O *valor* é dial de calibração; a
*finitude* é lei. A rampa acelerada (`t²`) não afeta a invariante — o pico continua sendo
exatamente `C`.

**Risco residual aceito:** a garantia é de convergência, não de prazo. A matéria volta,
mas possivelmente só depois da prova da outra. É observável no uso; se acontecer, um piso
semanal por matéria pode ser adicionado depois sem refazer nada.

### 4.9 Recálculo diário a partir do estado real

Mantido da spec conceitual, sem alteração. O plano é sempre recalculado a partir do que de
fato aconteceu. Um dia pulado não precisa de regra de realocação: o tópico não estudado
continua com a mesma `ultimaVezVisto`, sua pressão só cresce, e ele reaparece naturalmente
no topo do ranking. A visão semanal é projeção, não compromisso.

**Consequência de implementação:** a data de referência (`hoje`) é passada de cima para
*todos* os fatores do score, num único ponto. Nenhum fator captura o relógio por conta
própria — ver seção 5.7.

---

## 5. Núcleo concretizado — funções e valores

As quatro funções da fórmula do score agora têm forma e valores de partida. Esta seção
reúne todas num só lugar, para servir de referência ao lado do código. A distinção entre
**valor fixo** e **dial de calibração** está na tabela 5.8.

Fórmula, para referência:

```
score = pressão_de_esquecimento × modificador_dificuldade × multiplicador_prova
```

Os quatro pontos onde a calibração entra são `base`, `f`, `g` e `h`. O resto é aritmética
fixa.

### 5.1 Régua da dificuldade

`dificuldade ∈ [0, 1]`, com `0.5 = médio` (o ponto neutro). Um tópico sem histórico nasce
em `0.5`.

Régua limitada resolve três coisas de graça: a EMA de valores em `[0,1]` nunca escapa de
`[0,1]`; o neutro tem um ponto natural no meio; e `f`/`g` ganham um domínio fixo para mapear.

*(Resolve o item "dificuldade inicial de um tópico sem histórico" da antiga 5.2.)*

### 5.2 Atualização da dificuldade — EMA

```
nova_dif = (1 − α)·dif_antiga + α·alvo        // equivalente: dif + α·(alvo − dif)
α = 0.12

alvos:   tranquilo → 0     com esforço → 0.5     esqueci → 1
```

- `alvo` é para onde *aquela única avaliação* empurraria a dificuldade se mandasse sozinha —
  não é a dificuldade nova; a dificuldade só anda `α` (12%) da distância até ele.
- `α = 0.12` é o meio da faixa 10–15% pedida na 2.4. É o que produz a lentidão do traço:
  três "esqueci" seguidos levam a dificuldade de `0.50` para só `0.66` (`0.56 → 0.61 → 0.66`).

**Decisão: `α` simétrico para os três — "esqueci" NÃO pesa mais que "com esforço".**
*(Resolve o item aberto correspondente da antiga 5.2.)* O choque imediato do "esqueci" já é
absorvido pelo reset do `nivel` (o estado). Dar `α` extra ao "esqueci" reintroduziria pela
porta dos fundos a contagem dupla que a seção 3 desfez.

### 5.3 `base(nivel)` — a escada

```
INTERVALOS = { 1, 3, 6, 12, 24 }   // dias; o índice é o nivel
```

Guardada como **array explícito** de dias, não como fórmula geradora — afinar à mão é mais
fácil. Crescimento mantido aproximadamente multiplicativo (~2× por degrau), que é o que faz
cada degrau ser um esticão que vale a pena.

- `nivel = 0` é o degrau inicial: tópico novo (4.2) e reset por "esqueci" (2.3) caem aqui.
- O topo (`nivel = 4`) estaciona em 24 dias. Um tópico que só toma "tranquilo" sobe até lá
  e para — o `nivel` **não passa** de `INTERVALOS.length − 1`. Tratar explicitamente no
  código para não ler fora do array.

*(Resolve "degraus concretos da escada". O comprimento/teto da escada continua sendo dial —
tabela 5.8.)*

### 5.4 `f` e `g` — os dois caminhos da dificuldade

```
f(d) = 1 + 0.6·(0.5 − d)     // difícil (d→1) → 0.7 : ENCURTA o intervalo → pressão sobe
g(d) = 1 + 0.6·(d − 0.5)     // difícil (d→1) → 1.3 : MULTIPLICA o score direto
```

Espelhadas em torno do neutro `d = 0.5` (ambas valem `1` no neutro). Faixa `[0.7, 1.3]`.

- `f` entra no **denominador** da pressão (via intervalo previsto, 5.5). Como é denominador,
  encolher (`f < 1`) *aumenta* a pressão — por isso `f` **desce** com a dificuldade.
- `g` **multiplica o score direto**. Por isso `g` **sobe** com a dificuldade.
- Alavanca combinada de um tópico maximamente difícil, a dias iguais: `g ÷ f = 1.3 ÷ 0.7 ≈
  1.86×`. É esse número composto que importa vigiar, não cada faixa isolada.

O dial `0.6` é **compartilhado** pelas duas funções, para manter a simetria. Subir aumenta
a mordida da dificuldade no ranking; a faixa abre proporcionalmente (`0.8` → `[0.6, 1.4]`,
alavanca `≈ 2.3×`).

> **Nota de orientação (bug silencioso):** `g` sobe com a dificuldade e `f` desce. Inverter
> as duas faz o tópico difícil *afundar* no ranking — o código roda perfeitamente e só
> produz a ordenação errada. Travar com teste: dois tópicos iguais, `d = 0.9` e `d = 0.1`,
> o difícil tem de sair com score maior.

*(Resolve "como a dificuldade estica/encurta o intervalo base" e "faixa de variação do
modificador".)*

### 5.5 Intervalo previsto e pressão de esquecimento

```
intervalo_previsto = base(nivel) × f(dificuldade)
pressão            = (dias desde ultimaVezVisto) ÷ intervalo_previsto
```

Ilimitada por construção (invariante 4.8). A divisão é de **ponto flutuante**, não inteira —
forçar `double` para não depender de promoção implícita de tipo.

### 5.6 `h` — multiplicador de prova (a rampa)

```
t = clamp( (12 − dias) / 12 , 0, 1 )
h(dias) = 1 + (C − 1)·t²

H = 12    // horizonte, em dias
C = 3     // teto — finitude é invariante (4.8); valor é dial
```

Decisões desta sessão:

- **Horizonte `H = 12` dias** — a prova só começa a pesar a 12 dias da data.
- **Rampa acelerada (`t²`)** — pesa pouco cedo e dispara perto da data. As duas pontas batem
  com a rampa linear (`1` na borda, `C` no dia); a aceleração só rebaixa o miolo da janela
  (ex.: a 6 dias, linear daria `2.0`, acelerada dá `1.5`). Isso dá mais folga para a matéria
  negligenciada reemergir cedo, reforçando de leve a proteção da 4.8.
- **Teto `C = 3`** — no dia da prova (`t = 1`), `h = C`. É o dial mais consequente do sistema:
  `C` alto → a prova domina forte perto da data, mas a matéria abandonada demora mais a
  voltar; `C` baixo → o inverso. Âncora de intuição: `C ≈` quantas "larguras de janela" de
  negligência o sistema tolera antes de forçar a matéria abandonada de volta.

O `clamp` faz dois trabalhos e elimina o ramo `dias ≥ 12`:

- **fora da janela** (`dias ≥ 12`): `t = 0` → `h = 1` (sem efeito);
- **pós-prova** (`dias < 0`): `t = 1` → `h = C`, sem estourar o teto (defende a invariante).

Matéria sem prova → `h = 1` (neutro; exige guard de `null` antes do cálculo de dias, senão
o caminho comum lança `NullPointerException`).

*(Resolve "horizonte e teto da rampa de prova". A semântica pós-prova permanece deferida —
6.3; o `clamp` é placeholder defensivo que segura em `C` sem violar a invariante, qualquer
que seja a decisão futura.)*

### 5.7 Montagem e notas de implementação

- **Multiplicação:** `score = pressão × g(dificuldade) × h(dias_até_prova)`. Confirmada
  multiplicativa (4.4).
- **Data de referência única:** `hoje` é passado de cima para todos os fatores (coerência
  com o recálculo diário, 4.9); nenhum fator chama `now()` por conta própria. Além de
  correto, torna cada cenário testável ("faltando 3 dias") sem mexer no relógio do sistema.
- **Vocabulário:** o fator de prova é **multiplicador**, não "pressão". "Pressão" fica
  reservada ao termo de esquecimento (a base). Misturar os nomes recria a colisão que a
  seção 3 desfez.
- **`dataProva` na `Materia`:** `topic.getDataProva()` passa a `topic.getMateria().getDataProva()`
  quando `Materia` existir (seção 1).
- **Tipos:** o cálculo inteiro é `double`; evitar literais `float` (`0.6f`, `12f`) e divisão
  inteira silenciosa.

### 5.8 Diais de calibração vs. valores fixos

| Parâmetro | Valor de partida | Natureza |
|---|---|---|
| Régua da dificuldade | `[0, 1]`, neutro `0.5` | fixo |
| `α` (EMA) | `0.12` | fixo (faixa 10–15%) |
| Alvos da EMA | `0 / 0.5 / 1`, simétrico | fixo |
| Escada `INTERVALOS` | `{1, 3, 6, 12, 24}` | **dial** (comprimento/teto) |
| Dial da dificuldade (o `0.6` em `f`/`g`) | `0.6` | **dial** |
| Horizonte da prova `H` | `12` dias | **dial** |
| Teto da prova `C` | `3` | **dial** (a finitude é invariante) |

Os três diais que ficam explicitamente como "decidir observando o uso": **o teto da escada**,
**o `0.6`** e **o `C`**. O resto pode ser cravado.

---

## 6. Em aberto

### 6.1 Interrompido na discussão

- **Trava por tópico.** Ainda em aberto. As opções eram: no máximo um bloco por tópico por
  dia; sem trava; ou um por dia mais espaçamento mínimo entre sessões. Contexto: com o ciclo
  vicioso já dissolvido pela seção 3, resta decidir se um tópico pode ocupar dois blocos no
  mesmo dia ou monopolizar dias consecutivos. Nota: o degrau inicial da escada é curto
  (`base(0) = 1`), então reaparecer no dia seguinte após "esqueci" é comportamento
  pretendido, não defeito.

### 6.2 Resolvido nesta versão

Todos os itens da antiga seção 5.2 foram fechados e migraram para a seção 5:

- Degraus concretos da escada → **5.3** (`{1, 3, 6, 12, 24}`).
- Taxa da média móvel da dificuldade → **5.2** (`α = 0.12`).
- Como a dificuldade estica/encurta o intervalo → **5.4** (`f`/`g`, dial `0.6`).
- Dificuldade inicial de um tópico sem histórico → **5.1** (`0.5`, régua `[0, 1]`).
- Se "esqueci" pesa mais que "com esforço" → **5.2** (não; `α` simétrico).
- Horizonte e teto da rampa de prova → **5.6** (`H = 12`, `C = 3`, rampa `t²`).
- Faixa dos multiplicadores → **5.4** e **5.6** (`f, g ∈ [0.7, 1.3]`; `h ∈ [1, C]`).

### 6.3 Não endereçado

- **Cobertura antes da prova.** A rampa faz os tópicos da matéria subirem, mas não garante
  que *todos* foram vistos antes da data. Um tópico "tranquilo" várias vezes sobe na escada e
  pode nunca voltar ao topo antes da prova. É requisito de regra separada (ex.: "todo tópico
  da matéria em prova precisa ter sido visto ao menos uma vez nos X dias antes da data"), não
  um ajuste de peso — ver a rejeição de "somar prova" na 4.4.
- **O que `h` faz após a data da prova passar.** A matéria volta ao normal? Fica no teto?
  Arquiva? Decisão semântica deferida; o `clamp` da 5.6 segura em `C` como placeholder sem
  violar a invariante.
- **Tópicos ou matérias concluídos/arquivados.** Não há noção de encerramento; hoje todo
  tópico acumula pressão para sempre.
- Banco de dados (Parte 2).
- Design da API (Parte 2) e do front-end (Parte 3).

---

## 7. Riscos remanescentes

| Risco | Status |
|---|---|
| Fragmentação excessiva (§8 conceitual) | **Resolvido** por construção — piso de 45 min |
| Ciclo vicioso do "esqueci" (§8 conceitual) | **Majoritariamente dissolvido** pela separação traço/estado; resta a trava de 6.1 |
| Matéria negligenciada durante prova de outra | **Mitigado** — teto `C = 3` fixado; a invariante 4.8 é honrada, convergência garantida |
| Timing da recuperação de matéria negligenciada | **Aceito e observável** — piso semanal é o plano B |
| Cadastro em lote com data incorreta | **Aceito** — reversível a baixo custo |
| Cobertura incompleta antes da prova | **Em aberto** — ver 6.3 |
| `f`/`g` invertidas (difícil afunda no ranking) | **Novo (implementação)** — travar com teste de ordenação por dificuldade (5.4) |
| `h` estoura o teto no pós-prova | **Mitigado** — `clamp` em `[0,1]` antes do `t²` (5.6) |