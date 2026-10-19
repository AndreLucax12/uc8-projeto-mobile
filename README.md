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

A navegação tem quatro abas; a aba Ordens tem uma pilha própria.

1. **Ordens** (aba Ordens) — lista das OS, com cliente, equipamento e status. Mostra o aviso quando a lista
   vem do aparelho e a linha `A enviar (N)` quando há OS na fila de sincronização.
2. **Detalhe da OS** (pilha) — defeito, equipamento, cliente com telefone, valor e data de uma OS.
3. **Nova OS** (pilha) — formulário com cliente, equipamento, defeito e valor. Sem rede, a OS vai para a
   fila e é enviada na próxima carga com rede.
4. **Clientes** (aba Clientes) — clientes com o telefone formatado e os equipamentos de cada um.
5. **Busca** (aba Busca) — busca das OS pelo nome do cliente, sem diferenciar acento, com filtro de status;
   "Ver detalhes" abre o detalhe na aba Ordens.
6. **Sobre** (aba Sobre) — o recorte e quantas OS estão guardadas no aparelho.

### Dados

As OS vêm do Supabase por `fetch` (`src/servicos`). Cada carga com rede é guardada no aparelho com o
`expo-sqlite` (`src/banco/banco.ts`); sem rede, a lista vem do aparelho com um aviso. As OS abertas sem
rede ficam numa fila no aparelho até a próxima carga com rede. Os erros são classificados em
`src/erros/erros.ts`, e a mensagem de cada um aparece na tela.

### O que fica de fora

Ficam de fora o módulo financeiro (pagamentos, notas fiscais) e o controle de estoque de
peças do TechOS; o aplicativo cobre só o fluxo de abertura e acompanhamento de OS.

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

## Como rodar

Com o Node instalado, na pasta do projeto:

```
npm install
npx expo start
```

O QR code que aparece abre o aplicativo no Expo Go. Para conferir o código: `npx tsc --noEmit`.

## Instalar o APK

O APK é gerado na nuvem pelo EAS, com o perfil `preview` do `eas.json` (pacote `com.andrelucax12.techos`).
A URL e a chave do Supabase ficam nas variáveis de ambiente do projeto no EAS, no ambiente `preview`, porque
o `.env.local` não vai para a nuvem.

```
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile preview
```

No fim do build, o painel do projeto em https://expo.dev mostra o link e o QR code do APK. Baixe pelo
celular Android e, quando o Android pedir, permita instalar apps de fontes desconhecidas. O aplicativo
instalado abre sem o Expo Go e sem o computador.

## Teste

O roteiro de teste, com os casos executados, está em `docs/roteiro_de_teste.md`.
