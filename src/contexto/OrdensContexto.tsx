import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { guardarLocal, listarLocal } from '../banco/banco';
import { descreverErro } from '../servicos/api';
import { carregarClientes, carregarEquipamentos } from '../servicos/clientesServico';
import { carregarOrdens, incluirOrdem } from '../servicos/ordensServico';
import type { Cliente, Equipamento, OrdemServicoDetalhada } from '../types/entidades';

interface Dados {
  ordens: OrdemServicoDetalhada[];
  clientes: Cliente[];
  equipamentos: Equipamento[];
}

export type EstadoOrdens =
  | { tipo: 'carregando' }
  | { tipo: 'erro'; mensagem: string }
  | ({ tipo: 'pronto'; origem: 'nuvem' } & Dados)
  | ({ tipo: 'pronto'; origem: 'aparelho'; motivo: string } & Dados);

// O que a tela Nova OS entrega: o banco define o id, o status e a data.
export interface DadosNovaOS {
  equipamentoId: number;
  descricaoDefeito: string;
  valorTotal: number;
}

interface ValorDasOrdens {
  estado: EstadoOrdens;
  recarregar: () => void;
  incluir: (dados: DadosNovaOS) => Promise<OrdemServicoDetalhada>;
  buscar: (id: number) => OrdemServicoDetalhada | undefined;
}

const OrdensContexto = createContext<ValorDasOrdens | undefined>(undefined);

export function OrdensProvedor({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoOrdens>({ tipo: 'carregando' });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;
    setEstado({ tipo: 'carregando' });
    Promise.all([carregarOrdens(), carregarClientes(), carregarEquipamentos()])
      .then(([ordens, clientes, equipamentos]) => {
        if (!cancelado) {
          setEstado({ tipo: 'pronto', origem: 'nuvem', ordens, clientes, equipamentos });
        }
        // Guarda no aparelho o que veio da nuvem; uma falha aqui não atrapalha a lista.
        guardarLocal({ ordens, clientes, equipamentos }).catch((erro: unknown) => {
          console.warn('Não foi possível guardar no aparelho: ' + descreverErro(erro));
        });
      })
      .catch((erro: unknown) => {
        // Sem a nuvem, a lista vem do que o aparelho guardou na última carga com rede.
        const motivo = descreverErro(erro);
        listarLocal()
          .then((guardados) => {
            if (cancelado) {
              return;
            }
            if (guardados.ordens.length > 0) {
              setEstado({ tipo: 'pronto', origem: 'aparelho', motivo, ...guardados });
            } else {
              setEstado({ tipo: 'erro', mensagem: motivo });
            }
          })
          .catch((erroLocal: unknown) => {
            if (!cancelado) {
              setEstado({ tipo: 'erro', mensagem: motivo + ' / ' + descreverErro(erroLocal) });
            }
          });
      });
    return () => {
      cancelado = true;
    };
  }, [tentativa]);

  function recarregar() {
    setTentativa(tentativa + 1);
  }

  async function incluir(dados: DadosNovaOS): Promise<OrdemServicoDetalhada> {
    const nova = await incluirOrdem({
      id_equipamento: dados.equipamentoId,
      descricao_defeito: dados.descricaoDefeito,
      valor_total: dados.valorTotal,
    });
    setEstado((atual) => (atual.tipo === 'pronto' ? { ...atual, ordens: [nova, ...atual.ordens] } : atual));
    return nova;
  }

  function buscar(id: number): OrdemServicoDetalhada | undefined {
    return estado.tipo === 'pronto' ? estado.ordens.find((ordem) => ordem.id === id) : undefined;
  }

  return <OrdensContexto.Provider value={{ estado, recarregar, incluir, buscar }}>{children}</OrdensContexto.Provider>;
}

export function useOrdens(): ValorDasOrdens {
  const valor = useContext(OrdensContexto);
  if (valor === undefined) {
    throw new Error('useOrdens só funciona dentro de OrdensProvedor');
  }
  return valor;
}
