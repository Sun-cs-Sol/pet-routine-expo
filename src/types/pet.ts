// ============================================================
// Prática 1 — Modelagem do domínio Pet
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Leia o enunciado completo em `PRATICA.md` › "Prática 1".
// Onde houver `/* … */` ou `TODO`, é a sua vez de escrever.
// Os blocos marcados como VERIFICAÇÃO **não devem ser apagados**.
//
// Regras do domínio (resumo — o enunciado manda):
//   • Um pet tem exatamente UMA espécie e exatamente UM porte.
//   • O passeio do dia tem três desfechos: pendente, concluído ou cancelado.
//   • `id`, `criadoEm` e o `statusPasseio` inicial são gerados pelo SERVIDOR —
//     o formulário de cadastro não envia nenhum dos três.
//   • A lista "Meus pets" mostra só nome, espécie e status do passeio (+ `id`).
//
// Restrições de avaliação: nenhum `any`; `as` só com justificativa em
// comentário; nenhum campo de domínio tipado como `string` genérica.
// ============================================================

// ============================================================
// TODO P1.1 — Union types literais. Nenhum destes pode ser `string`.
//   EspeciePet     → cachorro, gato, ave, outro
//   PortePet       → pequeno, medio, grande
//   StatusPasseio  → pendente, concluido, cancelado
// ============================================================
export type EspeciePet = 'cachorro' | 'gato' | 'ave' | 'outro';
export type PortePet = 'pequeno' | 'medio' | 'grande';
export type StatusPasseio = 'pendente' | 'concluido' | 'cancelado';

// ============================================================
// TODO P1.2 — A entidade completa, como ela virá do servidor um dia.
//   Campos: id, nome, especie, porte, statusPasseio, idadeMeses, criadoEm.
//   Pense no tipo de cada um. Você vai justificar uma dessas escolhas
//   na Prática 2.
// ============================================================
export interface Pet {
  id: string;
  nome: string;
  especie: EspeciePet;
  porte: PortePet;
  statusPasseio: StatusPasseio;
  idadeMeses: number;
  criadoEm: string;
}

// ============================================================
// TODO P1.3 — Tipos DERIVADOS. Use utility types; não redigite campos.
//   NovoPet         → o que o formulário de cadastro envia
//   ResumoPet       → o que o card da lista "Meus pets" precisa
//   AtualizacaoPet  → edição parcial de um pet já cadastrado
//
//   Dica: os utility types desta prática são `Omit`, `Pick` e `Partial`.
//   Pergunte-se de QUEM cada um deve derivar — nem sempre é de `Pet`.
// ============================================================
export type NovoPet = Omit<Pet, 'id' | 'criadoEm' | 'statusPasseio'>;
export type ResumoPet = Pick<Pet, 'id' | 'nome' | 'especie' | 'statusPasseio'>;
export type AtualizacaoPet = Partial<Omit<Pet, 'id' | 'criadoEm' | 'statusPasseio'>>;

// ============================================================
// TODO P1.4 — Rótulos legíveis, com switch exaustivo e SEM `default`.
//   Sem `default`, o compilador avisa se um dia você acrescentar uma
//   variante ao union e esquecer de tratá-la aqui. É esse o ponto.
// ============================================================
export function rotuloStatusPasseio(status: StatusPasseio): string {
  switch (status) {
    case 'pendente':
      return 'Pendente';
    case 'concluido':
      return 'Concluído';
    case 'cancelado':
      return 'Cancelado';
  }
}

export function rotuloEspecie(especie: EspeciePet): string {
  switch (especie) {
    case 'cachorro':
      return 'Cachorro';
    case 'gato':
      return 'Gato';
    case 'ave':
      return 'Ave';
    case 'outro':
      return 'Outro';
  }
}

// ============================================================
// VERIFICAÇÃO — não apague
// ============================================================

// DEVEM compilar exatamente assim, sem campos a mais nem a menos:
const novo: NovoPet = {
  nome: 'Fubá',
  especie: 'gato',
  porte: 'pequeno',
  idadeMeses: 30,
};

const resumo: ResumoPet = {
  id: 'p1',
  nome: 'Fubá',
  especie: 'gato',
  statusPasseio: 'pendente',
};

const parcial: AtualizacaoPet = { idadeMeses: 31 };

// DEVEM dar erro — descomente uma de cada vez para confirmar:
// const errado1: NovoPet = { nome: 'Fubá', especie: 'gato', porte: 'pequeno', idadeMeses: 30, id: 'p1' };
// const errado2: NovoPet = { nome: 'Fubá', especie: 'peixe', porte: 'pequeno', idadeMeses: 30 };
// const errado3: ResumoPet = { id: 'p1', nome: 'Fubá', especie: 'gato' };
// const errado4: AtualizacaoPet = { statusPasseio: 'concluido' };

// Só para o `tsc` não reclamar de variáveis não usadas na verificação:
void novo;
void resumo;
void parcial;

// ============================================================
// TODO P1.5 — Teste final da prática (responda aqui, em comentário)
//   Acrescente o campo `microchip: string` à interface `Pet`.
//   Quantos dos três tipos derivados você precisou editar à mão?
//
//   Resposta: 0, nenhum. Testei adicionando o campo e rodando o tsc:
//   os três tipos são derivados de Pet com Omit/Pick/Partial, então o
//   campo novo entra sozinho neles. Só deu erro em quem já tinha um
//   objeto pronto sem o campo (o MOCK e o exemplo `novo`), o que faz
//   sentido.
// ============================================================
