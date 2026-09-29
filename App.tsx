import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { CartaoOrdemServico } from './src/componentes/CartaoOrdemServico';
import { FormularioOrdemServico, type DadosOrdemServico } from './src/componentes/FormularioOrdemServico';
import { buscarOrdens } from './src/servicos/ordensServico';
import type { OrdemServico } from './src/types/entidades';

export default function App() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarOrdens().then((dados) => {
      setOrdens(dados);
      setCarregando(false);
    });
  }, []);

  function adicionar(dados: DadosOrdemServico) {
    const proximoId = ordens.reduce((maior, atual) => Math.max(maior, atual.id), 0) + 1;
    setOrdens([{ id: proximoId, ...dados }, ...ordens]);
  }

  return (
    <View style={estilos.tela}>
      <Text style={estilos.cabecalho}>Ordens de serviço</Text>
      {carregando ? (
        <Text style={estilos.aviso}>Carregando ordens...</Text>
      ) : (
        <>
          <FormularioOrdemServico aoAdicionar={adicionar} />
          <FlatList
            data={ordens}
            keyExtractor={(ordem) => String(ordem.id)}
            renderItem={({ item }) => <CartaoOrdemServico ordem={item} />}
            ListEmptyComponent={<Text>Nenhuma ordem de serviço.</Text>}
          />
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#F6F8FA', paddingTop: 48, paddingHorizontal: 16 },
  cabecalho: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  aviso: { color: '#5B6B7C', fontSize: 16 },
});
