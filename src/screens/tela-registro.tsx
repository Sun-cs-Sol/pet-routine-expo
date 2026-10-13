// ============================================================
// Prática 3 — Tela de registro de passeio (sensores)
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Captura o CONTEXTO do passeio: onde aconteceu (GPS) e como ele
// se parecia (câmera). Navegação por condicional com useState —
// navegação real chega na Aula 7.
//
// CONTRATO DE TRÊS TEMPOS
//   Localização
//     1. PEDIR → requestForegroundPermissionsAsync() e depois hasServicesEnabledAsync()
//     2. LER   → getCurrentPositionAsync() uma vez, quando o usuário toca no botão
//     3. PARAR → não se aplica, porque é leitura única: nenhuma assinatura fica aberta
//   Câmera
//     1. PEDIR → useCameraPermissions() (pede só quando o usuário toca em "Tirar foto")
//     2. LER   → takePictureAsync() na CameraView
//     3. PARAR → setMostrarCamera(false): a CameraView sai da tela e libera a câmera
//
// Restrições:
//   • Sem useEffect, useRef — apenas useState + hooks das bibliotecas
//   • Sem navegação — a tela aparece por condicional em App.tsx
//   • Sem mapa — coordenada é texto
//   • Sem salvar na galeria e sem escolher do rolo
//   • Sem rede — foto vive no cache
// ============================================================
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
// Image do expo-image (contentFit), não do react-native.
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { CameraView, useCameraPermissions } from 'expo-camera';

import type { Pet } from '../types/pet';
import { cores, espaco, medidas, tipografia, toque } from '../theme';

type TelaRegistroProps = {
  pet: Pet;
  onSalvar: (local?: Pet['local'], fotoUri?: string) => void;
  onCancelar: () => void;
};

type Falha = 'localNegada' | 'localBloqueada' | 'gpsDesligado' | 'cameraNegada' | 'indisponivel';

// Cada falha diz o que aconteceu E o que o usuário pode fazer.
// Sem default: se surgir uma falha nova, o compilador cobra a mensagem.
function mensagemFalha(falha: Falha): string {
  switch (falha) {
    case 'localNegada':
      return 'Você não permitiu o acesso à localização. Toque em "Obter localização" para o app pedir de novo.';
    case 'localBloqueada':
      return 'A localização está bloqueada para este app. Libere em Configurações > Permissões > Localização.';
    case 'gpsDesligado':
      return 'A localização do celular está desligada. Ative nas configurações rápidas e tente de novo.';
    case 'cameraNegada':
      return 'Sem permissão para usar a câmera. Toque em "Tirar foto" de novo ou libere a câmera nas configurações.';
    case 'indisponivel':
      return 'O GPS ou a câmera não respondeu neste aparelho. Dá para salvar o passeio mesmo assim.';
  }
}

