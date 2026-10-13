# Auditoria — TelaPasseio

**Autoria:** Ana Sofia

## 1. Problemas de permissão

| # | Sintoma para o usuário | Causa no código | Correção |
|---|---|---|---|
| 1 | Quem toca em "Não permitir" fica com um botão que não faz nada: nenhuma mensagem, nenhum novo pedido, mesmo depois de tocar várias vezes. | O resultado de `requestForegroundPermissionsAsync()` é ignorado. O código segue para `getCurrentPositionAsync`, que lança erro sem permissão, e não há `try/catch`. A promise rejeita em silêncio. | Ler `{ status, canAskAgain }` da resposta e parar com mensagem própria quando `status !== 'granted'`, com `try/catch` em volta das leituras. |
| 2 | Quem negou uma vez e depois quer liberar nunca mais vê o pedido de permissão enquanto o app estiver aberto. | `jaPediuPermissao` é uma variável de módulo: vale para o processo inteiro e diz "já pedi", não "fui autorizado". | Tirar a flag. A cada toque, consultar `getForegroundPermissionsAsync()` e só pedir de novo se `canAskAgain` for `true`. |
| 3 | Quem bloqueou a permissão (ou está com a localização do celular desligada) não recebe nenhuma orientação de onde resolver. | Não há distinção entre negada (`canAskAgain: true`), bloqueada (`canAskAgain: false`) e serviço desligado (`hasServicesEnabledAsync()`). | Três mensagens diferentes: "toque para tentar de novo", "libere em Configurações" (com `Linking.openSettings()`) e "ative a localização do celular". |
| 4 | A mensagem "Erro ao obter localização" nunca aparece, nem quando dá erro. | `getCurrentPositionAsync` nunca devolve `null`: ou devolve a posição ou lança exceção. O `if (!posicao)` não é alcançável, e ainda está depois do `watch` e do acelerômetro. | Tratar o erro no `catch`, logo depois da leitura, antes de abrir qualquer assinatura. |
| 5 | Sem internet, o passeio para de ganhar registros na lista e nenhuma mensagem explica o porquê. | `reverseGeocodeAsync` sem `try/catch` dentro do callback do `watch`. Quando o geocoder falha, o callback rejeita antes do `setRegistros`, e o `setErro('')` logo acima ainda apaga qualquer aviso que existisse. | `try/catch` só em volta do geocoder, usando "sem rua" quando falhar, para o registro entrar mesmo assim. |

## 2. Vazamentos

Ficam duas torneiras abertas, e nenhuma tem `remove()`:

- **`watchPositionAsync`**: a função devolve uma `LocationSubscription`, mas o retorno é descartado (`await` sem guardar). Não existe botão nem código que encerre o acompanhamento.
- **`Accelerometer.addListener`**: o retorno (a assinatura) também é descartado.

Cada toque em "Iniciar passeio" abre um par novo. Com **cinco toques ficam 5 assinaturas de GPS e 5 de acelerômetro** rodando ao mesmo tempo. O usuário vê cada atualização de posição virar 5 registros iguais na lista e cada movimento contar 5 passos. As assinaturas continuam vivas mesmo depois de sair da tela: o GPS fica ligado (ícone de localização sempre aceso, bateria descendo) e o `setRegistros` continua sendo chamado. A lista `registros` cresce sem limite, com uma imagem por item, então a memória só sobe até o sistema fechar o app.

Correção: guardar as duas assinaturas, não abrir de novo se já estiverem abertas e ter um botão "Encerrar passeio" que chame `remove()` nas duas. O encerramento automático ao sair da tela fica para quando houver `useEffect` (Aula 6).

## 3. Consumo de bateria

1. **`getCurrentPositionAsync` com `BestForNavigation`**: é o nível pensado para navegação, que combina outros sensores e mantém o GPS no máximo. Para marcar onde o passeio começou, `High` (~10 m) ou até `Balanced` (~100 m) bastam e respondem mais rápido.
2. **`watchPositionAsync` com `Highest` e sem `distanceInterval`/`timeInterval`**: o GPS entrega posição o mais rápido que conseguir, mesmo com a pessoa parada. Eu usaria `Balanced` ou `High` com `distanceInterval` de uns 10 a 20 m, que é a escala que interessa num passeio.
3. **`Accelerometer.setUpdateInterval(16)`**: são cerca de 60 leituras por segundo, cada uma com um `setPassos` que pode causar render. Para passos não é preciso ler o acelerômetro bruto (ver seção 4). Se precisasse, 100 ms (10 Hz) já seria muito mais do que um passo humano exige.

