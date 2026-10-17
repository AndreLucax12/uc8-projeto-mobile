import { StyleSheet, Text, View } from 'react-native';
import { cores, espacos, raio } from '../tema/tema';
import type { Cliente, Equipamento } from '../types/entidades';
import { formatarTelefone } from '../utils/formatar';

interface CartaoClienteProps {
  cliente: Cliente;
  equipamentos: Equipamento[];
}

export function CartaoCliente({ cliente, equipamentos }: CartaoClienteProps) {
  return (
    <View style={estilos.cartao}>
      <View style={estilos.linha}>
        <Text style={[estilos.nome, estilos.coluna]}>{cliente.nome}</Text>
        <View style={estilos.etiqueta}>
          <Text style={estilos.textoEtiqueta}>{equipamentos.length}</Text>
        </View>
      </View>
      <Text style={estilos.telefone}>{formatarTelefone(cliente.telefone)}</Text>
      {equipamentos.map((equipamento) => (
        <Text key={equipamento.id} style={estilos.equipamento}>
          {equipamento.marca} {equipamento.modelo}
        </Text>
      ))}
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
  linha: { flexDirection: 'row', alignItems: 'flex-start', gap: espacos.sm },
  coluna: { flex: 1 },
  nome: { fontSize: 18, fontWeight: 'bold', color: cores.texto },
  etiqueta: { backgroundColor: cores.borda, borderRadius: raio, paddingHorizontal: espacos.sm, paddingVertical: espacos.xs },
  textoEtiqueta: { color: cores.texto, fontWeight: 'bold' },
  telefone: { color: cores.textoSecundario, marginTop: espacos.xs },
  equipamento: { color: cores.texto, marginTop: espacos.xs },
});
