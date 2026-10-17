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

// A OS como a lista mostra: com o equipamento e o cliente, como o JOIN do TechOS Desktop.
export interface OrdemServicoDetalhada extends OrdemServico {
  marca: string;
  modelo: string;
  clienteId: number;
  nomeCliente: string;
}
