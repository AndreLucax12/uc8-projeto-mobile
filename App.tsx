import { StatusBar } from 'expo-status-bar';
import { DarkTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { OrdensProvedor } from './src/contexto/OrdensContexto';
import { PilhaOrdens } from './src/navegacao/PilhaOrdens';
import type { RotasDasAbas } from './src/navegacao/tipos';
import { TelaBusca } from './src/telas/TelaBusca';
import { TelaClientes } from './src/telas/TelaClientes';
import { TelaSobre } from './src/telas/TelaSobre';
import { cores } from './src/tema/tema';

const Abas = createBottomTabNavigator<RotasDasAbas>();

// Cabeçalhos e barra de abas com as cores do tema escuro do TechOS.
const temaDaNavegacao: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: cores.primaria,
    background: cores.fundo,
    card: cores.superficie,
    text: cores.texto,
    border: cores.borda,
  },
};

export default function App() {
  return (
    <OrdensProvedor>
      <NavigationContainer theme={temaDaNavegacao}>
        <Abas.Navigator>
          <Abas.Screen name="AbaOrdens" component={PilhaOrdens} options={{ title: 'Ordens', headerShown: false }} />
          <Abas.Screen name="AbaClientes" component={TelaClientes} options={{ title: 'Clientes' }} />
          <Abas.Screen name="AbaBusca" component={TelaBusca} options={{ title: 'Busca' }} />
          <Abas.Screen name="AbaSobre" component={TelaSobre} options={{ title: 'Sobre' }} />
        </Abas.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </OrdensProvedor>
  );
}
