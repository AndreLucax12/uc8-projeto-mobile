export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
}

export interface Equipamento {
  id: number;
  marca: string;
  modelo: string;
  clienteId: number;
}

export interface OrdemServico {
  id: number;
  equipamentoId: number;
  descricaoDefeito: string;
  status: 'aberta' | 'em andamento' | 'finalizada';
  valorTotal: number;
  dataAbertura: string;
}
