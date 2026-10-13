// ============================================================
// Prática 3 — Estado vazio da lista
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Toda lista tem ListEmptyComponent. Sem exceção.
// E o texto do estado vazio precisa AJUDAR o usuário:
//   - primeiro acesso → o que ele pode fazer
//   - busca sem resultado → o que ele pode tentar
// ============================================================
import { StyleSheet, Text, View } from 'react-native';

import { cores, espaco, tipografia } from '../theme';

type ListaVaziaProps = {
  // Vazio ou ausente: a lista está vazia de verdade. Preenchido: a busca não achou nada.
  termoBusca?: string;
};

export function ListaVazia({ termoBusca = '' }: ListaVaziaProps) {
  const termo = termoBusca.trim();

  if (termo !== '') {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Nenhum pet chamado "{termo}"</Text>
        <Text style={styles.texto}>Confira se o nome está certo ou apague a busca para ver todos.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sua lista de pets está vazia</Text>
      <Text style={styles.texto}>Puxe a lista para baixo para carregar os pets de novo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: espaco.xl,
    gap: espaco.sm,
  },
  titulo: {
    ...tipografia.subtitulo,
    textAlign: 'center',
  },
  texto: {
    ...tipografia.corpo,
    color: cores.textoFraco,
    textAlign: 'center',
  },
});