Junto disso, o `reverseGeocodeAsync` roda a cada atualização de posição, e isso no aparelho usa o serviço de geocodificação do sistema, que normalmente vai à rede. No iOS ele tem limite de chamadas e começa a falhar. Basta fazer uma vez no fim do passeio, ou só quando a posição mudar bastante.

## 4. O uso errado de sensor

O acelerômetro está sendo usado como **contador de passos**: `if (x > 1.5) setPassos(n => n + 1)`. Não funciona por três motivos:

- **Eixo errado**: `x` é o eixo lateral do celular. O valor depende de como o aparelho está no bolso ou na mão, então a mesma caminhada conta passos num jeito de segurar e não conta no outro.
- **Conta amostras, não passos**: a 60 Hz, um único movimento brusco fica vários quadros acima de 1.5 e soma vários "passos". Sacudir o celular parado também conta.
- **Sem filtro de gravidade**: o acelerômetro mede a gravidade junto. Com o celular de lado, o `x` fica perto de 1 g o tempo todo.

O que o autor queria era o **`Pedometer`** do próprio `expo-sensors` (`Pedometer.watchStepCount`), que usa o contador de passos do sistema. Ele já está calibrado, gasta muito menos bateria porque roda num chip de baixo consumo, e entrega passos de verdade. Exige checar `Pedometer.isAvailableAsync()` e pedir permissão de atividade física. A assinatura dele também precisa de `remove()`.

## 5. Os defeitos de imagem

1. **A foto não é do passeio e depende de internet.** `https://picsum.photos/seed/passeio/600/400` é a mesma URL para todos os registros, então todo item mostra a mesma foto aleatória, que não tem relação com o lugar. Sem internet o card mostra um retângulo vazio, sem aviso. Ainda baixa 600×400 para exibir numa faixa de 140 px de altura. Se a ideia é uma foto do passeio, ela tem que vir da câmera (`takePictureAsync`) e ser exibida pelo `uri` local.
2. **`Image` do `react-native` com `resizeMode`.** Para uma lista que recicla linhas, o `Image` do `react-native` não tem cache configurável nem `recyclingKey`, e ao rolar uma linha pode mostrar a foto do item anterior até a nova carregar. O correto é o `Image` do `expo-image` com `contentFit="cover"` explícito, `recyclingKey={item.id}` e um placeholder enquanto carrega.

Também na exibição: a coordenada aparece crua (`-8.063123456789012, ...`), sem casas decimais limitadas e sem a precisão. Para o usuário isso não é informação. Melhor `-8.0631, -34.8711 (±12 m)`.

## 6. Ordem de correção — tenho meio dia

1. **Fechar as torneiras**: guardar as assinaturas, não abrir em dobro e criar o botão "Encerrar passeio" com `remove()`. É o que mais prejudica o usuário (bateria, registros duplicados, app fechando por memória) e são poucas linhas.
2. **Tratar o resultado da permissão e os erros** (problemas 1, 2 e 4): hoje quem nega fica com um app que "não funciona". `try/catch` e checagem de `status` resolvem e são rápidos.
3. **Mensagens distintas para negada, bloqueada e GPS desligado** (problema 3): com o item 2 pronto, é só separar as mensagens e adicionar o botão para as configurações.
4. **Reduzir a precisão e colocar `distanceInterval`** no `watch`: troca de dois parâmetros, ganho grande de bateria.
5. **Geocodificar uma vez só, com `try/catch`**: tira chamadas repetidas e um ponto de falha.
6. **Trocar o acelerômetro pelo `Pedometer`**: o contador hoje mostra número errado, mas não quebra nada. Pede permissão nova e teste em aparelho, então fica depois.
7. **Imagens**: tirar a URL do picsum (ou trocar pela foto da câmera) e passar para o `expo-image`. Hoje é só visual e depende de decisão de produto sobre ter foto.

O critério foi impacto no usuário por hora de trabalho: primeiro o que drena bateria e trava, depois o que deixa o usuário sem saída, e por último o que só mostra informação errada.

## 7. O que eu decidi NÃO corrigir

**O `id: String(antigos.length)`.** Como ele é calculado dentro do `setRegistros` com função, cada registro novo pega o tamanho atual da lista e os ids saem 0, 1, 2... sem repetir. Hoje não existe remoção de registro, então não há colisão, e mexer agora não muda nada para o usuário. Fica anotado: no dia em que der para apagar um registro, o id passa a repetir (apagar o 1 e criar outro gera um segundo "2") e tem que virar algo como o `timestamp` da posição.

**Localização em segundo plano.** Seria natural querer o passeio rastreado com a tela bloqueada, mas isso exige `requestBackgroundPermissionsAsync`, configuração nativa e justificativa nas lojas. Não é correção de defeito, é funcionalidade nova, e não cabe na manutenção de meio dia.
