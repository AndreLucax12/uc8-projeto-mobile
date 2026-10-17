// Mesmo formato do TechOS Desktop: (84) 99123-4567 ou (84) 3321-5566.
export function formatarTelefone(telefone: string): string {
  const digitos = telefone.replace(/\D/g, '');
  if (digitos.length === 11) return digitos.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  if (digitos.length === 10) return digitos.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  return telefone;
}

// 350 -> R$ 350,00, sem depender do Intl do aparelho.
export function formatarMoeda(valor: number): string {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function doisDigitos(numero: number): string {
  return String(numero).padStart(2, '0');
}

// '2026-08-26T01:22:24+00:00' -> 25/08/2026: a data no fuso do aparelho, como o TechOS Desktop mostra.
export function formatarData(data: string): string {
  const momento = new Date(data);
  if (Number.isNaN(momento.getTime())) {
    return data;
  }
  return `${doisDigitos(momento.getDate())}/${doisDigitos(momento.getMonth() + 1)}/${momento.getFullYear()}`;
}

// Para a busca: sem acento e sem diferença de maiúscula ("André" encontra "andre").
export function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}
