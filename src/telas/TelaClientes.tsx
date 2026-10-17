import { ActivityIndicator, FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Botao } from '../componentes/Botao';
import { CartaoCliente } from '../componentes/CartaoCliente';
import { useOrdens } from '../contexto/OrdensContexto';
import { cores, espacos, larguraLarga } from '../tema/tema';

export function TelaClientes() {
  const { estado, recarregar } = useOrdens();
  const { width } = useWindowDimensions();
  const duasColunas = width >= larguraLarga;

  switch (estado.tipo) {
    case 'carregando':
      return (
        <View style={estilos.centro}>
          <ActivityIndicator size="large" color={cores.primaria} />
          <Text style={estilos.aviso}>Carregando clientes...</Text>
        </View>
      );
    case 'erro':
      return (
        <View style={estilos.centro}>
          <Text style={estilos.erro}>Não foi possível carregar os clientes.</Text>
          <Text style={estilos.aviso}>{estado.mensagem}</Text>
          <View style={estilos.barra}>
            <Botao titulo="Tentar de novo" onPress={recarregar} />
          </View>
        </View>
      );
    case 'pronto':
      return (
        <View style={estilos.tela}>
          <FlatList
            key={duasColunas ? 'duas' : 'uma'}
            data={estado.clientes}
            numColumns={duasColunas ? 2 : 1}
            columnWrapperStyle={duasColunas ? estilos.linhaDeColunas : undefined}
            keyExtractor={(cliente) => String(cliente.id)}
            renderItem={({ item }) => (
              <View style={estilos.celula}>
                <CartaoCliente
                  cliente={item}
                  equipamentos={estado.equipamentos.filter((e) => e.clienteId === item.id)}
                />
              </View>
            )}
            ListEmptyComponent={<Text style={estilos.aviso}>Nenhum cliente cadastrado ainda.</Text>}
          />
        </View>
      );
  }
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, padding: espacos.md },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacos.sm,
    padding: espacos.md,
    backgroundColor: cores.fundo,
  },
  barra: { flexDirection: 'row' },
  aviso: { color: cores.textoSecundario, fontSize: 16, textAlign: 'center' },
  erro: { color: cores.erro, fontWeight: 'bold' },
  linhaDeColunas: { gap: espacos.sm },
  celula: { flex: 1 },
});
