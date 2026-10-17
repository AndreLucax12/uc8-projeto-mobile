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
  const { estado, incluir } = useOrdens();
  const [erro, setErro] = useState<string | undefined>(undefined);
  const [enviando, setEnviando] = useState(false);

  function adicionar(dados: DadosNovaOS) {
    setErro(undefined);
    setEnviando(true);
    incluir(dados)
      .then(() => {
        navigation.goBack();
      })
      .catch((falha: unknown) => {
        setErro(descreverErro(falha));
        setEnviando(false);
      });
  }

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      {estado.tipo === 'pronto' ? (
        <FormularioOrdemServico
          clientes={estado.clientes}
          equipamentos={estado.equipamentos}
          aoAdicionar={adicionar}
        />
      ) : (
        <Text style={estilos.aviso}>Os clientes e os equipamentos ainda não foram carregados. Volte à lista.</Text>
      )}
      {enviando && <Text style={estilos.aviso}>Abrindo a OS...</Text>}
      {erro !== undefined && <Text style={estilos.erro}>{erro}</Text>}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espacos.md },
  aviso: { color: cores.textoSecundario, marginTop: espacos.sm },
  erro: { color: cores.erro, fontWeight: 'bold', marginTop: espacos.sm },
});
