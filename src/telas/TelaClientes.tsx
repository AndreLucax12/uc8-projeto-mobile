import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { CartaoCliente } from '../componentes/CartaoCliente';
import { buscarClientes } from '../servicos/clientesServico';
import type { Cliente } from '../types/entidades';

export function TelaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);

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
        <ActivityIndicator size="large" />
        <Text style={estilos.aviso}>Carregando clientes...</Text>
      </View>
    );
  }

  return (
    <View style={estilos.tela}>
      <FlatList
        data={clientes}
        keyExtractor={(cliente) => String(cliente.id)}
        renderItem={({ item }) => <CartaoCliente cliente={item} />}
        ListEmptyComponent={<Text>Nenhum cliente cadastrado ainda.</Text>}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#F6F8FA', padding: 16 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6F8FA' },
  aviso: { color: '#5B6B7C', fontSize: 16, marginTop: 8 },
});
