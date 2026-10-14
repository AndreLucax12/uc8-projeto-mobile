import type { NavigatorScreenParams } from '@react-navigation/native';

export type RotasDaPilha = {
  Ordens: undefined;
  DetalheOrdem: { id: number };
  NovaOrdem: undefined;
};

export type RotasDasAbas = {
  AbaOrdens: NavigatorScreenParams<RotasDaPilha>;
  AbaClientes: undefined;
  AbaBusca: undefined;
  AbaSobre: undefined;
};
