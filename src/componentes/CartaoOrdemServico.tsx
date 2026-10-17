import { StyleSheet, Text, View } from 'react-native';
import { cores, espacos, raio } from '../tema/tema';
import type { OrdemServicoDetalhada } from '../types/entidades';
import { formatarData, formatarMoeda } from '../utils/formatar';

interface CartaoOrdemServicoProps {
  ordem: OrdemServicoDetalhada;
}

export function CartaoOrdemServico({ ordem }: CartaoOrdemServicoProps) {
  return (
    <View style={estilos.cartao}>
      <View style={estilos.linha}>
        <View style={estilos.coluna}>
          <Text style={estilos.titulo}>
            {ordem.nomeCliente} — {ordem.marca} {ordem.modelo}
          </Text>
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
        <Text style={[estilos.info, estilos.coluna]}>
          OS #{ordem.id} · {formatarData(ordem.dataAbertura)}
        </Text>
        <Text style={estilos.valor}>{formatarMoeda(ordem.valorTotal)}</Text>
      </View>
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
  titulo: { fontSize: 16, fontWeight: 'bold', color: cores.texto },
  defeito: { color: cores.textoSecundario },
  etiqueta: { borderRadius: raio, paddingHorizontal: espacos.sm, paddingVertical: espacos.xs },
  aberta: { backgroundColor: cores.statusAberta },
  emAndamento: { backgroundColor: cores.statusEmAndamento },
  finalizada: { backgroundColor: cores.statusFinalizada },
  textoEtiqueta: { color: cores.fundo, fontWeight: 'bold', fontSize: 12 },
  info: { color: cores.textoSecundario, fontSize: 12 },
  valor: { color: cores.texto, fontWeight: 'bold' },
});
