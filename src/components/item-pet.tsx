// ============================================================
// Prática 3 — Item tocável da lista de pets
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Envolve o CardPet num Pressable para toque curto e longo.
// A ação vai em onPress, feedback visual vai no `pressed`.
// Nunca onPressIn.
// ============================================================
import { Pressable, StyleSheet } from 'react-native';

import { type Pet, rotuloStatusPasseio } from '../types/pet';
import { toque } from '../theme';
import { CardPet } from './card-pet';

type ItemPetProps = {
  pet: Pet;
  onAlternar: (id: string) => void;
  onRemover: (id: string) => void;
  onRegistrar: (id: string) => void;
};

export function ItemPet({ pet, onAlternar, onRemover, onRegistrar }: ItemPetProps) {
  return (
    <Pressable
      onPress={() => onAlternar(pet.id)}
      onLongPress={() => onRemover(pet.id)}
      accessibilityRole="button"
      accessibilityLabel={`${pet.nome}, passeio ${rotuloStatusPasseio(pet.statusPasseio).toLowerCase()}`}
      accessibilityHint="Toque para alternar o passeio. Toque longo para remover da lista."
      // O card já é grande, então a folga é só vertical e cobre metade do gap entre
      // itens: tocar no espaço entre dois cards ainda acerta o mais próximo.
      hitSlop={{ top: toque.folgaItem, bottom: toque.folgaItem }}
      // Sem esse atraso, começar a rolar a lista em cima de um card faz ele piscar.
      unstable_pressDelay={toque.atrasoPressMs}
      style={({ pressed }) => [styles.item, pressed && styles.pressionado]}
    >
      <CardPet pet={pet} aoRegistrarPasseio={() => onRegistrar(pet.id)} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    // Sem margin: o espaço entre itens vem do gap no contentContainerStyle da lista.
  },
  pressionado: {
    opacity: toque.opacidadePressionado,
  },
});
