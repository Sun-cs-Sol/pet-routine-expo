# Relatório de decisão de plataforma — App de Rotina Pet

**Autor:** Danilo   **Data:** 18/09/2026

## 1. Recomendação

Para o app do tutor, recomendo a abordagem **cross-platform**
(nativo | cross-platform | web/PWA), usando React Native + Expo.

Com só 2 desenvolvedores, orçamento apertado (R$ 90 mil) e 3 meses de prazo, escrever o app duas vezes (um Android nativo e um iOS nativo) não parece viável. React Native deixa manter uma base só, em uma linguagem que a equipe já conhece, e ainda dá pra usar câmera, GPS, notificação e armazenamento offline via bibliotecas do próprio Expo.

## 2. Restrições que sustentam a escolha

| # | Restrição do enunciado | Como ela empurra para a minha escolha |
|---|---|---|
| 1 | "Equipe disponível: 2 desenvolvedores — ambos com TypeScript e React, nenhum com Kotlin ou Swift" | Não tem ninguém no time que sabe Kotlin ou Swift. Ir de nativo significaria aprender do zero (ou contratar gente nova), o que não cabe em 3 meses. Com React Native a equipe usa o que já sabe. |
| 2 | "Prazo: 3 meses até o piloto" | Fazer dois apps nativos em paralelo com só 2 pessoas em 3 meses é praticamente impossível. Uma base de código só pra Android e iOS reduz o trabalho pela metade. |
| 3 | "Tirar foto do pet e de documentos", "Capturar a localização GPS durante passeios", "Funcionar com conectividade instável — registrar offline e sincronizar depois", "Notificar o tutor sobre vacinas e consultas agendadas" | Todos esses recursos (câmera, GPS, notificação, armazenamento offline) já existem prontos como módulo do Expo, então não precisa escrever código nativo separado pra cada coisa. |

## 3. O que estamos perdendo

Abordagem rejeitada: **nativo** (Android/Kotlin + iOS/Swift)

Indo de nativo a gente teria mais controle sobre a plataforma: otimização de desempenho mais fina, melhor controle sobre o que roda em segundo plano e sobre o consumo de bateria/memória — o que importa bastante aqui, já que boa parte do público usa Android fraco. Também teria acesso mais rápido a recursos novos do sistema operacional assim que saem, sem esperar o React Native/Expo dar suporte. Só que isso custa tempo e dinheiro que o projeto não tem agora.

## 4. O painel das clínicas

Mesma tecnologia do app do tutor?  ( ) sim   (x) não

Justificativa:
O painel roda em desktop, na recepção, então não faz sentido usar React Native ali — é outro tipo de tela e outro tipo de uso. Vou de React Web + TypeScript. Não é a mesma tecnologia do app, mas dá pra aproveitar bastante coisa entre os dois projetos: os mesmos devs conseguem mexer nos dois, os tipos do domínio (Pet, EspeciePet, etc.) podem ser reaproveitados, as regras de negócio ficam parecidas e a comunicação com a API é a mesma. React Web e React Native não compartilham componente de tela, mas compartilham conhecimento e boa parte da lógica.

## 5. Risco técnico e mitigação

| | |
|---|---|
| **Risco concreto** | O app ficar lento ou travar em celular Android fraco, principalmente nas partes que mexem com foto, GPS e sincronização offline. |
| **Por que ele é plausível aqui** | 65% do público usa Android de entrada com menos de 4GB de RAM. Foto em alta resolução, GPS ligado durante o passeio inteiro e uma fila de dados esperando pra sincronizar consomem bastante memória — justamente o que esses aparelhos não têm sobrando. |
| **Como eu mitigaria** | Testar cedo em aparelho Android fraco de verdade (não só emulador), comprimir as fotos antes de guardar/enviar, não deixar processo rodando à toa em segundo plano, limpar dados já sincronizados do armazenamento local, mandar a sincronização em fila (aos poucos, não tudo de uma vez) e ficar de olho no consumo de memória durante os testes. |

## 6. A pergunta que eu faria ao cliente

Algo que o enunciado NÃO informa e que poderia mudar minha resposta:

O GPS precisa continuar funcionando com o app em segundo plano e a tela do celular bloqueada, durante o passeio inteiro?

Se a resposta fosse **sim**, eu reconsideraria a abordagem, porque rastreamento contínuo em segundo plano é um ponto fraco conhecido do React Native/Expo — o próprio sistema (principalmente Android) tende a suspender o app pra economizar bateria. Nesse caso talvez fosse necessário usar algum módulo nativo específico pra isso, o que mexeria no prazo e no orçamento que já estão apertados.
