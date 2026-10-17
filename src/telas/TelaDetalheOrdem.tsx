import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RotasDaPilha } from '../navegacao/tipos';
import { buscarOrdem } from '../servicos/ordensServico';
import { cores, espacos } from '../tema/tema';
import type { OrdemServico } from '../types/entidades';
import { formatarData, formatarMoeda } from '../utils/formatar';

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
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={estilos.aviso}>Carregando a ordem de serviço...</Text>
      </View>
    );
  }

  if (ordem === undefined) {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.aviso}>OS #{id} não encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <View style={estilos.linha}>
        <Text style={[estilos.titulo, estilos.coluna]}>OS #{ordem.id}</Text>
        <Text style={estilos.status}>{ordem.status}</Text>
      </View>
      <Text style={estilos.rotulo}>Defeito</Text>
      <Text style={estilos.valor}>{ordem.descricaoDefeito}</Text>
      <Text style={estilos.rotulo}>Equipamento</Text>
      <Text style={estilos.valor}>#{ordem.equipamentoId}</Text>
      <Text style={estilos.rotulo}>Valor</Text>
      <Text style={estilos.valor}>{formatarMoeda(ordem.valorTotal)}</Text>
      <Text style={estilos.rotulo}>Aberta em</Text>
      <Text style={estilos.valor}>{formatarData(ordem.dataAbertura)}</Text>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espacos.md },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: espacos.sm, backgroundColor: cores.fundo },
  aviso: { color: cores.textoSecundario },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espacos.sm, marginBottom: espacos.sm },
  coluna: { flex: 1 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: cores.texto },
  status: { color: cores.primaria, fontWeight: 'bold' },
  rotulo: { color: cores.textoSecundario, marginTop: espacos.sm },
  valor: { fontSize: 16, color: cores.texto },
});
