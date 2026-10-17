import { StyleSheet, Text, View } from 'react-native';
import { cores, espacos } from '../tema/tema';

export function TelaBusca() {
  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo}>Busca</Text>
      <Text style={estilos.texto}>
        Busca de ordens de serviço pelo nome do cliente, como no TechOS Desktop. O conteúdo desta tela entra
        quando o aplicativo consumir os dados da nuvem.
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, padding: espacos.md },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: espacos.md, color: cores.texto },
  texto: { color: cores.texto },
});
