import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormularioOrdemServico } from '../componentes/FormularioOrdemServico';
import { useOrdens, type DadosNovaOS } from '../contexto/OrdensContexto';
import type { RotasDaPilha } from '../navegacao/tipos';
import { descreverErro } from '../servicos/api';
import { cores, espacos } from '../tema/tema';

type TelaNovaOrdemProps = NativeStackScreenProps<RotasDaPilha, 'NovaOrdem'>;

export function TelaNovaOrdem({ navigation }: TelaNovaOrdemProps) {
  const { incluir } = useOrdens();
  const [erro, setErro] = useState<string | undefined>(undefined);

  function adicionar(dados: DadosNovaOS) {
    setErro(undefined);
    incluir(dados)
      .then(() => {
        navigation.goBack();
      })
      .catch((falha: unknown) => {
        setErro(descreverErro(falha));
      });
  }

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <FormularioOrdemServico aoAdicionar={adicionar} />
      {erro !== undefined && <Text style={estilos.erro}>{erro}</Text>}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espacos.md },
  erro: { color: cores.erro, fontWeight: 'bold', marginTop: espacos.sm },
});
