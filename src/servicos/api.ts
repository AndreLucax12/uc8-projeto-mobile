// Acesso à API de dados do Supabase: a URL e a chave publicável vêm do .env.local.

export class ErroDaApi extends Error {
  readonly status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.name = 'ErroDaApi';
    this.status = status;
  }
}

export function descreverErro(erro: unknown): string {
  if (erro instanceof ErroDaApi) {
    return `A API respondeu ${erro.status}: ${erro.message}`;
  }
  if (erro instanceof Error) {
    return erro.message;
  }
  return 'Erro desconhecido';
}

function ehMensagemDeErro(valor: unknown): valor is { message: string } {
  return typeof valor === 'object' && valor !== null && typeof (valor as Record<string, unknown>).message === 'string';
}

async function lerMensagemDeErro(resposta: Response): Promise<string> {
  const corpo: unknown = await resposta.json().catch(() => undefined);
  return ehMensagemDeErro(corpo) ? corpo.message : 'sem detalhe no corpo da resposta';
}

function configuracao(): { url: string; chave: string } {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const chave = process.env.EXPO_PUBLIC_SUPABASE_KEY;
  if (url === undefined || chave === undefined) {
    throw new Error('Defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_KEY em .env.local');
  }
  return { url, chave };
}

export async function requisitar(caminho: string, metodo: 'GET' | 'POST' = 'GET', corpo?: object): Promise<unknown> {
  const { url, chave } = configuracao();
  const resposta = await fetch(`${url}/rest/v1/${caminho}`, {
    method: metodo,
    headers: { apikey: chave, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  if (!resposta.ok) {
    throw new ErroDaApi(resposta.status, await lerMensagemDeErro(resposta));
  }
  return resposta.json();
}

// Ajuda dos type guards: lê um campo de um objeto que ainda é unknown.
export function campos(valor: unknown): Record<string, unknown> | undefined {
  return typeof valor === 'object' && valor !== null ? (valor as Record<string, unknown>) : undefined;
}
