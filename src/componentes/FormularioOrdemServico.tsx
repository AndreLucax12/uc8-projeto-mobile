import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { cores, espacos, raio } from '../tema/tema';
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
        placeholderTextColor={cores.textoSecundario}
        placeholder="Descrição do defeito"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        style={estilos.campo}
        placeholderTextColor={cores.textoSecundario}
        placeholder="Nº do equipamento"
        keyboardType="numeric"
        value={equipamentoId}
        onChangeText={setEquipamentoId}
      />
      <TextInput
        style={estilos.campo}
        placeholderTextColor={cores.textoSecundario}
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
  formulario: { marginBottom: espacos.md },
  campo: {
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio,
    color: cores.texto,
    padding: espacos.sm + espacos.xs,
    marginBottom: espacos.sm,
  },
  botao: { backgroundColor: cores.primaria, borderRadius: raio, padding: espacos.sm + espacos.xs, alignItems: 'center' },
  textoBotao: { color: cores.textoClaro, fontWeight: 'bold' },
});