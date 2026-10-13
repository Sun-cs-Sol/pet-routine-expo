// ============================================================
// Prática 3 — Mock de dados: lista de pets
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Este arquivo é o mock da lista. No mínimo 20 itens, com:
//   • pelo menos 3 espécies diferentes
//   • todos os 3 status de passeio representados
//   • idades variadas
//   • alguns com local e/ou fotoUri, outros sem
//
// Lista pequena esconde exatamente os problemas que esta prática
// ensina a evitar. Não reduza.
// ============================================================

import type { Pet } from '../types/pet';

// Foto de exemplo embutida como data URI (48x32, céu e grama).
// Uma URL da internet aqui seria chamada de rede, e a prática não permite.
const FOTO_EXEMPLO =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAgCAIAAADbtmxLAAAAu0lEQVR42u3OOQoCQQBE0TqYd/AeHkhEREREBhEREREREaNx3/flDHUDDQYGg+7OWitoeOEPPvIxpaAwpRQUZ5SC0pxSUF7wN95xJuHOUFnSt3Tlmy1GdUXfjEO2GLU1vTLeJIw96ht65Rgy9oi29MoxZOzR2NE3440tRnNP34xDthitA38jXXFnaB8pBZ0TpaB7phT0LpSC/pVSMLhRCoZ3SsHoQSkYPykFkxelIBdlpYShMBSGwtC/fQADcbt+Ki0LYgAAAABJRU5ErkJggg==';

// Coordenadas em volta do Recife Antigo, com a precisão que um GPS de celular costuma dar.
export const PETS: Pet[] = [
  { id: 'p1', nome: 'Rex', especie: 'cachorro', porte: 'medio', statusPasseio: 'pendente', idadeMeses: 24, criadoEm: new Date('2025-01-15') },
  { id: 'p2', nome: 'Mia', especie: 'gato', porte: 'pequeno', statusPasseio: 'concluido', idadeMeses: 18, criadoEm: new Date('2025-03-10') },
  { id: 'p3', nome: 'Blu', especie: 'ave', porte: 'pequeno', statusPasseio: 'cancelado', idadeMeses: 6, criadoEm: new Date('2025-06-20') },
  {
    id: 'p4',
    nome: 'Thor',
    especie: 'cachorro',
    porte: 'grande',
    statusPasseio: 'concluido',
    idadeMeses: 48,
    criadoEm: new Date('2024-11-02'),
    local: { latitude: -8.0631, longitude: -34.8711, precisaoMetros: 12 },
    fotoUri: FOTO_EXEMPLO,
  },
  { id: 'p5', nome: 'Luna', especie: 'gato', porte: 'pequeno', statusPasseio: 'pendente', idadeMeses: 9, criadoEm: new Date('2025-07-01') },
  {
    id: 'p6',
    nome: 'Paçoca',
    especie: 'cachorro',
    porte: 'pequeno',
    statusPasseio: 'concluido',
    idadeMeses: 36,
    criadoEm: new Date('2024-09-14'),
    local: { latitude: -8.0476, longitude: -34.877, precisaoMetros: 25 },
  },
  { id: 'p7', nome: 'Kiwi', especie: 'ave', porte: 'pequeno', statusPasseio: 'pendente', idadeMeses: 14, criadoEm: new Date('2025-02-18') },
  { id: 'p8', nome: 'Bolinha', especie: 'outro', porte: 'pequeno', statusPasseio: 'cancelado', idadeMeses: 20, criadoEm: new Date('2025-04-05') },
  { id: 'p9', nome: 'Mel', especie: 'cachorro', porte: 'medio', statusPasseio: 'pendente', idadeMeses: 72, criadoEm: new Date('2023-12-20') },
  { id: 'p10', nome: 'Frajola', especie: 'gato', porte: 'medio', statusPasseio: 'concluido', idadeMeses: 60, criadoEm: new Date('2024-01-30') },
  { id: 'p11', nome: 'Pipoca', especie: 'outro', porte: 'pequeno', statusPasseio: 'pendente', idadeMeses: 4, criadoEm: new Date('2025-08-11') },
  { id: 'p12', nome: 'Bob', especie: 'cachorro', porte: 'grande', statusPasseio: 'cancelado', idadeMeses: 96, criadoEm: new Date('2023-05-09') },
  { id: 'p13', nome: 'Nina', especie: 'gato', porte: 'pequeno', statusPasseio: 'pendente', idadeMeses: 30, criadoEm: new Date('2024-10-22') },
  { id: 'p14', nome: 'Zeca', especie: 'ave', porte: 'medio', statusPasseio: 'concluido', idadeMeses: 120, criadoEm: new Date('2022-08-15') },
  { id: 'p15', nome: 'Amora', especie: 'cachorro', porte: 'pequeno', statusPasseio: 'pendente', idadeMeses: 11, criadoEm: new Date('2025-05-27') },
  { id: 'p16', nome: 'Tom', especie: 'gato', porte: 'grande', statusPasseio: 'cancelado', idadeMeses: 84, criadoEm: new Date('2023-03-03') },
  {
    id: 'p17',
    nome: 'Biscoito',
    especie: 'cachorro',
    porte: 'medio',
    statusPasseio: 'concluido',
    idadeMeses: 15,
    criadoEm: new Date('2025-01-08'),
    fotoUri: FOTO_EXEMPLO,
  },
  { id: 'p18', nome: 'Lili', especie: 'ave', porte: 'pequeno', statusPasseio: 'pendente', idadeMeses: 2, criadoEm: new Date('2025-09-01') },
  { id: 'p19', nome: 'Max', especie: 'cachorro', porte: 'grande', statusPasseio: 'pendente', idadeMeses: 54, criadoEm: new Date('2024-04-17') },
  { id: 'p20', nome: 'Jabuti', especie: 'outro', porte: 'medio', statusPasseio: 'concluido', idadeMeses: 240, criadoEm: new Date('2021-02-10') },
  { id: 'p21', nome: 'Pantera', especie: 'gato', porte: 'medio', statusPasseio: 'pendente', idadeMeses: 42, criadoEm: new Date('2024-06-06') },
  { id: 'p22', nome: 'Fumaça', especie: 'cachorro', porte: 'medio', statusPasseio: 'cancelado', idadeMeses: 66, criadoEm: new Date('2023-11-25') },
];
