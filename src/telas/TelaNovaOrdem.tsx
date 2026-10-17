import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormularioOrdemServico, type DadosOrdemServico } from '../componentes/FormularioOrdemServico';
import type { RotasDaPilha } from '../navegacao/tipos';
import { guardarOrdem, proximoIdOrdem } from '../servicos/ordensServico';
import { cores, espacos } from '../tema/tema';
import type { OrdemServico } from '../types/entidades';

type TelaNovaOrdemProps = NativeStackScreenProps<RotasDaPilha, 'NovaOrdem'>;

export function TelaNovaOrdem({ navigation }: TelaNovaOrdemProps) {
  function adicionar(dados: DadosOrdemServico) {
    const nova: OrdemServico = { id: proximoIdOrdem(), ...dados };
    guardarOrdem(nova);
    navigation.goBack();
  }

  return (
    <View style={estilos.tela}>
      <FormularioOrdemServico aoAdicionar={adicionar} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, padding: espacos.md },
});
