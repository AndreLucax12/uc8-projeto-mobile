import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { KeyboardTypeOptions } from 'react-native';
import { cores, espacos, raio } from '../tema/tema';

interface CampoProps {
  rotulo: string;
  valor: string;
  aoMudar: (texto: string) => void;
  erro?: string;
  tipoDeTeclado?: KeyboardTypeOptions;
  varias?: boolean;
}

export function Campo({ rotulo, valor, aoMudar, erro, tipoDeTeclado = 'default', varias = false }: CampoProps) {
  return (
    <View style={estilos.grupo}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TextInput
        style={[estilos.entrada, varias && estilos.entradaVarias, erro !== undefined && estilos.entradaComErro]}
        value={valor}
        onChangeText={aoMudar}
        keyboardType={tipoDeTeclado}
        multiline={varias}
        placeholderTextColor={cores.textoSecundario}
      />
      {erro !== undefined && <Text style={estilos.erro}>{erro}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: { marginBottom: espacos.sm },
  rotulo: { color: cores.textoSecundario, marginBottom: espacos.xs },
  entrada: {
    backgroundColor: cores.superficie,
    borderRadius: raio,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espacos.sm + espacos.xs,
    color: cores.texto,
  },
  entradaVarias: { minHeight: 80, textAlignVertical: 'top' },
  entradaComErro: { borderColor: cores.erro },
  erro: { color: cores.erro, marginTop: espacos.xs },
});
