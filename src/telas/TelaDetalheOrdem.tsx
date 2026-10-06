import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RotasDaPilha } from '../navegacao/tipos';
import { buscarOrdem } from '../servicos/ordensServico';
import type { OrdemServico } from '../types/entidades';

type TelaDetalheOrdemProps = NativeStackScreenProps<RotasDaPilha, 'DetalheOrdem'>;

export function TelaDetalheOrdem({ route }: TelaDetalheOrdemProps) {
  const { id } = route.params;
  const [ordem, setOrdem] = useState<OrdemServico | undefined>(undefined);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let cancelado = false;
    setCarregando(true);
    buscarOrdem(id).then((resultado) => {
      if (cancelado) {
        return;
      }
      setOrdem(resultado);
      setCarregando(false);
    });
    return () => {
      cancelado = true;
    };
  }, [id]);

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" />
        <Text>Carregando a ordem de serviço...</Text>
      </View>
    );
  }

  if (ordem === undefined) {
    return (
      <View style={estilos.centro}>
        <Text>OS #{id} não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo}>OS #{ordem.id}</Text>
      <Text style={estilos.status}>{ordem.status}</Text>
      <Text style={estilos.rotulo}>Defeito</Text>
      <Text style={estilos.valor}>{ordem.descricaoDefeito}</Text>
      <Text style={estilos.rotulo}>Equipamento</Text>
      <Text style={estilos.valor}>#{ordem.equipamentoId}</Text>
      <Text style={estilos.rotulo}>Valor</Text>
      <Text style={estilos.valor}>R$ {ordem.valorTotal.toFixed(2)}</Text>
      <Text style={estilos.rotulo}>Aberta em</Text>
      <Text style={estilos.valor}>{ordem.dataAbertura}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#F6F8FA', padding: 16 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6F8FA' },
  titulo: { fontSize: 24, fontWeight: 'bold' },
  status: { color: '#004A8D', fontWeight: 'bold', marginBottom: 16 },
  rotulo: { color: '#5B6B7C', marginTop: 8 },
  valor: { fontSize: 16 },
});
