import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PilhaOrdens } from './src/navegacao/PilhaOrdens';
import type { RotasDasAbas } from './src/navegacao/tipos';
import { TelaBusca } from './src/telas/TelaBusca';
import { TelaClientes } from './src/telas/TelaClientes';
import { TelaSobre } from './src/telas/TelaSobre';

const Abas = createBottomTabNavigator<RotasDasAbas>();

export default function App() {
  return (
    <NavigationContainer>
      <Abas.Navigator>
        <Abas.Screen name="AbaOrdens" component={PilhaOrdens} options={{ title: 'Ordens', headerShown: false }} />
        <Abas.Screen name="AbaClientes" component={TelaClientes} options={{ title: 'Clientes' }} />
        <Abas.Screen name="AbaBusca" component={TelaBusca} options={{ title: 'Busca' }} />
        <Abas.Screen name="AbaSobre" component={TelaSobre} options={{ title: 'Sobre' }} />
      </Abas.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
