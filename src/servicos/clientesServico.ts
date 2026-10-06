import type { Cliente } from '../types/entidades';

let clientes: Cliente[] = [
  { id: 1, nome: 'Pedro Ezequiel', telefone: '84991234567' },
  { id: 2, nome: 'Maria Fernanda Souza', telefone: '84987654321' },
  { id: 3, nome: 'Pablo Pontes da Silva', telefone: '8433215566' },
];

// Simula uma busca num servidor: um dia esta função buscará dados de verdade.
export function buscarClientes(): Promise<Cliente[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(clientes), 1000);
  });
}

export function guardarCliente(cliente: Cliente): void {
  clientes = [cliente, ...clientes];
}

export function buscarCliente(id: number): Promise<Cliente | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(clientes.find((cliente) => cliente.id === id)), 400);
  });
}
