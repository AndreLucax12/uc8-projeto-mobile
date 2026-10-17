-- Importação dos dados do TechOS Desktop (Neon) para o Supabase. Cole inteiro no SQL Editor e execute uma vez.
-- Apaga os dados de exemplo do esquema.sql e insere os do TechOS com os mesmos ids, para manter as ligações.
-- Todos os dados são fictícios.

begin;

delete from public.ordens_servico;
delete from public.equipamentos;
delete from public.clientes;

insert into public.clientes (id, nome, telefone) overriding system value values
  (1, 'André Lucas Lira Viana', '(84) 98896-0000'),
  (5, 'Pedro Ezequiel', '(84) 96584-2365'),
  (11, 'Samuel', '(84) 98729-7965'),
  (12, 'Pablo Alejandro Pontes Da Silva', '(84) 98131-0224');

insert into public.equipamentos (id, marca, modelo, id_cliente) overriding system value values
  (5, 'Xiaomi', 'POCO X8 pro', 1),
  (6, 'Samsung', 'A32', 5),
  (9, 'Lenovo', 'PC', 12),
  (10, 'Lenovo', 'Ideapad', 5),
  (12, 'IPHONE', '17', 12);

insert into public.ordens_servico (id, id_equipamento, descricao_defeito, status, valor_total, data_abertura) overriding system value values
  (16, 9, 'O mesmo não está lingando pelo botão Power. resolver.', 'finalizada', 120, '2026-08-26T01:22:24.243Z'),
  (17, 5, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'finalizada', 50, '2026-08-27T00:43:53.110Z'),
  (18, 10, 'ijihybybnk', 'finalizada', 100, '2026-08-27T01:26:06.292Z'),
  (20, 10, 'htvcrxcrvtxeerghj', 'finalizada', 50, '2026-09-02T02:04:19.684Z'),
  (21, 12, 'SDANBDYISKSBFYUSFSAFYAUAPBI', 'finalizada', 150, '2026-09-02T02:20:09.862Z');

-- Os contadores de id continuam a partir do maior id importado: a próxima OS criada pelo app não repete número.
select setval(pg_get_serial_sequence('public.clientes', 'id'), coalesce((select max(id) from public.clientes), 1), (select count(*) > 0 from public.clientes));
select setval(pg_get_serial_sequence('public.equipamentos', 'id'), coalesce((select max(id) from public.equipamentos), 1), (select count(*) > 0 from public.equipamentos));
select setval(pg_get_serial_sequence('public.ordens_servico', 'id'), coalesce((select max(id) from public.ordens_servico), 1), (select count(*) > 0 from public.ordens_servico));

commit;