export function TelaRegistro({ pet, onSalvar, onCancelar }: TelaRegistroProps) {
  const [local, setLocal] = useState<Pet['local']>();
  const [fotoUri, setFotoUri] = useState<string>();
  const [falha, setFalha] = useState<Falha | null>(null);
  const [buscandoLocal, setBuscandoLocal] = useState(false);
  const [mostrarCamera, setMostrarCamera] = useState(false);
  const [cameraPronta, setCameraPronta] = useState(false);

  const [permissaoCamera, pedirPermissaoCamera] = useCameraPermissions();
  // Sem useRef nesta prática: o useState guarda a instância da câmera quando ela monta.
  const [camera, setCamera] = useState<CameraView | null>(null);

  // ----- Localização -----
  async function obterLocalizacao() {
    setFalha(null);
    setBuscandoLocal(true);
    try {
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setFalha(canAskAgain ? 'localNegada' : 'localBloqueada');
        return;
      }

      if (!(await Location.hasServicesEnabledAsync())) {
        setFalha('gpsDesligado');
        return;
      }

      // High (~10 m) é suficiente para saber em que rua ou praça foi o passeio.
      // Justificativa completa no README.
      const posicao = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocal({
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
        // Android e iOS sempre informam a precisão; null só aparece na web.
        precisaoMetros: posicao.coords.accuracy ?? 0,
      });
    } catch {
      // Sem sinal de GPS, timeout ou aparelho sem o sensor.
      setFalha('indisponivel');
    } finally {
      setBuscandoLocal(false);
    }
  }

  // ----- Câmera -----
  async function abrirCamera() {
    setFalha(null);
    const permissao = permissaoCamera?.granted ? permissaoCamera : await pedirPermissaoCamera();
    if (!permissao.granted) {
      setFalha('cameraNegada');
      return;
    }
    setCameraPronta(false);
    setMostrarCamera(true);
  }

  function fecharCamera() {
    setMostrarCamera(false);
    setCamera(null);
  }

  async function tirarFoto() {
    if (!camera) return;
    try {
      // Sem base64: para mostrar a prévia o uri do arquivo no cache já basta.
      const foto = await camera.takePictureAsync();
      setFotoUri(foto.uri);
    } catch {
      setFalha('indisponivel');
    }
    fecharCamera();
  }

  function cameraFalhou() {
    setFalha('indisponivel');
    fecharCamera();
  }

  function salvar() {
    // Local e foto são opcionais: negar tudo ainda salva o passeio.
    onSalvar(local, fotoUri);
  }

  // ----- Renderização: câmera ativa -----
  if (mostrarCamera) {
    return (
      <View style={styles.tela}>
        <CameraView
          ref={setCamera}
          style={styles.camera}
          facing="back"
          onCameraReady={() => setCameraPronta(true)}
          onMountError={cameraFalhou}
        />
        <View style={styles.acoes}>
          <Botao titulo="Tirar foto" onPress={tirarFoto} desabilitado={!cameraPronta} />
          <Botao titulo="Voltar" onPress={fecharCamera} secundario />
        </View>
      </View>
    );
  }

  // ----- Renderização: tela principal de registro -----
  return (
    <View style={styles.tela}>
      <Text style={tipografia.titulo}>Registrar passeio de {pet.nome}</Text>
      <Text style={tipografia.legenda}>Local e foto são opcionais. Dá para salvar sem nenhum dos dois.</Text>

      {falha && (
        <View style={styles.caixaErro}>
          <Text style={styles.erro}>{mensagemFalha(falha)}</Text>
          {(falha === 'localBloqueada' || falha === 'cameraNegada') && (
            <Botao titulo="Abrir configurações" onPress={() => Linking.openSettings()} secundario />
          )}
        </View>
      )}

      <View style={styles.secao}>
        <Text style={tipografia.subtitulo}>Local</Text>
        {local ? (
          <Text style={tipografia.corpo}>
            {local.latitude.toFixed(4)}, {local.longitude.toFixed(4)} (precisão de ±{Math.round(local.precisaoMetros)} m)
          </Text>
        ) : (
          <Botao
            titulo={buscandoLocal ? 'Buscando localização...' : 'Obter localização'}
            onPress={obterLocalizacao}
            desabilitado={buscandoLocal}
          />
        )}
      </View>

      <View style={styles.secao}>
        <Text style={tipografia.subtitulo}>Foto</Text>
        {fotoUri && (
          <Image
            source={{ uri: fotoUri }}
            style={styles.previa}
            // cover: a prévia ocupa a largura toda com altura fixa, igual à miniatura do card.
            contentFit="cover"
            accessibilityLabel={`Foto do passeio de ${pet.nome}`}
          />
        )}
        <Botao titulo={fotoUri ? 'Tirar outra foto' : 'Tirar foto'} onPress={abrirCamera} />
      </View>

      <View style={styles.acoes}>
        <Botao titulo="Salvar" onPress={salvar} />
        <Botao titulo="Cancelar" onPress={onCancelar} secundario />
      </View>
    </View>
  );
}

type BotaoProps = {
  titulo: string;
  onPress: () => void;
  desabilitado?: boolean;
  secundario?: boolean;
};

function Botao({ titulo, onPress, desabilitado, secundario }: BotaoProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      accessibilityRole="button"
      accessibilityState={{ disabled: desabilitado }}
      style={({ pressed }) => [
        styles.botao,
        secundario && styles.botaoSecundario,
        (pressed || desabilitado) && styles.botaoApagado,
      ]}
    >
      <Text style={styles.textoBotao}>{titulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    padding: espaco.md,
    paddingTop: medidas.topoTela,
    backgroundColor: cores.fundo,
    gap: espaco.md,
  },
  secao: { gap: espaco.sm },
  caixaErro: { gap: espaco.sm },
  erro: { ...tipografia.corpo, color: cores.erro },
  camera: { flex: 1, borderRadius: medidas.raio },
  previa: { width: '100%', height: medidas.previaFoto, borderRadius: medidas.raio },
  acoes: { flexDirection: 'row', gap: espaco.md },
  botao: {
    flexGrow: 1,
    backgroundColor: cores.primaria,
    padding: espaco.md,
    borderRadius: medidas.raio,
    alignItems: 'center',
  },
  botaoSecundario: { backgroundColor: cores.textoFraco },
  botaoApagado: { opacity: toque.opacidadePressionado },
  textoBotao: { color: cores.textoSobrePrimaria, fontWeight: 'bold' },
});
