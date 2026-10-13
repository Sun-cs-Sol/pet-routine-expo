// ============================================================
// Prática 3 — Tela principal: lista de pets + registro de passeio
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Na Prática 2 esta tela mostrava um pet em destaque.
// Agora mostra uma lista de verdade com SectionList, toque
// interativo e registro de passeio com sensores.
//
// Restrições:
//   • Nenhuma ScrollView envolvendo a lista
//   • Nenhuma mutação de estado — toda mudança cria array novo
//   • Agrupamento e filtro moram em src/lib/, não aqui
//   • Sem useEffect para sensores (cleanup é assunto da Aula 6)
// ============================================================
import { useState } from 'react';
import { SectionList, StyleSheet, Text, TextInput, View } from 'react-native';

import type { Pet, StatusPasseio } from './src/types/pet';
import { PETS } from './src/data/pets';
import { agrupar, filtrarPorNome, type Secao } from './src/lib/agrupar';
import { ItemPet } from './src/components/item-pet';
import { ListaVazia } from './src/components/lista-vazia';
import { TelaRegistro } from './src/screens/tela-registro';
import { cores, espaco, medidas, tipografia } from './src/theme';

const ATRASO_RECARREGAR_MS = 800; // só para o indicador de refresh aparecer

// Toque curto: pendente vira concluído, concluído volta para pendente.
// Cancelado também vai para concluído — se o pet passeou, o toque registra isso.
function proximoStatus(status: StatusPasseio): StatusPasseio {
  return status === 'concluido' ? 'pendente' : 'concluido';
}

// Não depende de nada da tela, então fica fora do componente e não é recriado a cada render.
function renderCabecalhoSecao({ section }: { section: Secao }) {
  return (
    <Text style={styles.cabecalhoSecao}>
      {section.title} ({section.data.length})
    </Text>
  );
}

export default function App() {
  const [pets, setPets] = useState<Pet[]>(PETS);
  const [busca, setBusca] = useState('');
  const [atualizando, setAtualizando] = useState(false);
  const [petRegistrando, setPetRegistrando] = useState<string | null>(null);

  function alternarStatus(id: string) {
    setPets((anteriores) =>
      anteriores.map((p) => (p.id === id ? { ...p, statusPasseio: proximoStatus(p.statusPasseio) } : p)),
    );
  }

  function removerPet(id: string) {
    setPets((anteriores) => anteriores.filter((p) => p.id !== id));
  }

  async function recarregar() {
    setAtualizando(true);
    await new Promise((resolve) => setTimeout(resolve, ATRASO_RECARREGAR_MS));
    setPets(PETS);
    setBusca('');
    setAtualizando(false);
  }

  function handleRegistro(local?: Pet['local'], fotoUri?: string) {
    setPets((anteriores) =>
      anteriores.map((p) =>
        p.id === petRegistrando
          ? {
              ...p,
              statusPasseio: 'concluido',
              // Se o usuário negou GPS ou câmera agora, mantém o que o pet já tinha.
              local: local ?? p.local,
              fotoUri: fotoUri ?? p.fotoUri,
            }
          : p,
      ),
    );
    setPetRegistrando(null);
  }

  const petAlvo = pets.find((p) => p.id === petRegistrando);
  if (petAlvo) {
    return <TelaRegistro pet={petAlvo} onSalvar={handleRegistro} onCancelar={() => setPetRegistrando(null)} />;
  }

  // Filtra primeiro e agrupa depois: assim só entram nas seções os pets que casam
  // com a busca, e o agrupar já descarta a seção que ficou vazia.
  const secoes = agrupar(filtrarPorNome(pets, busca));

  return (
    <View style={styles.tela}>
      <SectionList<Pet, Secao>
        sections={secoes}
        keyExtractor={(item) => item.id}
        // Usa as funções de estado da tela, por isso fica aqui dentro.
        renderItem={({ item }) => (
          <ItemPet pet={item} onAlternar={alternarStatus} onRemover={removerPet} onRegistrar={setPetRegistrando} />
        )}
        renderSectionHeader={renderCabecalhoSecao}
        stickySectionHeadersEnabled
        ListEmptyComponent={<ListaVazia termoBusca={busca} />}
        refreshing={atualizando}
        onRefresh={recarregar}
        // Elemento, não função: assim o TextInput não é recriado a cada letra e não perde o foco.
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            <Text style={tipografia.titulo}>Meus pets</Text>
            <TextInput
              value={busca}
              onChangeText={setBusca}
              placeholder="Buscar pet por nome..."
              placeholderTextColor={cores.textoFraco}
              autoCorrect={false}
              clearButtonMode="while-editing"
              accessibilityLabel="Buscar pet por nome"
              style={styles.busca}
            />
            <Text style={tipografia.legenda}>Toque no card para alternar o passeio. Segure para remover.</Text>
          </View>
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.conteudo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    paddingTop: medidas.topoTela,
    backgroundColor: cores.fundo,
  },
  cabecalho: {
    gap: espaco.sm,
    paddingBottom: espaco.sm,
  },
  conteudo: {
    gap: espaco.sm,
    paddingHorizontal: espaco.md,
    paddingBottom: espaco.lg,
  },
  cabecalhoSecao: {
    ...tipografia.subtitulo,
    backgroundColor: cores.fundo,
    paddingVertical: espaco.sm,
  },
  busca: {
    borderWidth: 1,
    borderColor: cores.textoFraco,
    borderRadius: medidas.raio,
    padding: espaco.sm,
    fontSize: tipografia.corpo.fontSize,
    color: cores.texto,
    backgroundColor: cores.cartao,
  },
});
