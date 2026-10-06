import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TelaDetalheOrdem } from '../telas/TelaDetalheOrdem';
import { TelaOrdens } from '../telas/TelaOrdens';
import type { RotasDaPilha } from './tipos';

const Pilha = createNativeStackNavigator<RotasDaPilha>();

export function PilhaOrdens() {
  return (
    <Pilha.Navigator>
      <Pilha.Screen name="Ordens" component={TelaOrdens} options={{ title: 'Ordens de serviço' }} />
      <Pilha.Screen name="DetalheOrdem" component={TelaDetalheOrdem} options={{ title: 'Detalhe da OS' }} />
    </Pilha.Navigator>
  );
}
