// ============================================================
// Prática 2 — Estado de tela (arquivo 2 de 2)
// Leia o enunciado completo em `PRATICA.md` › "Prática 2".
//
// A lógica da tela, ainda sem tela. Componentes chegam na Aula 2 —
// aqui é TypeScript puro, verificável por `tsc`.
// ============================================================

// ------------------------------------------------------------
// TODO P2.9 — "O que entregar": responda as três perguntas abaixo,
//   uma linha cada, antes de entregar.
//
//   1. Qual estado impossível a união discriminada torna não representável?
//      R: Não dá pra ter um estado "carregando" com dados ou mensagem de
//      erro junto, porque cada variante só tem os campos dela mesma.
//   2. Por que `carregar()` captura a exceção em vez de deixá-la subir?
//      R: Porque buscarPetDoUsuario pode lançar erro (SIMULAR_ERRO) e eu
//      não quero que isso quebre quem chamou a função, então transformo
//      em EstadoTela erro e sigo o fluxo normal.
//   3. Uma decisão de modelagem que você tomou na Prática 1 e o motivo.
//      R: Botei criadoEm como string na Prática 1 porque API não manda
//      Date, manda string ISO mesmo, tipo "2026-01-15T12:00:00.000Z".
// ------------------------------------------------------------

import type { Pet } from './types/pet';
import { rotuloEspecie, rotuloStatusPasseio } from './types/pet';
import { buscarPetDoUsuario } from './services/petService';

// ============================================================
// TODO P2.6 — união discriminada pelo campo `tipo`, três variantes:
//   'carregando'  → nenhum outro campo
//   'sucesso'     → dados: T
//   'erro'        → mensagem: string
// ============================================================
export type EstadoTela<T> =
  | { tipo: 'carregando' }
  | { tipo: 'sucesso'; dados: T }
  | { tipo: 'erro'; mensagem: string };

// ============================================================
// TODO P2.7 — devolva o texto que a tela mostraria em cada estado.
//   Use SOMENTE os campos que existem em cada variante.
//   Não escreva `default`.
//     carregando → 'Carregando…'
//     sucesso    → `${nome} · ${especie legível} · ${status legível}`
//     erro       → `Erro: ${mensagem}`
// ============================================================
export function descreverTela(estado: EstadoTela<Pet>): string {
  switch (estado.tipo) {
    case 'carregando':
      return 'Carregando…';
    case 'sucesso':
      return `${estado.dados.nome} · ${rotuloEspecie(estado.dados.especie)} · ${rotuloStatusPasseio(estado.dados.statusPasseio)}`;
    case 'erro':
      return `Erro: ${estado.mensagem}`;
  }
}

// ============================================================
// TODO P2.8 — carregue o pet e devolva o EstadoTela resultante.
//   Sucesso → { tipo: 'sucesso', dados }
//   Falha   → { tipo: 'erro', mensagem }  (nunca deixe a exceção escapar)
//   Lembre: em TypeScript o `catch` recebe `unknown`, não `Error`.
// ============================================================
export async function carregar(): Promise<EstadoTela<Pet>> {
  try {
    const dados = await buscarPetDoUsuario();
    return { tipo: 'sucesso', dados };
  } catch (erro: unknown) {
    const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido.';
    return { tipo: 'erro', mensagem };
  }
}

// ============================================================
// VERIFICAÇÃO — não apague
// ============================================================
declare const petExemplo: Pet;

// `declare const` existe só para o compilador — ele é apagado na compilação.
// Por isso as chamadas abaixo ficam atrás deste guard: elas precisam ser
// TYPE-CHECKED, mas não podem EXECUTAR (dariam `ReferenceError: petExemplo
// is not defined` ao rodar o arquivo com tsx). O tipo explícito `: boolean`
// impede o TS de estreitar para `false` e marcar o bloco como inalcançável.
const VERIFICACAO_DE_TIPOS: boolean = false;

if (VERIFICACAO_DE_TIPOS) {
  // DEVEM compilar:
  descreverTela({ tipo: 'carregando' });
  descreverTela({ tipo: 'sucesso', dados: petExemplo });
  descreverTela({ tipo: 'erro', mensagem: 'Sem conexão' });
}

// DEVEM dar erro — descomente uma de cada vez (dentro do `if` acima):
// descreverTela({ tipo: 'carregando', dados: petExemplo });
// descreverTela({ tipo: 'erro', dados: petExemplo });
// descreverTela({ tipo: 'offline' });

// Rode com `npx tsx src/tela-pet.ts` depois de descomentar:
// carregar().then((estado) => console.log(descreverTela(estado)));
