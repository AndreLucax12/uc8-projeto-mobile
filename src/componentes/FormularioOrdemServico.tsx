import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Botao } from './Botao';
import { Campo } from './Campo';
import type { DadosNovaOS } from '../contexto/OrdensContexto';
import { espacos } from '../tema/tema';

interface FormularioOrdemServicoProps {
  aoAdicionar: (dados: DadosNovaOS) => void;
}

export function FormularioOrdemServico({ aoAdicionar }: FormularioOrdemServicoProps) {
  const [descricao, setDescricao] = useState('');
  const [equipamentoId, setEquipamentoId] = useState('');
  const [valor, setValor] = useState('0');
  const [tocado, setTocado] = useState(false);

  // Como no TechOS Desktop: a OS nasce aberta, com o defeito e o equipamento obrigatórios.
  const descricaoVazia = descricao.trim() === '';
  const erroDescricao = tocado && descricaoVazia ? 'Descreva o defeito' : undefined;

  const numeroEquipamento = Number(equipamentoId);
  const equipamentoInvalido =
    equipamentoId.trim() === '' || !Number.isInteger(numeroEquipamento) || numeroEquipamento <= 0;
  const erroEquipamento =
    equipamentoId.trim() !== '' && equipamentoInvalido ? 'Informe o número do equipamento' : undefined;

  // Aceita vírgula como separador decimal: "150,50" vira 150.5.
  const valorNumero = Number(valor.replace(',', '.'));
  const valorInvalido = valor.trim() === '' || Number.isNaN(valorNumero) || valorNumero < 0;
  const erroValor = valorInvalido ? 'Informe um valor, zero ou maior' : undefined;

  function mudarDescricao(texto: string) {
    setTocado(true);
    setDescricao(texto);
  }

  function enviar() {
    // A OS nasce "aberta", com a data de hoje: quem define é o banco.
    aoAdicionar({
      descricaoDefeito: descricao.trim(),
      equipamentoId: numeroEquipamento,
      valorTotal: valorNumero,
    });
    setDescricao('');
    setEquipamentoId('');
    setValor('0');
    setTocado(false);
  }

  return (
    <View style={estilos.formulario}>
      <Campo rotulo="Defeito" valor={descricao} aoMudar={mudarDescricao} erro={erroDescricao} varias />
      <Campo
        rotulo="Nº do equipamento"
        valor={equipamentoId}
        aoMudar={setEquipamentoId}
        erro={erroEquipamento}
        tipoDeTeclado="numeric"
      />
      <Campo rotulo="Valor orçado (R$)" valor={valor} aoMudar={setValor} erro={erroValor} tipoDeTeclado="numeric" />
      <View style={estilos.acoes}>
        <Botao
          titulo="Abrir OS"
          onPress={enviar}
          desabilitado={descricaoVazia || equipamentoInvalido || valorInvalido}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  formulario: { marginBottom: espacos.md },
  acoes: { flexDirection: 'row', marginTop: espacos.sm },
});
