import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, espacos, raio } from '../tema/tema';

export interface Opcao {
  id: number;
  rotulo: string;
}

interface OpcoesProps {
  rotulo: string;
  opcoes: Opcao[];
  selecionada: number | null;
  aoEscolher: (id: number) => void;
  vazio: string;
}

// O <select> do TechOS Desktop no celular: uma opção por toque, a escolhida em destaque.
export function Opcoes({ rotulo, opcoes, selecionada, aoEscolher, vazio }: OpcoesProps) {
  return (
    <View style={estilos.grupo}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      {opcoes.length === 0 ? (
        <Text style={estilos.vazio}>{vazio}</Text>
      ) : (
        <View style={estilos.linha}>
          {opcoes.map((opcao) => {
            const escolhida = opcao.id === selecionada;
            return (
              <Pressable
                key={opcao.id}
                accessibilityRole="button"
                accessibilityState={{ selected: escolhida }}
                onPress={() => aoEscolher(opcao.id)}
                style={({ pressed }) => [estilos.opcao, escolhida && estilos.escolhida, pressed && estilos.pressionada]}
              >
                <Text style={[estilos.texto, escolhida && estilos.textoEscolhido]}>{opcao.rotulo}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: { marginBottom: espacos.sm },
  rotulo: { color: cores.textoSecundario, marginBottom: espacos.xs },
  linha: { flexDirection: 'row', flexWrap: 'wrap', gap: espacos.sm },
  opcao: {
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio,
    paddingHorizontal: espacos.sm + espacos.xs,
    paddingVertical: espacos.sm,
  },
  escolhida: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  pressionada: { opacity: 0.7 },
  texto: { color: cores.texto },
  textoEscolhido: { color: cores.textoClaro, fontWeight: 'bold' },
  vazio: { color: cores.textoSecundario, fontStyle: 'italic' },
});
