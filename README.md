# Pet Routine Expo

**Disciplina:** Desenvolvimento Mobile (2026.2.DM) — CESAR School
**Branch:** `feature/ads025_2026-2`
**Autoria da Prática 3:** Ana Sofia

## Sobre o projeto

App de Gestão e Rotina Pet: um aplicativo para tutores de animais de estimação organizarem a rotina, passeios e histórico de saúde dos pets.

Este projeto é usado nas atividades guiadas e aplicadas da disciplina ao longo do semestre. Cada aula adiciona uma camada nova por cima da anterior — o histórico de commits desta branch é, em si, um registro do progresso.

## Estado atual (Aula 1)

Scaffold inicial gerado com Expo (`create-expo-app`, template `blank-typescript`). Nenhuma tela ou modelagem de domínio foi implementada ainda — isso é propositalmente deixado para as próximas aulas. Veja os comentários `TODO` em `App.tsx`.

## Como rodar

```bash
npm install
npx expo start
```

Abra o app **Expo Go** no celular e escaneie o QR code (ou use um emulador). Requisito: **Node.js 22.11+**.

## Práticas da Aula 1

Os esqueletos das práticas de `PRATICA.md` já estão no repositório. Cada `TODO Px.y` no código corresponde a um item do enunciado — resolva na ordem.

| Prática | Arquivo | Escopo |
|---|---|---|
| 1 — Modelagem do domínio Pet | `src/types/pet.ts` | TypeScript puro |
| 2 — Serviço mockado | `src/services/petService.ts` | TypeScript puro |
| 2 — Estado de tela | `src/tela-pet.ts` | TypeScript puro |
| 3 — Relatório de plataforma | `docs/pratica-03-relatorio-plataforma.md` | Texto |
| 4 — Material desatualizado *(bônus)* | `docs/pratica-04-material-desatualizado.md` | Texto |

As Práticas 1 e 2 **não precisam de React Native nem do Expo** — são verificáveis só com o compilador:

```bash
npm run typecheck        # equivale a `npx tsc --noEmit`
npm run pratica:tela     # roda src/tela-pet.ts via tsx
```

> ⚠️ **O `typecheck` falha de propósito enquanto os TODOs não estiverem resolvidos.** Cada erro reportado aponta para um `TODO` que ainda falta preencher — é esse o critério de pronto. Alguns blocos marcados como *verificação* precisam **falhar** ao serem descomentados; não os apague.

## Próximos passos (exercícios)

Os `TODO` deixados no código apontam para os exercícios de `exercises.md` de cada aula. Resolva-os na ordem em que aparecem e mantenha um commit por exercício (ou por bloco), para que o histórico da branch sirva de evidência de progresso.

## Decisões de Projeto (Prática 2)

- **Decisão de modelagem**: Optamos por utilizar a prop condicional `destacado?: boolean` no componente `Card` no lugar de criar componentes separados. Como o destaque do cartão reflete mudanças mínimas de interface (bordas diferentes), o uso de um booleano mantém o componente genérico e de simples utilização.
- **Decisão de organização de estilo**: As cores, os espaçamentos principais e as propriedades fixas de tipografia viraram tokens no `theme.ts` visando assegurar a consistência visual geral da aplicação. Já atributos de disposição e estruturais (como `flexDirection`, alinhamentos e variações focadas da margem interna) ficaram como estilos locais nos componentes, já que refletem a necessidade espacial e estrutural local de cada exibição.

## Decisões da Prática 3

**Critério de agrupamento: status do passeio.** Quem abre o app quer saber primeiro quem ainda não passeou hoje. Por isso as seções são Pendente, Concluído e Cancelado, nessa ordem: pendente é o que pede ação, cancelado é o caso mais raro e fica por último. A ordem está fixa em `ORDEM_STATUS` (`src/lib/agrupar.ts`), não depende da ordem do array.

**Por que `SectionList` e não `FlatList`.** Os dados têm grupos com título, e a `SectionList` já sabe desenhar o cabeçalho de cada grupo, inclusive fixo no topo enquanto rola (`stickySectionHeadersEnabled`). Com `FlatList` a gente teria que misturar "itens que são cabeçalho" com "itens que são pet" no mesmo array e decidir no `renderItem` o que desenhar, o que deixa o tipo do item confuso e a contagem errada. A virtualização é a mesma nas duas.

**Onde os dados são agrupados, e por que não no JSX.** Em `src/lib/agrupar.ts`, com duas funções puras: `filtrarPorNome` e `agrupar`. A tela só chama `agrupar(filtrarPorNome(pets, busca))`. Fora do JSX elas podem ser testadas sem abrir o app (rodamos com `tsx` para conferir as seções e a busca), e o componente fica só com o desenho. A ordem é filtrar e depois agrupar: assim uma seção que fica sem nenhum pet depois da busca é descartada pelo próprio `agrupar`, e se nada casa o resultado é `[]`, o que faz a lista mostrar o `ListEmptyComponent` com a mensagem da busca.

**`Accuracy.High`.** A localização é lida uma vez só, quando o usuário toca em "Obter localização". `High` dá algo em torno de 10 m, suficiente para saber em que rua ou praça foi o passeio. `Balanced` (~100 m) às vezes coloca o ponto no quarteirão errado. `Highest` e `BestForNavigation` servem para quem acompanha a posição o tempo todo (navegação) e mantêm o GPS trabalhando mais, o que gasta bateria sem ganho para um registro pontual. Como é uma leitura só, o custo de bateria do `High` é pequeno.

**`contentFit="cover"`.** A miniatura do card e a prévia têm largura total e altura fixa. `cover` preenche esse espaço e corta a sobra; `contain` deixaria faixas vazias quando a foto está em pé e cada card ficaria com cara diferente.

**`hitSlop` e `unstable_pressDelay` no item.** O `hitSlop` vertical é metade do `gap` entre os cards, então tocar no espaço entre dois cards acerta o mais próximo sem as áreas se sobreporem. O `unstable_pressDelay` de 100 ms evita que o card pisque como tocado quando o dedo só está começando a rolar a lista.

**Falhas tratadas na tela de registro.** São cinco mensagens diferentes (tipo `Falha` em `tela-registro.tsx`): localização negada (`canAskAgain: true`, o botão pede de novo), localização bloqueada (`canAskAgain: false`, mostra botão para abrir as configurações), localização do celular desligada, câmera negada e GPS ou câmera indisponível (erro na leitura, `onMountError` da câmera ou falha ao tirar a foto). Em todos os casos o botão Salvar continua funcionando.

**Limitações assumidas.**
- A localização é lida com `getCurrentPositionAsync`, uma vez. Não usamos `watchPositionAsync` nem `addListener`, justamente porque sem `useEffect` não temos como encerrar a assinatura quando o usuário sai da tela. Se o registro passar a acompanhar o passeio inteiro, essa assinatura não seria encerrada ao sair da tela, porque a ferramenta para isso é assunto da Aula 6.
- A foto fica no cache do app (o `uri` que o `takePictureAsync` devolve). Não salvamos na galeria e ela pode sumir se o sistema limpar o cache. Como tudo vive em `useState`, os pets, fotos e locais também voltam ao mock quando o app é reaberto ou quando a lista é puxada para recarregar.
- O pet com foto no mock usa uma imagem pequena embutida como data URI, para não depender de rede.
- Câmera, GPS e permissões precisam de aparelho físico para serem testados de verdade.
