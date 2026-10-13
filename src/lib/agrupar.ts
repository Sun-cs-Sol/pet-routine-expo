// ============================================================
// Prática 3 — Agrupamento e filtragem de pets
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Funções puras — sem JSX, sem estado, sem React.
// Moram aqui para serem testáveis e reutilizáveis independentemente.
// ============================================================

import { type Pet, type StatusPasseio, rotuloStatusPasseio } from '../types/pet';

export type Secao = { title: string; data: Pet[] };

// Ordem das seções: pendente primeiro, porque é o que pede ação do dono hoje.
// Depois concluído (o que já foi feito) e por último cancelado, que é o caso mais raro.
// Fica numa lista fixa para a ordem não depender de qual pet aparece primeiro no array.
const ORDEM_STATUS: StatusPasseio[] = ['pendente', 'concluido', 'cancelado'];

export function agrupar(pets: Pet[]): Secao[] {
  return ORDEM_STATUS
    .map((status) => ({
      title: rotuloStatusPasseio(status),
      data: pets.filter((pet) => pet.statusPasseio === status),
    }))
    .filter((secao) => secao.data.length > 0);
}

export function filtrarPorNome(pets: Pet[], busca: string): Pet[] {
  const termo = busca.trim().toLowerCase();
  if (termo === '') return pets;
  return pets.filter((pet) => pet.nome.toLowerCase().includes(termo));
}
