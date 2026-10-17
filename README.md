# uc8-projeto-mobile

Aplicativo mobile da UC8, por André Lucas. Recorte do sistema TechOS, da UC5.

## O recorte

**Sistema de origem:** TechOS, sistema de gestão de ordens de serviço de uma assistência
técnica de eletrônicos, desenvolvido na UC5.

### Entidades

- **Cliente** — `id`, `nome`, `telefone`.
- **Equipamento** — `id`, `marca`, `modelo`, `clienteId` (o cliente dono do equipamento).
- **OrdemServico** — `id`, `equipamentoId` (o equipamento em conserto), `descricaoDefeito`,
  `status` (`'aberta' | 'em andamento' | 'finalizada'`), `valorTotal`, `dataAbertura`.

### Telas

1. **Lista de ordens de serviço** — mostra todas as OS, com status e equipamento.
2. **Detalhe da ordem de serviço** — mostra os dados completos de uma OS específica.
3. **Nova ordem de serviço** — formulário para abrir uma OS para um equipamento.
4. **Lista de clientes** — mostra os clientes cadastrados e seus equipamentos.
5. **Detalhe do cliente** — mostra os dados do cliente e o histórico de OS dele.

## Configuração

O aplicativo lê a URL do projeto e a chave publicável do Supabase de um arquivo `.env.local`,
que não vai para o repositório. Copie `.env.example` para `.env.local` e use estes valores:

```
EXPO_PUBLIC_SUPABASE_URL=https://tpxjtreuugisnovubwqy.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sb_publishable_w-xhI-cc2C2v8AiJopcSIg_YtRR9gJt
```

A chave publicável só lê as três tabelas e inclui ordens de serviço: a segurança por linha (RLS) e o
`revoke` de `supabase/esquema.sql` barram alterar e apagar. O esquema e os dados de exemplo (fictícios)
estão em `supabase/esquema.sql` e `supabase/dados_techos.sql`.

### O que fica de fora

Ficam de fora o módulo financeiro (pagamentos, notas fiscais) e o controle de estoque de
peças do TechOS; o aplicativo cobre só o fluxo de abertura e acompanhamento de OS.
