import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { CartaoCliente } from '../componentes/CartaoCliente';
import { buscarClientes } from '../servicos/clientesServico';
import { cores, espacos, larguraLarga } from '../tema/tema';
import type { Cliente } from '../types/entidades';

export function TelaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const { width } = useWindowDimensions();
  const duasColunas = width >= larguraLarga;

  useEffect(() => {
    let cancelado = false;
    buscarClientes().then((dados) => {
      if (cancelado) {
        return;
      }
      setClientes(dados);
      setCarregando(false);
    });
    return () => {
      cancelado = true;
    };
  }, []);

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={estilos.aviso}>Carregando clientes...</Text>
      </View>
    );
  }

  return (
    <View style={estilos.tela}>
      <FlatList
        key={duasColunas ? 'duas' : 'uma'}
        data={clientes}
        numColumns={duasColunas ? 2 : 1}
        columnWrapperStyle={duasColunas ? estilos.linhaDeColunas : undefined}
        keyExtractor={(cliente) => String(cliente.id)}
        renderItem={({ item }) => (
          <View style={estilos.celula}>
            <CartaoCliente cliente={item} />
          </View>
        )}
        ListEmptyComponent={<Text style={estilos.aviso}>Nenhum cliente cadastrado ainda.</Text>}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, padding: espacos.md },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: espacos.sm, backgroundColor: cores.fundo },
  aviso: { color: cores.textoSecundario, fontSize: 16 },
  linhaDeColunas: { gap: espacos.sm },
  celula: { flex: 1 },
});
