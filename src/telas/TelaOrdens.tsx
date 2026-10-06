import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CartaoOrdemServico } from '../componentes/CartaoOrdemServico';
import { FormularioOrdemServico, type DadosOrdemServico } from '../componentes/FormularioOrdemServico';
import type { RotasDaPilha } from '../navegacao/tipos';
import { buscarOrdens, guardarOrdem } from '../servicos/ordensServico';
import type { OrdemServico } from '../types/entidades';

type TelaOrdensProps = NativeStackScreenProps<RotasDaPilha, 'Ordens'>;

export function TelaOrdens({ navigation }: TelaOrdensProps) {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
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
  }, []);

  function adicionar(dados: DadosOrdemServico) {
    const proximoId = ordens.reduce((maior, atual) => Math.max(maior, atual.id), 0) + 1;
    const nova: OrdemServico = { id: proximoId, ...dados };
    guardarOrdem(nova);
    setOrdens([nova, ...ordens]);
  }

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" />
        <Text style={estilos.aviso}>Carregando ordens...</Text>
      </View>
    );
  }

  return (
    <View style={estilos.tela}>
      <FormularioOrdemServico aoAdicionar={adicionar} />
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
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#F6F8FA', padding: 16 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6F8FA' },
  aviso: { color: '#5B6B7C', fontSize: 16, marginTop: 8 },
  detalhes: { color: '#004A8D', fontWeight: 'bold', marginTop: -4, marginBottom: 16 },
});
