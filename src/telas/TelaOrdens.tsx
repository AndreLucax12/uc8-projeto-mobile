import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CartaoOrdemServico } from '../componentes/CartaoOrdemServico';
import type { RotasDaPilha } from '../navegacao/tipos';
import { buscarOrdens } from '../servicos/ordensServico';
import type { OrdemServico } from '../types/entidades';

type TelaOrdensProps = NativeStackScreenProps<RotasDaPilha, 'Ordens'>;

export function TelaOrdens({ navigation }: TelaOrdensProps) {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [tentativa, setTentativa] = useState(0);

  // Recarrega sempre que a lista volta ao foco: a OS criada na tela Nova OS aparece ao voltar.
  useFocusEffect(
    useCallback(() => {
      let cancelado = false;
      buscarOrdens().then((dados) => {
        if (cancelado) {
          return;
        }
        setOrdens(dados);
        setCarregando(false);
      });
      return () => {
        cancelado = true;
      };
    }, [tentativa]),
  );

  function recarregar() {
    setCarregando(true);
    setTentativa(tentativa + 1);
  }

  return (
    <View style={estilos.tela}>
      <View style={estilos.barra}>
        <Pressable style={estilos.botao} onPress={recarregar}>
          <Text style={estilos.textoBotao}>Recarregar</Text>
        </Pressable>
        <Pressable style={estilos.botao} onPress={() => navigation.navigate('NovaOrdem')}>
          <Text style={estilos.textoBotao}>Nova OS</Text>
        </Pressable>
      </View>
      {carregando ? (
        <View style={estilos.centro}>
          <ActivityIndicator size="large" />
          <Text style={estilos.aviso}>Carregando ordens...</Text>
        </View>
      ) : (
        <FlatList
          data={ordens}
          keyExtractor={(ordem) => String(ordem.id)}
          renderItem={({ item }) => (
            <View>
              <CartaoOrdemServico ordem={item} />
              <Pressable onPress={() => navigation.navigate('DetalheOrdem', { id: item.id })}>
                <Text style={estilos.detalhes}>Ver detalhes</Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={<Text>Nenhuma ordem de serviço.</Text>}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#F6F8FA', padding: 16 },
  barra: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  aviso: { color: '#5B6B7C', fontSize: 16, marginTop: 8 },
  botao: { flex: 1, backgroundColor: '#004A8D', borderRadius: 6, padding: 12, alignItems: 'center' },
  textoBotao: { color: '#fff', fontWeight: 'bold' },
  detalhes: { color: '#004A8D', fontWeight: 'bold', marginTop: -4, marginBottom: 16 },
});
