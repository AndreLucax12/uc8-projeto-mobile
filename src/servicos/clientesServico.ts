import type { Cliente, Equipamento } from '../types/entidades';
import { campos, requisitar } from './api';

interface ClienteRemoto {
  id: number;
  nome: string;
  telefone: string;
}

interface EquipamentoRemoto {
  id: number;
  marca: string;
  modelo: string;
  id_cliente: number;
}

function ehClienteRemoto(valor: unknown): valor is ClienteRemoto {
  const cliente = campos(valor);
  return (
    cliente !== undefined &&
    typeof cliente.id === 'number' &&
    typeof cliente.nome === 'string' &&
    typeof cliente.telefone === 'string'
  );
}

function ehEquipamentoRemoto(valor: unknown): valor is EquipamentoRemoto {
  const equipamento = campos(valor);
  return (
    equipamento !== undefined &&
    typeof equipamento.id === 'number' &&
    typeof equipamento.marca === 'string' &&
    typeof equipamento.modelo === 'string' &&
    typeof equipamento.id_cliente === 'number'
  );
}

export async function carregarClientes(): Promise<Cliente[]> {
  const corpo = await requisitar('clientes?select=id,nome,telefone&order=nome');
  if (!Array.isArray(corpo) || !corpo.every(ehClienteRemoto)) {
    throw new Error('Resposta inesperada da API');
  }
  return corpo.map((remoto) => ({ id: remoto.id, nome: remoto.nome, telefone: remoto.telefone }));
}

export async function carregarEquipamentos(): Promise<Equipamento[]> {
  const corpo = await requisitar('equipamentos?select=id,marca,modelo,id_cliente&order=id');
  if (!Array.isArray(corpo) || !corpo.every(ehEquipamentoRemoto)) {
    throw new Error('Resposta inesperada da API');
  }
  return corpo.map((remoto) => ({
    id: remoto.id,
    marca: remoto.marca,
    modelo: remoto.modelo,
    clienteId: remoto.id_cliente,
  }));
}
