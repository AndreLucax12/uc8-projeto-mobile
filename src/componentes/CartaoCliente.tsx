import { StyleSheet, Text, View } from 'react-native';
import type { Cliente } from '../types/entidades';

interface CartaoClienteProps {
  cliente: Cliente;
}

// Mesmo formato do TechOS Desktop: (84) 99123-4567 ou (84) 3321-5566.
function formatarTelefone(telefone: string): string {
  const digitos = telefone.replace(/\D/g, '');
  if (digitos.length === 11) return digitos.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  if (digitos.length === 10) return digitos.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  return telefone;
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
  cartao: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12 },
  nome: { fontSize: 18, fontWeight: 'bold' },
  telefone: { color: '#5B6B7C', marginTop: 4 },
});
