import { StyleSheet, Text, View } from 'react-native';

export function TelaSobre() {
  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo}>TechOS Mobile</Text>
      <Text>
        Recorte do TechOS, o gerenciador de assistência técnica da UC5: abertura e acompanhamento de ordens de
        serviço, com os clientes e os equipamentos de cada uma.
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#F6F8FA', padding: 16 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});
