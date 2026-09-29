import { StyleSheet ,View, Text } from "react-native";
import type { OrdemServico } from "../types/entidades";


interface CartaoOrdemServicoProps {
  ordem: OrdemServico;

}
export function CartaoOrdemServico({ ordem }: CartaoOrdemServicoProps) {
    return (
        <View style={estilos.cartao}> 
            <Text style={estilos.numero}>OS #{ordem.id}</Text>
            <Text style={estilos.defeito}>{ordem.descricaoDefeito}</Text>
            <Text>Equipamento #{ordem.equipamentoId}</Text>
            <Text style={estilos.status}>Status: {ordem.status}</Text>
            <Text>Valor: R$ {ordem.valorTotal.toFixed(2)}</Text>
            <Text style={estilos.data}>Aberta em {ordem.dataAbertura}</Text>
        </View>
    );
}

const estilos = StyleSheet.create({
  cartao: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12 },
  numero: { fontSize: 18, fontWeight: 'bold' },
  defeito: { fontSize: 16, marginVertical: 4 },
  status: { color: '#004A8D', fontWeight: 'bold' },
  data: { color: '#5B6B7C', marginTop: 4 },
});