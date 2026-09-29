import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { OrdemServico } from '../types/entidades';

// Os campos da OS sem o id: quem guarda a lista define o id.
export type DadosOrdemServico = Omit<OrdemServico, 'id'>;

interface FormularioOrdemServicoProps {
  aoAdicionar: (dados: DadosOrdemServico) => void;
}

export function FormularioOrdemServico({ aoAdicionar }: FormularioOrdemServicoProps) {
  const [descricao, setDescricao] = useState('');
  const [equipamentoId, setEquipamentoId] = useState('');
  const [valor, setValor] = useState('');

  function enviar() {
    aoAdicionar({
      descricaoDefeito: descricao,
      equipamentoId: Number(equipamentoId),
      valorTotal: Number(valor),
      status: 'aberta',
      dataAbertura: new Date().toISOString().slice(0, 10),
    });
    setDescricao('');
    setEquipamentoId('');
    setValor('');
  }

  return (
    <View style={estilos.formulario}>
      <TextInput
        style={estilos.campo}
        placeholder="Descrição do defeito"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        style={estilos.campo}
        placeholder="Nº do equipamento"
        keyboardType="numeric"
        value={equipamentoId}
        onChangeText={setEquipamentoId}
      />
      <TextInput
        style={estilos.campo}
        placeholder="Valor total"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />
      <Pressable style={estilos.botao} onPress={enviar}>
        <Text style={estilos.textoBotao}>Abrir OS</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  formulario: { marginBottom: 16 },
  campo: { backgroundColor: '#fff', borderRadius: 6, padding: 10, marginBottom: 8 },
  botao: { backgroundColor: '#004A8D', borderRadius: 6, padding: 12, alignItems: 'center' },
  textoBotao: { color: '#fff', fontWeight: 'bold' },
});