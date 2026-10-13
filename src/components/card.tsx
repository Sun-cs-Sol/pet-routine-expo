// ============================================================
// Prática 2 — Componente Card reutilizável
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Este componente é genérico — ele não sabe nada sobre Pet.
// Props tipadas, children: ReactNode, prop opcional `destacado`.
//
// Restrições:
//   • Sombra com `boxShadow` (uma string), não com shadow*/elevation
//   • Espaçamento interno com `gap`
//   • Nenhum hex ou número mágico — tudo vem do theme.ts
// ============================================================
import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { cores, espaco, medidas } from '../theme';

type CardProps = {
  children: ReactNode;
  destacado?: boolean;
};

export function Card({ children, destacado }: CardProps) {
  return <View style={[styles.card, destacado && styles.cardDestacado]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    padding: espaco.md,
    borderRadius: medidas.raio,
    backgroundColor: cores.cartao,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    gap: espaco.sm,
  },
  cardDestacado: {
    borderWidth: 2,
    borderColor: cores.primaria,
  },
});
