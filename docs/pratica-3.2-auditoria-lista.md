# Auditoria de lista — TelaPets

## 1. Problemas encontrados

| # | Trecho | Problema | Sintoma para o usuário | Correção |
|---|---|---|---|---|
| 1 | `<ScrollView>` em volta da `<FlatList>` | Lista virtualizada dentro de uma ScrollView na mesma direção. A FlatList recebe altura infinita e desenha todos os itens. | Com 4 000 pets a tela demora vários segundos para abrir, a rolagem engasga e em aparelho mais fraco o app fecha por falta de memória. | Tirar a ScrollView. Título vai para `ListHeaderComponent`, total vai para `ListFooterComponent`, `style={styles.tela}` passa para a própria FlatList. |
| 2 | `alvo.statusPasseio = 'concluido'; setPets(pets);` | Mutação do objeto e `setPets` com o mesmo array. O React compara a referência, vê que é igual e não renderiza de novo. | Toca em "registrar passeio" e nada muda. O status só aparece depois, quando outra coisa força a tela a renderizar (por exemplo, digitar na busca). É o "às vezes não atualiza". | `setPets(atual => atual.map(p => p.id === id ? { ...p, statusPasseio: 'concluido' } : p))`. |
| 3 | `ListHeaderComponent={() => (<TextInput .../>)}` | Função inline como componente. A cada render é um componente "novo", então o React desmonta e monta o TextInput de novo. | Cada letra digitada na busca fecha o teclado (o campo perde o foco). Na prática não dá para buscar. | Passar um elemento (`ListHeaderComponent={<TextInput .../>}`) ou um componente declarado fora da tela. |
| 4 | `keyExtractor={(item, index) => index.toString()}` | Chave pelo índice. Quando a busca filtra, o item da posição 0 passa a ser outro pet com a mesma chave. | Depois de buscar, linhas mostram por um instante o conteúdo do pet anterior, e qualquer estado interno da linha (foco, animação, imagem) fica no pet errado. A lista também refaz mais linhas do que precisa. | `keyExtractor={(item) => item.id}`. |
| 5 | `p.nome.includes(busca)` | Busca diferencia maiúscula de minúscula e não ignora espaço. | Digitar "rex" não encontra "Rex". "Rex " com espaço no fim também não. O usuário acha que o pet sumiu. | `p.nome.toLowerCase().includes(busca.trim().toLowerCase())`. |
| 6 | Nenhum `ListEmptyComponent` | Lista sem estado vazio. | Busca sem resultado deixa a tela em branco embaixo do campo. Não dá para saber se não achou, se travou ou se ainda está carregando. | `ListEmptyComponent` com mensagem que cita o termo buscado, diferente da mensagem de lista vazia de verdade. |
| 7 | `<Text onPress={...}>registrar passeio</Text>` | Ação num Text: área de toque só do tamanho das letras, sem feedback de toque e sem papel de botão para o leitor de tela. | Toque perto do texto não pega, o usuário toca e não sabe se funcionou, e o TalkBack/VoiceOver lê como texto comum. | `Pressable` com `style={({ pressed }) => ...}`, `accessibilityRole="button"` e `hitSlop`. |
| 8 | `initialNumToRender={100}` | Desenha 100 itens antes de mostrar a tela, contra 10 do padrão. | A tela demora mais para aparecer pela primeira vez, mesmo só cabendo uns 8 itens. | Voltar ao padrão (tirar a prop). |
| 9 | `windowSize={50}` | Mantém montadas 50 "telas" de itens (25 acima e 25 abaixo), contra 21 do padrão. | Mais memória e rolagem mais pesada. Com 4 000 itens contribui para o app ser fechado pelo sistema. | Voltar ao padrão (tirar a prop). |
| 10 | `removeClippedSubviews={true}` | Força o desligamento de views fora da tela, inclusive no iOS, onde o padrão é `false` e há relatos de conteúdo sumindo. | Itens que aparecem em branco ao rolar rápido ou ao voltar para cima. | Tirar a prop e só religar se uma medição mostrar ganho. |
| 11 | `function registrar(id)` | Parâmetro sem tipo. Com `strict` ligado é `any` implícito e o projeto não compila. | O app não sobe no build com checagem de tipo; sem `strict`, um id errado passa sem aviso e o toque não registra nada. | `function registrar(id: string)`. |

## 2. O problema arquitetural

É o problema 1: a FlatList dentro da ScrollView. A FlatList só é leve porque desenha os itens que cabem na tela e vai trocando conforme o usuário rola, ou seja, é virtualizada. Para isso ela precisa saber a própria altura. Dentro de uma ScrollView vertical ela não tem limite de altura, então "tudo cabe na tela" e ela desenha os 4 000 itens de uma vez. A virtualização deixa de existir e a FlatList vira uma ScrollView com um `.map()`, só que mais cara. O próprio React Native avisa no console ("VirtualizedLists should never be nested inside plain ScrollViews with the same orientation").

