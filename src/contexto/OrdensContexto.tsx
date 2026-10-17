import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  guardarLocal,
  guardarPendente,
  listarLocal,
  listarPendentes,
  removerPendente,
  type Pendente,
} from '../banco/banco';
import { ErroDeValidacao, registrarErro } from '../erros/erros';
import { ErroDaApi } from '../servicos/api';
import { carregarClientes, carregarEquipamentos } from '../servicos/clientesServico';
import { carregarOrdens, incluirOrdem, type DadosNovaOrdem } from '../servicos/ordensServico';
import type { Cliente, Equipamento, OrdemServicoDetalhada } from '../types/entidades';

interface Dados {
  ordens: OrdemServicoDetalhada[];
  clientes: Cliente[];
  equipamentos: Equipamento[];
  pendentes: Pendente[];
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
  incluir: (dados: DadosNovaOS) => Promise<void>;
  buscar: (id: number) => OrdemServicoDetalhada | undefined;
}

const OrdensContexto = createContext<ValorDasOrdens | undefined>(undefined);

function paraEnvio(dados: DadosNovaOS): DadosNovaOrdem {
  return {
    id_equipamento: dados.equipamentoId,
    descricao_defeito: dados.descricaoDefeito,
    valor_total: dados.valorTotal,
  };
}

export function OrdensProvedor({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoOrdens>({ tipo: 'carregando' });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;
    setEstado({ tipo: 'carregando' });
    // Primeiro envia o que ficou na fila; depois lê a nuvem, que já traz as OS enviadas.
    // Cada etapa que pode falhar tem o próprio catch: o banco falhar não impede a lista da nuvem.
    sincronizar()
      .catch((erro: unknown) => {
        registrarErro('sincronizar', erro);
      })
      .then(() => Promise.all([carregarOrdens(), carregarClientes(), carregarEquipamentos()]))
      .then(async ([ordens, clientes, equipamentos]) => {
        const pendentes = await listarPendentes().catch((erro: unknown) => {
          registrarErro('pendentes', erro);
          return [];
        });
        if (!cancelado) {
          setEstado({ tipo: 'pronto', origem: 'nuvem', ordens, clientes, equipamentos, pendentes });
        }
        guardarLocal({ ordens, clientes, equipamentos }).catch((erro: unknown) => {
          registrarErro('guardar no aparelho', erro);
        });
      })
      .catch((erro: unknown) => {
        // Sem a nuvem, a lista vem do que o aparelho guardou na última carga com rede.
        const motivo = registrarErro('carga', erro).mensagem;
        Promise.all([listarLocal(), listarPendentes()])
          .then(([guardados, pendentes]) => {
            if (cancelado) {
              return;
            }
            if (guardados.ordens.length > 0 || pendentes.length > 0) {
              setEstado({ tipo: 'pronto', origem: 'aparelho', motivo, ...guardados, pendentes });
            } else {
              setEstado({ tipo: 'erro', mensagem: motivo });
            }
          })
          .catch((erroLocal: unknown) => {
            if (!cancelado) {
              setEstado({ tipo: 'erro', mensagem: registrarErro('leitura do aparelho', erroLocal).mensagem });
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

  // Envia cada pendente e o tira da fila. Sem rede, para no primeiro e tenta no próximo início;
  // recusado pela API (dado inválido), é descartado para não travar a fila.
  async function sincronizar(): Promise<void> {
    for (const pendente of await listarPendentes()) {
      try {
        await incluirOrdem(paraEnvio(pendente));
      } catch (erro: unknown) {
        if (erro instanceof ErroDaApi) {
          registrarErro('pendente descartado', erro);
        } else {
          return;
        }
      }
      await removerPendente(pendente.id);
    }
  }

  async function incluir(dados: DadosNovaOS): Promise<void> {
    // A tela valida para orientar; o provedor valida de novo para garantir.
    if (!Number.isInteger(dados.equipamentoId) || dados.equipamentoId <= 0) {
      throw new ErroDeValidacao('Escolha o equipamento da OS.');
    }
    if (dados.descricaoDefeito.trim() === '') {
      throw new ErroDeValidacao('Descreva o defeito.');
    }
    if (!Number.isFinite(dados.valorTotal) || dados.valorTotal < 0) {
      throw new ErroDeValidacao('O valor precisa ser zero ou maior.');
    }
    try {
      const nova = await incluirOrdem(paraEnvio(dados));
      setEstado((atual) => (atual.tipo === 'pronto' ? { ...atual, ordens: [nova, ...atual.ordens] } : atual));
    } catch (erro: unknown) {
      // A API recusou: o erro vai para a tela. Sem rede: a OS entra na fila do aparelho.
      if (erro instanceof ErroDaApi) {
        throw erro;
      }
      const pendente = await guardarPendente(dados);
      setEstado((atual) =>
        atual.tipo === 'pronto' ? { ...atual, pendentes: [...atual.pendentes, pendente] } : atual,
      );
    }
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
