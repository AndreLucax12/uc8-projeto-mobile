import type { OrdemServico, OrdemServicoDetalhada } from '../types/entidades';
import { campos, requisitar } from './api';

// O que o aplicativo envia para abrir uma OS: o status, o id e a data são definidos pelo banco.
export interface DadosNovaOrdem {
  id_equipamento: number;
  descricao_defeito: string;
  valor_total: number;
}

interface OrdemRemota {
  id: number;
  id_equipamento: number;
  descricao_defeito: string;
  status: OrdemServico['status'];
  valor_total: number;
  data_abertura: string;
  equipamentos: { marca: string; modelo: string; id_cliente: number; clientes: { nome: string } };
}

// O select traz a OS com o equipamento e o cliente numa consulta só (o JOIN do TechOS Desktop).
const COLUNAS =
  'id,id_equipamento,descricao_defeito,status,valor_total,data_abertura,equipamentos(marca,modelo,id_cliente,clientes(nome))';

function ehStatus(valor: unknown): valor is OrdemServico['status'] {
  return valor === 'aberta' || valor === 'em andamento' || valor === 'finalizada';
}

function ehOrdemRemota(valor: unknown): valor is OrdemRemota {
  const ordem = campos(valor);
  const equipamento = campos(ordem?.equipamentos);
  const cliente = campos(equipamento?.clientes);
  return (
    ordem !== undefined &&
    typeof ordem.id === 'number' &&
    typeof ordem.id_equipamento === 'number' &&
    typeof ordem.descricao_defeito === 'string' &&
    ehStatus(ordem.status) &&
    typeof ordem.valor_total === 'number' &&
    typeof ordem.data_abertura === 'string' &&
    equipamento !== undefined &&
    typeof equipamento.marca === 'string' &&
    typeof equipamento.modelo === 'string' &&
    typeof equipamento.id_cliente === 'number' &&
    cliente !== undefined &&
    typeof cliente.nome === 'string'
  );
}

function ehListaDeOrdens(valor: unknown): valor is OrdemRemota[] {
  return Array.isArray(valor) && valor.every(ehOrdemRemota);
}

function paraOrdem(remota: OrdemRemota): OrdemServicoDetalhada {
  return {
    id: remota.id,
    equipamentoId: remota.id_equipamento,
    descricaoDefeito: remota.descricao_defeito,
    status: remota.status,
    valorTotal: remota.valor_total,
    dataAbertura: remota.data_abertura,
    marca: remota.equipamentos.marca,
    modelo: remota.equipamentos.modelo,
    clienteId: remota.equipamentos.id_cliente,
    nomeCliente: remota.equipamentos.clientes.nome,
  };
}

export async function carregarOrdens(): Promise<OrdemServicoDetalhada[]> {
  const corpo = await requisitar(`ordens_servico?select=${COLUNAS}&order=id.desc`);
  if (!ehListaDeOrdens(corpo)) {
    throw new Error('Resposta inesperada da API');
  }
  return corpo.map(paraOrdem);
}

export async function incluirOrdem(dados: DadosNovaOrdem): Promise<OrdemServicoDetalhada> {
  const corpo = await requisitar(`ordens_servico?select=${COLUNAS}`, 'POST', dados);
  if (!ehListaDeOrdens(corpo) || corpo.length !== 1) {
    throw new Error('Resposta inesperada da API');
  }
  return paraOrdem(corpo[0]);
}