Ele é mais grave que os outros juntos porque nenhuma outra correção resolve o travamento enquanto ele existir. Mexer em `windowSize`, `initialNumToRender` ou nas chaves não muda nada se a lista inteira já está montada. E a correção não é trocar uma linha: o título e o rodapé estavam na ScrollView justamente para "rolar junto", e precisam ir para `ListHeaderComponent` e `ListFooterComponent`.

## 3. Os três ajustes de desempenho deste arquivo

- **`removeClippedSubviews={true}`**: o padrão é `true` só no Android e `false` no iOS. Forçar no iOS pode fazer itens sumirem ao rolar. Não resolve nada aqui, porque com a ScrollView em volta nenhum item fica "fora da janela" da lista.
- **`windowSize={50}`**: o padrão é 21 (a tela visível mais 10 telas para cada lado). Com 50 a lista mantém mais que o dobro de itens montados, o que gasta memória, que é exatamente o que falta. Também não resolve, porque a ScrollView já desliga a janela.
- **`initialNumToRender={100}`**: o padrão é 10. Com 100 a primeira renderização faz dez vezes mais trabalho antes de mostrar qualquer coisa. Atrapalha o tempo de abertura, que é a reclamação.

Os três foram mexidos sem medir: nenhum vem com comentário, número de antes e depois ou print do profiler. Parece tentativa de consertar o travamento no chute, mexendo nos botões de desempenho, quando a causa era a estrutura (problema 1). A recomendação é voltar aos padrões e só ajustar depois de medir com a lista já corrigida.

## 4. O bug de "às vezes não atualiza"

A FlatList é um **PureComponent**: ela só renderiza de novo se alguma prop mudar numa comparação rasa (por referência). O `registrar` muda o campo dentro do objeto e chama `setPets(pets)` com o mesmo array. Para o React o estado não mudou (mesma referência), então ele nem renderiza a tela. E mesmo que renderizasse, a FlatList recebe o mesmo `data` e não refaz os itens. Por isso "às vezes": a mudança só aparece quando outra coisa provoca um render e cria um `visiveis` novo, como digitar na busca.

Correções possíveis:
1. Atualizar de forma imutável: `setPets(atual => atual.map(p => p.id === id ? { ...p, statusPasseio: 'concluido' } : p))`. Array novo e objeto novo, então o React e a FlatList percebem a mudança.
2. Passar `extraData` para a FlatList com algo que muda a cada registro.

Escolho a 1. A 2 só força a lista a desenhar de novo e continua mutando o estado, então o bug volta em qualquer outro lugar que dependa da referência (um `useMemo`, um componente filho com `memo`).

## 5. Ordem de refatoração — tenho meio dia

| Ordem | O que faço | Risco se não fizer | Retorno |
|---|---|---|---|
| 1 | Tirar a ScrollView; título e total viram header e footer da FlatList | O app continua travando e fechando com 4 000 itens, que é a reclamação principal | Alto: devolve a virtualização, resolve o travamento de uma vez |
| 2 | `registrar` imutável | Usuário registra e não vê; pode registrar duas vezes ou desistir do app | Alto, e é uma mudança de 3 linhas |
| 3 | `ListHeaderComponent` como elemento | Busca inutilizável (teclado fecha a cada letra) | Alto, mudança de 1 linha |
| 4 | Voltar `windowSize`, `initialNumToRender` e `removeClippedSubviews` ao padrão | Abertura lenta e memória alta mesmo depois de corrigir a estrutura | Médio, só apagar linhas |
| 5 | `keyExtractor` pelo `id` | Linhas trocadas depois de buscar | Médio, 1 linha |
| 6 | Busca sem diferenciar maiúsculas + `ListEmptyComponent` | Usuário acha que o pet sumiu; tela em branco sem explicação | Médio |
| 7 | Trocar o `Text onPress` por `Pressable` com acessibilidade | Toques perdidos e app inacessível para leitor de tela | Médio, mexe no layout do item |
| 8 | Tipar `registrar(id: string)` | Build quebra com `strict` | Baixo para o usuário, mas é rápido |

Comecei pelo que trava o app e pelo que faz o usuário achar que a ação não funcionou, porque são os dois sintomas que o time relatou. Depois vêm as correções de uma linha com bom retorno, e por último as que mexem em layout.

## 6. O que eu decidi NÃO corrigir

Não vou colocar `useMemo` no `pets.filter(...)` agora. Filtrar 4 000 nomes leva poucos milissegundos, e o que trava a tela é a ScrollView, não o filtro. Depois de corrigir a estrutura, se o profiler mostrar que o filtro pesa a cada tecla, aí sim vale memoizar. Fazer antes seria repetir o erro dos três ajustes de desempenho: otimizar sem medir.
