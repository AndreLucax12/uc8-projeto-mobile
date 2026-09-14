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

### O que fica de fora

Ficam de fora o módulo financeiro (pagamentos, notas fiscais) e o controle de estoque de
peças do TechOS; o aplicativo cobre só o fluxo de abertura e acompanhamento de OS.
