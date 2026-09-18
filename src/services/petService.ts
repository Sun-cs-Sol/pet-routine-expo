// ============================================================
// Prática 2 — Serviço mockado (arquivo 1 de 2)
// Leia o enunciado completo em `PRATICA.md` › "Prática 2".
//
// Antes de existir tela, existe a camada de dados. Aqui ela é falsa —
// mas a ASSINATURA das funções é propositalmente idêntica à que uma
// chamada HTTP real teria, para a troca do mock pela API ser indolor.
// ============================================================

import type { Pet } from '../types/pet';

// Deixe esta constante no código para conseguir testar o caminho de erro
// sem editar mais nada.
const SIMULAR_ERRO = false;

const ATRASO_MS = 1000; // para o estado de carregando ser visível

// TODO P2.1 — declare o pet mockado. Ele precisa satisfazer `Pet` inteiro;
//   não use `as` para escapar de campos faltando.
const MOCK: Pet = {
  id: 'p1',
  nome: 'Fubá',
  especie: 'gato',
  porte: 'pequeno',
  statusPasseio: 'pendente',
  idadeMeses: 30,
  criadoEm: '2026-01-15T12:00:00.000Z',
};

/**
 * Devolve UM pet — o do tutor logado. Assinatura propositalmente idêntica
 * à que uma chamada HTTP real teria, para a troca ser indolor.
 */
export async function buscarPetDoUsuario(): Promise<Pet> {
  await new Promise((resolve) => setTimeout(resolve, ATRASO_MS));

  if (SIMULAR_ERRO) {
    throw new Error('Não foi possível carregar o pet. Tente novamente.');
  }

  return MOCK;
}

/**
 * Registra o passeio do dia. Por enquanto só devolve o pet com o
 * status atualizado; persistência é assunto de aula futura.
 */
export async function registrarPasseio(pet: Pet): Promise<Pet> {
  return { ...pet, statusPasseio: 'concluido' };
}
