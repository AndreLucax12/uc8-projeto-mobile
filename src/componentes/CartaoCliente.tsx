import { StyleSheet, Text, View } from 'react-native';
import { cores, espacos, raio } from '../tema/tema';
import type { Cliente } from '../types/entidades';
import { formatarTelefone } from '../utils/formatar';

interface CartaoClienteProps {
  cliente: Cliente;
}

export function CartaoCliente({ cliente }: CartaoClienteProps) {
  return (
    <View style={estilos.cartao}>
      <Text style={estilos.nome}>{cliente.nome}</Text>
      <Text style={estilos.telefone}>{formatarTelefone(cliente.telefone)}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio,
    padding: espacos.md,
    marginBottom: espacos.sm,
  },
  nome: { fontSize: 18, fontWeight: 'bold', color: cores.texto },
  telefone: { color: cores.textoSecundario, marginTop: espacos.xs },
});
