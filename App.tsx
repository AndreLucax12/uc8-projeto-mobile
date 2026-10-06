import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RotasDaPilha } from './src/navegacao/tipos';
import { TelaDetalheOrdem } from './src/telas/TelaDetalheOrdem';
import { TelaOrdens } from './src/telas/TelaOrdens';

const Pilha = createNativeStackNavigator<RotasDaPilha>();

export default function App() {
  return (
    <NavigationContainer>
      <Pilha.Navigator>
        <Pilha.Screen name="Ordens" component={TelaOrdens} options={{ title: 'Ordens de serviço' }} />
        <Pilha.Screen name="DetalheOrdem" component={TelaDetalheOrdem} options={{ title: 'Detalhe da OS' }} />
      </Pilha.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
