// ============================================================
// Prática 2 — Sistema de tokens de design
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Tokens são VALORES (cores, espaçamentos, tipografia), nunca
// layouts prontos. Componentes consomem estes tokens — nunca o
// contrário. Nenhum componente deve ter um hex ou número mágico;
// tudo vem daqui.
//
// Regra: `as const` AQUI, nunca dentro de `StyleSheet.create`.
// ============================================================

export const cores = {
  fundo: '#FEF7EE',
  cartao: '#FFFFFF',
  texto: '#333333',
  textoFraco: '#777777',
  textoSobrePrimaria: '#FFFFFF',
  primaria: '#FF8C00',
  sucesso: '#4CAF50',
  erro: '#F44336',
  placeholderFoto: '#F1E4D3',
} as const;

export const espaco = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const tipografia = {
  titulo: { fontSize: 24, fontWeight: '600', color: cores.texto },
  subtitulo: { fontSize: 18, fontWeight: '600', color: cores.texto },
  corpo: { fontSize: 16, fontWeight: '400', color: cores.texto },
  legenda: { fontSize: 12, fontWeight: '400', color: cores.textoFraco },
} as const;

// Medidas que não são espaçamento, mas também não podem ficar soltas nos componentes.
export const medidas = {
  topoTela: 48, // espaço da status bar, já que ainda não usamos safe area
  raio: 8,
  miniatura: 120,
  previaFoto: 200,
} as const;

export const toque = {
  opacidadePressionado: 0.7,
  // ~1 frame de toque parado antes de mostrar o "pressed". Se o dedo começa a
  // rolar a lista nesse tempo, o item não pisca como se tivesse sido tocado.
  atrasoPressMs: 100,
  // Metade do gap entre itens (espaco.sm / 2). Os dois vizinhos dividem o
  // espaço vazio entre eles: não sobra zona morta e as áreas não se sobrepõem.
  folgaItem: espaco.sm / 2,
} as const;

// Por que `as const` aqui e não no StyleSheet.create: aqui ele trava os valores
// como literais (ex: fontWeight '600' e não string); o StyleSheet.create já tipa
// cada estilo sozinho, então um `as const` lá dentro não acrescenta nada.
