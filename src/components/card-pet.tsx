// ============================================================
// Prática 2 — Card do pet
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Usa o Card reutilizável e os tipos do domínio.
// Mostra: foto (se houver), nome, espécie + status do passeio (um em
// cada ponta), idade, local do último passeio (se houver).
// Oferece uma ação "Registrar passeio".
// ============================================================
import { Pressable, StyleSheet, Text, View } from 'react-native';
// Image do expo-image, não do react-native: é ele que tem contentFit e cache.
import { Image } from 'expo-image';

import { type Pet, rotuloEspecie, rotuloStatusPasseio } from '../types/pet';
import { cores, espaco, medidas, tipografia, toque } from '../theme';
import { Card } from './card';

type CardPetProps = {
  pet: Pet;
  aoRegistrarPasseio: () => void;
};

export function CardPet({ pet, aoRegistrarPasseio }: CardPetProps) {
  return (
    <Card>
      {pet.fotoUri ? (
        <Image
          source={{ uri: pet.fotoUri }}
          style={styles.miniatura}
          // cover preenche a faixa inteira e corta as sobras. Com contain, foto em pé
          // ficaria com barras dos lados e cada card teria um formato diferente.
          contentFit="cover"
          // A lista recicla as views; sem isso uma foto antiga pode aparecer por um instante no card errado.
          recyclingKey={pet.id}
          accessibilityLabel={`Foto do passeio de ${pet.nome}`}
        />
      ) : (
        <View style={[styles.miniatura, styles.miniaturaVazia]}>
          <Text style={tipografia.legenda}>Sem foto do passeio</Text>
        </View>
      )}

      <Text style={tipografia.titulo}>{pet.nome}</Text>

      <View style={styles.linha}>
        <Text style={tipografia.corpo}>{rotuloEspecie(pet.especie)}</Text>
        <Text style={tipografia.corpo}>{rotuloStatusPasseio(pet.statusPasseio)}</Text>
      </View>

      <Text style={tipografia.legenda}>{pet.idadeMeses} meses</Text>

      {pet.local && (
        <Text style={tipografia.legenda}>
          Local: {pet.local.latitude.toFixed(4)}, {pet.local.longitude.toFixed(4)} (±
          {Math.round(pet.local.precisaoMetros)} m)
        </Text>
      )}

      <Pressable
        onPress={aoRegistrarPasseio}
        accessibilityRole="button"
        accessibilityLabel={`Registrar passeio de ${pet.nome}`}
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
      >
        <Text style={styles.textoBotao}>Registrar passeio</Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botao: {
    alignSelf: 'flex-start',
    paddingVertical: espaco.xs,
  },
  botaoPressionado: {
    opacity: toque.opacidadePressionado,
  },
  textoBotao: {
    ...tipografia.corpo,
    fontWeight: 'bold',
    color: cores.primaria,
  },
  miniatura: {
    width: '100%',
    height: medidas.miniatura,
    borderRadius: medidas.raio,
  },
  miniaturaVazia: {
    backgroundColor: cores.placeholderFoto,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
