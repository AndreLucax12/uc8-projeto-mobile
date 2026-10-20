# Roteiro de teste - TechOS Mobile

Cada caso tem os passos, o resultado esperado e o resultado observado. A coluna "Onde e quando" diz em que
aparelho e em que data o caso foi executado. Um caso com falha ganha a correção e é executado de novo; a linha
registra as duas execuções.

Legenda do resultado: **aprovado** (o observado é o esperado), **falha** (não é), **corrigido** (falhou, foi
corrigido e aprovado na repetição), **não executado**.

No Expo Go, o aplicativo só abre com rede (o código vem do computador). Os casos sem rede foram executados com o
aplicativo já aberto, desligando a rede e tocando em **Recarregar**, que roda o mesmo caminho da abertura. Os casos
que exigem abrir o aplicativo sem rede ficam para o APK (ou para o Expo Go pelo cabo USB).

| # | Caso | Passos | Esperado | Resultado | Onde e quando | Correção |
|---|---|---|---|---|---|---|
| C01 | Carga com rede | Abrir o aplicativo com rede | Lista com as OS da nuvem, cada uma com `Cliente — Marca Modelo`, sem aviso acima dela | aprovado | aparelho (Expo Go), 17/10/2026 | - |
| C02 | Nova OS válida | Nova OS; escolher cliente e equipamento; descrever o defeito; Abrir OS | Volta à lista com a OS nova no topo, status `aberta`; a OS aparece na tabela `ordens_servico` do Supabase | aprovado | aparelho (Expo Go), 17/10/2026 | - |
| C03 | Nova OS recusada pela nuvem | Trocar uma letra da chave publicável no `.env.local`; reiniciar o `npx expo start`; Nova OS; Abrir OS | `O servidor recusou a operação (401).` na tela de cadastro; linha `[cadastro] api: ErroDaApi 401: Invalid API key` no console | não executado | - | - |
| C04 | Validação da Nova OS | Nova OS; escrever e apagar o defeito; valor `abc` | `Descreva o defeito` e `Informe um valor, zero ou maior` nos campos; Abrir OS desabilitado; sem equipamento escolhido, Abrir OS desabilitado | aprovado | aparelho (APK), 20/10/2026 | - |
| C05 | Recarregar sem rede, com cache | Carregar uma vez com rede; desligar Wi-Fi e dados; Recarregar | Lista do aparelho com o aviso `Mostrando as ordens guardadas no aparelho: Sem conexão com o servidor. Verifique a rede e tente de novo.` | aprovado | aparelho (Expo Go), 17/10/2026 | - |
| C06 | Abrir sem rede, com cache | Carregar uma vez com rede; desligar a rede; fechar e abrir o aplicativo | Lista do aparelho com o mesmo aviso de C05 | aprovado | aparelho (APK), 20/10/2026 | - |
| C07 | Abrir sem rede, sem cache | Instalação nova; sem rede; abrir | Tela de erro com `Sem conexão com o servidor. Verifique a rede e tente de novo.` e o botão Tentar de novo | aprovado | aparelho (APK), 20/10/2026 | - |
| C08 | Nova OS sem rede | Sem rede (como em C05); Nova OS; Abrir OS | Volta à lista com a linha `A enviar (1): ...` acima dela; a OS fica guardada no aparelho | aprovado | aparelho (Expo Go), 17/10/2026 | - |
| C09 | Sincronização | Depois de C08, ligar a rede; Recarregar | A linha `A enviar` some; a OS está na lista com número dado pelo banco (a #24) e na tabela do Supabase | aprovado | aparelho (Expo Go), 17/10/2026 | - |
| C10 | Detalhe da OS | Tocar em "Ver detalhes" | Tela com defeito, equipamento, cliente com telefone, valor e data, sem nova leitura da nuvem | aprovado | aparelho (APK), 20/10/2026 | - |
| C11 | Busca por cliente | Aba Busca; digitar `andre` (sem acento); depois o filtro `Finalizada` | Só as OS do André Lucas Lira Viana; o filtro de status reduz a lista; "Ver detalhes" abre o detalhe na aba Ordens | aprovado | aparelho (APK), 20/10/2026 | - |
| C12 | Clientes | Aba Clientes | Cada cliente com o telefone formatado `(84) 9XXXX-XXXX` e os seus equipamentos | aprovado | aparelho (APK), 20/10/2026 | - |
| C13 | Contagem na tela Sobre | Aba Sobre depois de uma carga com rede | `Guardadas no aparelho: N`, com N igual ao número de OS da lista | aprovado | aparelho (APK), 20/10/2026 | - |
| C14 | Mesmo banco do TechOS Desktop | Abrir uma OS no celular; recarregar o TechOS Desktop | A OS aparece no Desktop; uma OS aberta no Desktop aparece no celular depois de Recarregar | aprovado | aparelho (APK), 20/10/2026 | - |
| C15 | Banco do aparelho indisponível | Banco que não abre (simulado com o SQL de criação quebrado em `src/banco/banco.ts`) | Lista da nuvem continua; Sobre mostra `indisponível`; linhas `[...] banco:` no console | não executado | - | - |
| C16 | Voltar da pilha | Detalhe; botão de voltar do aparelho | Lista no mesmo estado, sem recarga | aprovado | aparelho (APK), 20/10/2026 | - |
| C17 | Tela larga | Lista em pé e deitada (ou tablet) | Uma coluna em pé; duas a partir de 600 dp de largura | falha | aparelho (APK), 20/10/2026 | A tela não girou: `orientation` estava `portrait` no `app.json`, o que trava o aplicativo em pé; trocado para `default`, a repetir no novo APK |
