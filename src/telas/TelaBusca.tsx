import { StyleSheet, Text, View } from 'react-native';

export function TelaBusca() {
  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo}>Busca</Text>
      <Text>
        Busca de ordens de serviço pelo nome do cliente, como no TechOS Desktop. O conteúdo desta tela entra
        quando o aplicativo consumir os dados da nuvem.
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#F6F8FA', padding: 16 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});
