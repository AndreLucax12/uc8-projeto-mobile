import { StyleSheet, Text, View } from 'react-native';
import { cores, espacos, raio } from '../tema/tema';
import type { OrdemServico } from '../types/entidades';
import { formatarData, formatarMoeda } from '../utils/formatar';

interface CartaoOrdemServicoProps {
  ordem: OrdemServico;
}

export function CartaoOrdemServico({ ordem }: CartaoOrdemServicoProps) {
  return (
    <View style={estilos.cartao}>
      <View style={estilos.linha}>
        <View style={estilos.coluna}>
          <Text style={estilos.numero}>OS #{ordem.id}</Text>
          <Text style={estilos.defeito}>{ordem.descricaoDefeito}</Text>
        </View>
        <View
          style={[
            estilos.etiqueta,
            ordem.status === 'aberta' && estilos.aberta,
            ordem.status === 'em andamento' && estilos.emAndamento,
            ordem.status === 'finalizada' && estilos.finalizada,
          ]}
        >
          <Text style={estilos.textoEtiqueta}>{ordem.status}</Text>
        </View>
      </View>
      <View style={estilos.linha}>
        <Text style={[estilos.info, estilos.coluna]}>Equipamento #{ordem.equipamentoId}</Text>
        <Text style={estilos.valor}>{formatarMoeda(ordem.valorTotal)}</Text>
      </View>
      <Text style={estilos.data}>Aberta em {formatarData(ordem.dataAbertura)}</Text>
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
    gap: espacos.xs,
  },
  linha: { flexDirection: 'row', alignItems: 'flex-start', gap: espacos.sm },
  coluna: { flex: 1 },
  numero: { fontSize: 18, fontWeight: 'bold', color: cores.texto },
  defeito: { color: cores.textoSecundario },
  etiqueta: { borderRadius: raio, paddingHorizontal: espacos.sm, paddingVertical: espacos.xs },
  aberta: { backgroundColor: cores.statusAberta },
  emAndamento: { backgroundColor: cores.statusEmAndamento },
  finalizada: { backgroundColor: cores.statusFinalizada },
  textoEtiqueta: { color: cores.fundo, fontWeight: 'bold', fontSize: 12 },
  info: { color: cores.texto },
  valor: { color: cores.texto, fontWeight: 'bold' },
  data: { color: cores.textoSecundario, fontSize: 12 },
});
