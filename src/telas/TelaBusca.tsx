import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Campo } from '../componentes/Campo';
import { CartaoOrdemServico } from '../componentes/CartaoOrdemServico';
import { Opcoes } from '../componentes/Opcoes';
import { useOrdens } from '../contexto/OrdensContexto';
import type { RotasDasAbas } from '../navegacao/tipos';
import { cores, espacos } from '../tema/tema';
import type { OrdemServico } from '../types/entidades';
import { normalizarTexto } from '../utils/formatar';

type TelaBuscaProps = BottomTabScreenProps<RotasDasAbas, 'AbaBusca'>;

// O filtro de status do TechOS Desktop, como opções de toque (0 = todos).
const filtros: { id: number; rotulo: string; status?: OrdemServico['status'] }[] = [
  { id: 0, rotulo: 'Todos' },
  { id: 1, rotulo: 'Aberta', status: 'aberta' },
  { id: 2, rotulo: 'Em andamento', status: 'em andamento' },
  { id: 3, rotulo: 'Finalizada', status: 'finalizada' },
];

export function TelaBusca({ navigation }: TelaBuscaProps) {
  const { estado } = useOrdens();
  const [termo, setTermo] = useState('');
  const [filtro, setFiltro] = useState(0);

  if (estado.tipo !== 'pronto') {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.aviso}>
          {estado.tipo === 'carregando' ? 'Carregando ordens...' : 'As ordens não foram carregadas. Tente na aba Ordens.'}
        </Text>
      </View>
    );
  }

  // Derivado do estado: nada é guardado além do termo e do filtro.
  const procurado = normalizarTexto(termo.trim());
  const status = filtros.find((f) => f.id === filtro)?.status;
  const encontradas = estado.ordens.filter(
    (ordem) =>
      normalizarTexto(ordem.nomeCliente).includes(procurado) && (status === undefined || ordem.status === status),
  );

  return (
    <View style={estilos.tela}>
      <Campo rotulo="Nome do cliente" valor={termo} aoMudar={setTermo} />
      <Opcoes rotulo="Status" opcoes={filtros} selecionada={filtro} aoEscolher={setFiltro} vazio="" />
      <Text style={estilos.contador}>
        {encontradas.length} {encontradas.length === 1 ? 'OS encontrada' : 'OS encontradas'}
      </Text>
      <FlatList
        data={encontradas}
        keyExtractor={(ordem) => String(ordem.id)}
        renderItem={({ item }) => (
          <View>
            <CartaoOrdemServico ordem={item} />
            <Pressable
              onPress={() => navigation.navigate('AbaOrdens', { screen: 'DetalheOrdem', params: { id: item.id } })}
            >
              <Text style={estilos.detalhes}>Ver detalhes</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={estilos.aviso}>Nenhuma OS encontrada para essa busca.</Text>}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, padding: espacos.md },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: espacos.md, backgroundColor: cores.fundo },
  aviso: { color: cores.textoSecundario, textAlign: 'center' },
  contador: { color: cores.textoSecundario, marginBottom: espacos.sm },
  detalhes: { color: cores.primaria, fontWeight: 'bold', marginBottom: espacos.md },
});
