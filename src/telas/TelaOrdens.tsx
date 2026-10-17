import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CartaoOrdemServico } from '../componentes/CartaoOrdemServico';
import type { RotasDaPilha } from '../navegacao/tipos';
import { buscarOrdens } from '../servicos/ordensServico';
import { cores, espacos, larguraLarga, raio } from '../tema/tema';
import type { OrdemServico } from '../types/entidades';

type TelaOrdensProps = NativeStackScreenProps<RotasDaPilha, 'Ordens'>;

export function TelaOrdens({ navigation }: TelaOrdensProps) {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [tentativa, setTentativa] = useState(0);
  const { width } = useWindowDimensions();
  const duasColunas = width >= larguraLarga;

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

  // Mais recente primeiro, como no TechOS Desktop; a cópia não altera o estado.
  const ordenadas = [...ordens].sort((a, b) => b.id - a.id);

  return (
    <View style={estilos.tela}>
      <View style={estilos.barra}>
        <Pressable style={[estilos.botao, estilos.secundario]} onPress={recarregar}>
          <Text style={[estilos.textoBotao, estilos.textoSecundario]}>Recarregar</Text>
        </Pressable>
        <Pressable style={estilos.botao} onPress={() => navigation.navigate('NovaOrdem')}>
          <Text style={estilos.textoBotao}>Nova OS</Text>
        </Pressable>
      </View>
      {carregando ? (
        <View style={estilos.centro}>
          <ActivityIndicator size="large" color={cores.primaria} />
          <Text style={estilos.aviso}>Carregando ordens...</Text>
        </View>
      ) : (
        <>
          <Text style={estilos.contador}>
            {ordens.length} {ordens.length === 1 ? 'ordem' : 'ordens'} de serviço
          </Text>
          <FlatList
            key={duasColunas ? 'duas' : 'uma'}
            data={ordenadas}
            numColumns={duasColunas ? 2 : 1}
            columnWrapperStyle={duasColunas ? estilos.linhaDeColunas : undefined}
            keyExtractor={(ordem) => String(ordem.id)}
            renderItem={({ item }) => (
              <View style={estilos.celula}>
                <CartaoOrdemServico ordem={item} />
                <Pressable onPress={() => navigation.navigate('DetalheOrdem', { id: item.id })}>
                  <Text style={estilos.detalhes}>Ver detalhes</Text>
                </Pressable>
              </View>
            )}
            ListEmptyComponent={<Text style={estilos.aviso}>Nenhuma ordem de serviço aberta ainda.</Text>}
          />
        </>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, padding: espacos.md },
  barra: { flexDirection: 'row', gap: espacos.sm, marginBottom: espacos.md },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: espacos.sm },
  aviso: { color: cores.textoSecundario, fontSize: 16 },
  contador: { color: cores.textoSecundario, marginBottom: espacos.sm },
  botao: {
    flex: 1,
    backgroundColor: cores.primaria,
    borderRadius: raio,
    padding: espacos.sm + espacos.xs,
    alignItems: 'center',
  },
  secundario: { backgroundColor: cores.superficie, borderWidth: 1, borderColor: cores.borda },
  textoBotao: { color: cores.textoClaro, fontWeight: 'bold' },
  textoSecundario: { color: cores.texto },
  linhaDeColunas: { gap: espacos.sm },
  celula: { flex: 1 },
  detalhes: { color: cores.primaria, fontWeight: 'bold', marginBottom: espacos.md },
});
