# Relatório de decisão de plataforma — App de Rotina Pet

**Autor:** Danilo   **Data:** 18/09/2026

## 1. Recomendação

Para o app do tutor, recomendo a abordagem **cross-platform**
(nativo | cross-platform | web/PWA), usando React Native com Expo.

A escolha se apoia diretamente nas restrições do projeto: uma equipe pequena que já domina TypeScript e React, um prazo curto para o piloto e um orçamento limitado. React Native com Expo permite manter uma única base de código para Android e iOS, reaproveitar o conhecimento que a equipe já tem e ainda acessar, via módulos do próprio Expo, os recursos de hardware exigidos (câmera, GPS, notificações), sem exigir conhecimento de Kotlin ou Swift.

## 2. Restrições que sustentam a escolha

Cite TRÊS restrições do enunciado, textualmente. Não argumente em abstrato.

| # | Restrição do enunciado | Como ela empurra para a minha escolha |
|---|---|---|
| 1 | "Equipe disponível: 2 desenvolvedores — ambos com TypeScript e React, nenhum com Kotlin ou Swift" | Com apenas dois desenvolvedores e nenhuma experiência em Kotlin/Swift, contratar ou treinar uma equipe nativa (Android + iOS) consumiria tempo e orçamento que o projeto não tem. React Native reaproveita exatamente o TypeScript e o React que a equipe já domina, eliminando a curva de aprendizado de duas linguagens/plataformas novas. |
| 2 | "Prazo: 3 meses até o piloto" | Um app nativo exigiria manter dois projetos separados (Android e iOS), dobrando o esforço de desenvolvimento, testes e correção de bugs dentro do mesmo prazo. Uma base de código compartilhada entre as duas plataformas é o que torna viável entregar um piloto funcional em 3 meses com apenas 2 desenvolvedores. |
| 3 | "Tirar foto do pet e de documentos", "Capturar a localização GPS durante passeios", "Funcionar com conectividade instável — registrar offline e sincronizar depois", "Notificar o tutor sobre vacinas e consultas agendadas" | Câmera, GPS, armazenamento local e notificações push são recursos já cobertos por módulos maduros do ecossistema Expo/React Native (`expo-camera`, `expo-location`, armazenamento local para fila offline, `expo-notifications`), então não é necessário escrever código nativo específico para cada plataforma para atender esses requisitos. |

## 3. O que estamos perdendo

Abordagem rejeitada: **nativo** (Android/Kotlin + iOS/Swift)

O que a organização deixa de ganhar ao não escolhê-la:
Desenvolvimento nativo teria mais controle sobre APIs específicas de cada plataforma, otimizações finas de desempenho, execução em background e consumo de recursos (memória, bateria) — pontos sensíveis justamente no público de Android de entrada com menos de 4 GB de RAM. Também permitiria acesso mais direto e imediato a novas APIs do sistema operacional assim que são lançadas, sem depender do tempo de atualização das bibliotecas do React Native/Expo.

(Toda decisão tem custo. Uma resposta que não nomeia nenhum custo
está escondendo o custo, não eliminando-o.)

## 4. O painel das clínicas

Mesma tecnologia do app do tutor?  ( ) sim   (x) não

Justificativa:
O painel é usado em desktop na recepção das clínicas, um contexto de uso completamente diferente do app móvel do tutor (tela grande, mouse/teclado, uso fixo em um balcão). Para essa interface recomendo React Web + TypeScript, que não é a mesma tecnologia do app (React Native), mas é próxima o bastante para compartilhar conhecimento entre as duas frentes: os mesmos desenvolvedores conseguem trabalhar nos dois projetos, os tipos TypeScript do domínio (`Pet`, `EspeciePet`, `StatusPasseio` etc.) podem ser reaproveitados, as regras de negócio equivalentes podem ser reescritas com a mesma lógica, e a comunicação com a API do backend segue o mesmo contrato nos dois lados. React Web e React Native continuam sendo aplicações diferentes — não há reaproveitamento de componentes de UI entre elas —, mas o ganho de produtividade em conhecimento, tipos e regras de negócio compartilhados ainda existe.

## 5. Risco técnico e mitigação

| | |
|---|---|
| **Risco concreto** | Desempenho ruim em celulares Android de entrada, especialmente em telas ou operações que envolvem fotos, GPS, armazenamento offline e sincronização de dados. |
| **Por que ele é plausível aqui** | 65% do público-alvo usa aparelhos Android de entrada com menos de 4 GB de RAM. Fotos de alta resolução, leitura contínua de GPS durante o passeio e uma fila de dados offline aguardando sincronização são operações que consomem memória e processamento — exatamente os recursos mais escassos nesses aparelhos. Sem cuidado, o app pode travar, fechar sozinho ou drenar bateria rapidamente para a maior parte do público. |
| **Como eu mitigaria** | Testar o app desde as primeiras semanas em aparelhos Android de entrada reais (não só em emulador ou em aparelhos topo de linha); comprimir e redimensionar imagens antes de enviar ou armazenar; evitar processamento desnecessário em segundo plano; controlar com cuidado o que fica salvo localmente (limpando dados antigos já sincronizados); implementar uma fila de sincronização que envia os dados aos poucos, sem sobrecarregar o aparelho; e monitorar consumo de memória durante os testes para detectar regressões cedo. |

## 6. A pergunta que eu faria ao cliente

Algo que o enunciado NÃO informa e que poderia mudar minha resposta:

O rastreamento GPS precisa continuar funcionando por longos períodos com o aplicativo em segundo plano e com a tela do celular bloqueada?

Se a resposta fosse **sim, o GPS precisa rodar de forma contínua e confiável em segundo plano durante todo o passeio**, eu mudaria minha recomendação para **uma arquitetura híbrida, com módulos nativos específicos para rastreamento em background** (ou reavaliaria a viabilidade de nativo puro), porque rastreamento em background é historicamente um dos pontos mais frágeis do React Native/Expo — o sistema operacional (principalmente Android, em fabricantes que agem agressivamente para economizar bateria) pode suspender a aplicação, e garantir um rastreamento confiável nesse cenário normalmente exige código nativo dedicado ou bibliotecas especializadas, o que impactaria diretamente o orçamento e o prazo já apertados do projeto.
