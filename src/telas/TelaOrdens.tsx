import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Botao } from '../componentes/Botao';
import { CartaoOrdemServico } from '../componentes/CartaoOrdemServico';
import { useOrdens } from '../contexto/OrdensContexto';
import type { RotasDaPilha } from '../navegacao/tipos';
import { cores, espacos, larguraLarga } from '../tema/tema';

type TelaOrdensProps = NativeStackScreenProps<RotasDaPilha, 'Ordens'>;

export function TelaOrdens({ navigation }: TelaOrdensProps) {
  const { estado, recarregar } = useOrdens();
  const { width } = useWindowDimensions();
  const duasColunas = width >= larguraLarga;

  function conteudo() {
    switch (estado.tipo) {
      case 'carregando':
        return (
          <View style={estilos.centro}>
            <ActivityIndicator size="large" color={cores.primaria} />
            <Text style={estilos.aviso}>Carregando ordens...</Text>
          </View>
        );
      case 'erro':
        return (
          <View style={estilos.centro}>
            <Text style={estilos.erro}>Não foi possível carregar as ordens de serviço.</Text>
            <Text style={estilos.detalheDoErro}>{estado.mensagem}</Text>
            <View style={estilos.barra}>
              <Botao titulo="Tentar de novo" onPress={recarregar} />
            </View>
          </View>
        );
      case 'pronto':
        return (
          <>
            {estado.origem === 'aparelho' && (
              <Text style={estilos.alerta}>
                Mostrando as ordens guardadas no aparelho: {estado.motivo}
              </Text>
            )}
            {estado.pendentes.length > 0 && (
              <Text style={estilos.alerta}>
                A enviar ({estado.pendentes.length}):{' '}
                {estado.pendentes.map((pendente) => pendente.descricaoDefeito).join(', ')}
              </Text>
            )}
            <Text style={estilos.contador}>
              {estado.ordens.length} {estado.ordens.length === 1 ? 'ordem' : 'ordens'} de serviço
            </Text>
            <FlatList
              key={duasColunas ? 'duas' : 'uma'}
              data={estado.ordens}
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
        );
    }
  }

  return (
    <View style={estilos.tela}>
      <View style={estilos.barra}>
        <Botao titulo="Recarregar" variante="secundario" onPress={recarregar} />
        <Botao titulo="Nova OS" onPress={() => navigation.navigate('NovaOrdem')} />
      </View>
      {conteudo()}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, padding: espacos.md },
  barra: { flexDirection: 'row', gap: espacos.sm, marginBottom: espacos.md },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: espacos.sm },
  aviso: { color: cores.textoSecundario, fontSize: 16 },
  erro: { color: cores.erro, fontWeight: 'bold' },
  detalheDoErro: { color: cores.textoSecundario, textAlign: 'center' },
  contador: { color: cores.textoSecundario, marginBottom: espacos.sm },
  alerta: { color: cores.alerta, marginBottom: espacos.sm },
  linhaDeColunas: { gap: espacos.sm },
  celula: { flex: 1 },
  detalhes: { color: cores.primaria, fontWeight: 'bold', marginBottom: espacos.md },
});
