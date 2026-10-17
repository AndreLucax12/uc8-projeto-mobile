import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useOrdens } from '../contexto/OrdensContexto';
import type { RotasDaPilha } from '../navegacao/tipos';
import { cores, espacos } from '../tema/tema';
import { formatarData, formatarMoeda, formatarTelefone } from '../utils/formatar';

type TelaDetalheOrdemProps = NativeStackScreenProps<RotasDaPilha, 'DetalheOrdem'>;

export function TelaDetalheOrdem({ route }: TelaDetalheOrdemProps) {
  const { id } = route.params;
  const { estado, buscar } = useOrdens();
  const ordem = buscar(id);

  if (ordem === undefined) {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.aviso}>OS #{id} não encontrada.</Text>
      </View>
    );
  }

  const cliente = estado.tipo === 'pronto' ? estado.clientes.find((c) => c.id === ordem.clienteId) : undefined;

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <View style={estilos.linha}>
        <Text style={[estilos.titulo, estilos.coluna]}>OS #{ordem.id}</Text>
        <Text style={estilos.status}>{ordem.status}</Text>
      </View>
      <Text style={estilos.rotulo}>Defeito</Text>
      <Text style={estilos.valor}>{ordem.descricaoDefeito}</Text>
      <Text style={estilos.rotulo}>Equipamento</Text>
      <Text style={estilos.valor}>
        {ordem.marca} {ordem.modelo}
      </Text>
      <Text style={estilos.rotulo}>Cliente</Text>
      <Text style={estilos.valor}>{ordem.nomeCliente}</Text>
      {cliente !== undefined && <Text style={estilos.complemento}>{formatarTelefone(cliente.telefone)}</Text>}
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
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.fundo },
  aviso: { color: cores.textoSecundario },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espacos.sm, marginBottom: espacos.sm },
  coluna: { flex: 1 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: cores.texto },
  status: { color: cores.primaria, fontWeight: 'bold' },
  rotulo: { color: cores.textoSecundario, marginTop: espacos.sm },
  valor: { fontSize: 16, color: cores.texto },
  complemento: { color: cores.textoSecundario },
});
