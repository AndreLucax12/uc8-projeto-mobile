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

// '2026-09-20' ou '2026-09-20T01:22:24Z' -> 20/09/2026.
export function formatarData(data: string): string {
  const [ano, mes, dia] = data.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}
