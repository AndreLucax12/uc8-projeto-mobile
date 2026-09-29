import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { CartaoOrdemServico } from "./src/componentes/CartaoOrdemServico";
import type { OrdemServico } from "./src/types/entidades";

const ordens: OrdemServico[] = [
  { id: 1, equipamentoId: 10, descricaoDefeito: 'Tela quebrada', status: 'aberta', valorTotal: 350, dataAbertura: '2026-09-20' },
  { id: 2, equipamentoId: 11, descricaoDefeito: 'Não liga', status: 'em andamento', valorTotal: 180, dataAbertura: '2026-09-22' },
  { id: 3, equipamentoId: 12, descricaoDefeito: 'Bateria estufada', status: 'finalizada', valorTotal: 220, dataAbertura: '2026-09-25' },
];


export default function App() {
  return (
    <View style={estilos.tela}>
      <Text style={estilos.cabecalho}>Ordens de serviço</Text>
      <ScrollView>
        {ordens.map((ordem) => (
          <CartaoOrdemServico key={ordem.id} ordem={ordem} />
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#F6F8FA', paddingTop: 48, paddingHorizontal: 16 },
  cabecalho: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});
