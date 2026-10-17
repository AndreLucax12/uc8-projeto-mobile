import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Botao } from './Botao';
import { Campo } from './Campo';
import { Opcoes } from './Opcoes';
import type { DadosNovaOS } from '../contexto/OrdensContexto';
import { espacos } from '../tema/tema';
import type { Cliente, Equipamento } from '../types/entidades';

interface FormularioOrdemServicoProps {
  clientes: Cliente[];
  equipamentos: Equipamento[];
  aoAdicionar: (dados: DadosNovaOS) => void;
}

export function FormularioOrdemServico({ clientes, equipamentos, aoAdicionar }: FormularioOrdemServicoProps) {
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [equipamentoId, setEquipamentoId] = useState<number | null>(null);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('0');
  const [tocado, setTocado] = useState(false);

  // Como no TechOS Desktop: primeiro o cliente, depois um dos equipamentos dele.
  const equipamentosDoCliente = equipamentos.filter((equipamento) => equipamento.clienteId === clienteId);

  const descricaoVazia = descricao.trim() === '';
  const erroDescricao = tocado && descricaoVazia ? 'Descreva o defeito' : undefined;

  // Aceita vírgula como separador decimal: "150,50" vira 150.5.
  const valorNumero = Number(valor.replace(',', '.'));
  const valorInvalido = valor.trim() === '' || Number.isNaN(valorNumero) || valorNumero < 0;
  const erroValor = valorInvalido ? 'Informe um valor, zero ou maior' : undefined;

  function escolherCliente(id: number) {
    setClienteId(id);
    setEquipamentoId(null);
  }

  function mudarDescricao(texto: string) {
    setTocado(true);
    setDescricao(texto);
  }

  function enviar() {
    if (equipamentoId === null) {
      return;
    }
    // A OS nasce "aberta", com a data de hoje: quem define é o banco.
    aoAdicionar({ equipamentoId, descricaoDefeito: descricao.trim(), valorTotal: valorNumero });
  }

  return (
    <View style={estilos.formulario}>
      <Opcoes
        rotulo="Cliente"
        opcoes={clientes.map((cliente) => ({ id: cliente.id, rotulo: cliente.nome }))}
        selecionada={clienteId}
        aoEscolher={escolherCliente}
        vazio="Nenhum cliente cadastrado."
      />
      {clienteId !== null && (
        <Opcoes
          rotulo="Equipamento"
          opcoes={equipamentosDoCliente.map((e) => ({ id: e.id, rotulo: `${e.marca} ${e.modelo}` }))}
          selecionada={equipamentoId}
          aoEscolher={setEquipamentoId}
          vazio="Este cliente não tem equipamento cadastrado."
        />
      )}
      <Campo rotulo="Defeito" valor={descricao} aoMudar={mudarDescricao} erro={erroDescricao} varias />
      <Campo rotulo="Valor orçado (R$)" valor={valor} aoMudar={setValor} erro={erroValor} tipoDeTeclado="numeric" />
      <View style={estilos.acoes}>
        <Botao
          titulo="Abrir OS"
          onPress={enviar}
          desabilitado={equipamentoId === null || descricaoVazia || valorInvalido}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  formulario: { marginBottom: espacos.md },
  acoes: { flexDirection: 'row', marginTop: espacos.sm },
});
