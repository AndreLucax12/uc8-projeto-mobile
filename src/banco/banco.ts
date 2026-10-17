import * as SQLite from 'expo-sqlite';
import type { Cliente, Equipamento, OrdemServico, OrdemServicoDetalhada } from '../types/entidades';

// O que o aparelho guarda da última carga com rede: as ordens (já com cliente e equipamento),
// os clientes e os equipamentos, para a lista e a Nova OS funcionarem sem rede.
// Uma OS aberta sem rede, esperando a próxima carga com rede para ir à nuvem.
export interface Pendente {
  id: number;
  equipamentoId: number;
  descricaoDefeito: string;
  valorTotal: number;
}

interface LinhaPendente {
  id: number;
  id_equipamento: number;
  descricao_defeito: string;
  valor_total: number;
}

export interface DadosGuardados {
  ordens: OrdemServicoDetalhada[];
  clientes: Cliente[];
  equipamentos: Equipamento[];
}

interface LinhaOrdem {
  id: number;
  id_equipamento: number;
  descricao_defeito: string;
  status: OrdemServico['status'];
  valor_total: number;
  data_abertura: string;
  marca: string;
  modelo: string;
  id_cliente: number;
  nome_cliente: string;
}

interface LinhaCliente {
  id: number;
  nome: string;
  telefone: string;
}

interface LinhaEquipamento {
  id: number;
  marca: string;
  modelo: string;
  id_cliente: number;
}

let bancoAberto: Promise<SQLite.SQLiteDatabase> | undefined;

function banco(): Promise<SQLite.SQLiteDatabase> {
  if (bancoAberto === undefined) {
    bancoAberto = SQLite.openDatabaseAsync('techos.db').then(async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS ordens (
          id INTEGER PRIMARY KEY NOT NULL,
          id_equipamento INTEGER NOT NULL,
          descricao_defeito TEXT NOT NULL,
          status TEXT NOT NULL,
          valor_total REAL NOT NULL,
          data_abertura TEXT NOT NULL,
          marca TEXT NOT NULL,
          modelo TEXT NOT NULL,
          id_cliente INTEGER NOT NULL,
          nome_cliente TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS clientes (
          id INTEGER PRIMARY KEY NOT NULL,
          nome TEXT NOT NULL,
          telefone TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS equipamentos (
          id INTEGER PRIMARY KEY NOT NULL,
          marca TEXT NOT NULL,
          modelo TEXT NOT NULL,
          id_cliente INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS pendentes (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          id_equipamento INTEGER NOT NULL,
          descricao_defeito TEXT NOT NULL,
          valor_total REAL NOT NULL
        );
      `);
      return db;
    });
  }
  return bancoAberto;
}

function paraOrdem(linha: LinhaOrdem): OrdemServicoDetalhada {
  return {
    id: linha.id,
    equipamentoId: linha.id_equipamento,
    descricaoDefeito: linha.descricao_defeito,
    status: linha.status,
    valorTotal: linha.valor_total,
    dataAbertura: linha.data_abertura,
    marca: linha.marca,
    modelo: linha.modelo,
    clienteId: linha.id_cliente,
    nomeCliente: linha.nome_cliente,
  };
}

export async function listarLocal(): Promise<DadosGuardados> {
  const db = await banco();
  const ordens = await db.getAllAsync<LinhaOrdem>(
    'SELECT id, id_equipamento, descricao_defeito, status, valor_total, data_abertura, marca, modelo, id_cliente, nome_cliente FROM ordens ORDER BY id DESC',
  );
  const clientes = await db.getAllAsync<LinhaCliente>('SELECT id, nome, telefone FROM clientes ORDER BY nome');
  const equipamentos = await db.getAllAsync<LinhaEquipamento>(
    'SELECT id, marca, modelo, id_cliente FROM equipamentos ORDER BY id',
  );
  return {
    ordens: ordens.map(paraOrdem),
    clientes,
    equipamentos: equipamentos.map((e) => ({ id: e.id, marca: e.marca, modelo: e.modelo, clienteId: e.id_cliente })),
  };
}

// Troca o que estava guardado pelo que acabou de vir da nuvem, tudo numa transação.
export async function guardarLocal(dados: DadosGuardados): Promise<void> {
  const db = await banco();
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM ordens');
    await db.runAsync('DELETE FROM clientes');
    await db.runAsync('DELETE FROM equipamentos');
    for (const ordem of dados.ordens) {
      await db.runAsync(
        'INSERT INTO ordens (id, id_equipamento, descricao_defeito, status, valor_total, data_abertura, marca, modelo, id_cliente, nome_cliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          ordem.id,
          ordem.equipamentoId,
          ordem.descricaoDefeito,
          ordem.status,
          ordem.valorTotal,
          ordem.dataAbertura,
          ordem.marca,
          ordem.modelo,
          ordem.clienteId,
          ordem.nomeCliente,
        ],
      );
    }
    for (const cliente of dados.clientes) {
      await db.runAsync('INSERT INTO clientes (id, nome, telefone) VALUES (?, ?, ?)', [
        cliente.id,
        cliente.nome,
        cliente.telefone,
      ]);
    }
    for (const equipamento of dados.equipamentos) {
      await db.runAsync('INSERT INTO equipamentos (id, marca, modelo, id_cliente) VALUES (?, ?, ?, ?)', [
        equipamento.id,
        equipamento.marca,
        equipamento.modelo,
        equipamento.clienteId,
      ]);
    }
  });
}

export async function contarLocal(): Promise<number> {
  const db = await banco();
  const linha = await db.getFirstAsync<{ total: number }>('SELECT COUNT(*) AS total FROM ordens');
  return linha?.total ?? 0;
}

export async function listarPendentes(): Promise<Pendente[]> {
  const db = await banco();
  const linhas = await db.getAllAsync<LinhaPendente>(
    'SELECT id, id_equipamento, descricao_defeito, valor_total FROM pendentes ORDER BY id',
  );
  return linhas.map((linha) => ({
    id: linha.id,
    equipamentoId: linha.id_equipamento,
    descricaoDefeito: linha.descricao_defeito,
    valorTotal: linha.valor_total,
  }));
}

export async function guardarPendente(dados: Omit<Pendente, 'id'>): Promise<Pendente> {
  const db = await banco();
  const resultado = await db.runAsync(
    'INSERT INTO pendentes (id_equipamento, descricao_defeito, valor_total) VALUES (?, ?, ?)',
    [dados.equipamentoId, dados.descricaoDefeito, dados.valorTotal],
  );
  return { id: resultado.lastInsertRowId, ...dados };
}

export async function removerPendente(id: number): Promise<void> {
  const db = await banco();
  await db.runAsync('DELETE FROM pendentes WHERE id = ?', [id]);
}
