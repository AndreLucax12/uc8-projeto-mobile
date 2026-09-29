import type { OrdemServico } from '../types/entidades';

const ordens: OrdemServico[] = [
  { id: 1, equipamentoId: 10, descricaoDefeito: 'Tela quebrada', status: 'aberta', valorTotal: 350, dataAbertura: '2026-09-20' },
  { id: 2, equipamentoId: 11, descricaoDefeito: 'Não liga', status: 'em andamento', valorTotal: 180, dataAbertura: '2026-09-22' },
  { id: 3, equipamentoId: 12, descricaoDefeito: 'Bateria estufada', status: 'finalizada', valorTotal: 220, dataAbertura: '2026-09-25' },
];

// Simula uma busca num servidor: um dia esta função buscará dados de verdade.
export function buscarOrdens(): Promise<OrdemServico[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(ordens), 1500);
  });
}
