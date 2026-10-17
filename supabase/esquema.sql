-- Esquema do TechOS Mobile no Supabase. Cole inteiro no SQL Editor do projeto e execute uma vez.
-- As tres tabelas sao as do TechOS Desktop (sql/schema.sql), com o id gerado pelo banco.

create table public.clientes (
  id bigint generated always as identity primary key,
  nome text not null,
  telefone text not null
);

create table public.equipamentos (
  id bigint generated always as identity primary key,
  marca text not null,
  modelo text not null,
  id_cliente bigint not null references public.clientes (id) on delete restrict
);

create table public.ordens_servico (
  id bigint generated always as identity primary key,
  id_equipamento bigint not null references public.equipamentos (id) on delete restrict,
  descricao_defeito text not null,
  status text not null default 'aberta' check (status in ('aberta', 'em andamento', 'finalizada')),
  valor_total numeric(10, 2) not null default 0,
  data_abertura timestamptz not null default now()
);

alter table public.clientes enable row level security;
alter table public.equipamentos enable row level security;
alter table public.ordens_servico enable row level security;

-- O aplicativo le as tres tabelas e so inclui ordens de servico.
create policy "leitura anonima" on public.clientes for select to anon using (true);
create policy "leitura anonima" on public.equipamentos for select to anon using (true);
create policy "leitura anonima" on public.ordens_servico for select to anon using (true);
create policy "inclusao anonima" on public.ordens_servico for insert to anon with check (true);

grant usage on schema public to anon;
grant select on public.clientes, public.equipamentos to anon;
grant select, insert on public.ordens_servico to anon;
grant usage, select on sequence public.ordens_servico_id_seq to anon;

-- Dados ficticios: nenhum dado pessoal real entra no banco.
insert into public.clientes (nome, telefone) values
  ('Pedro Ezequiel', '84991234567'),
  ('Maria Fernanda Souza', '84987654321'),
  ('Pablo Pontes da Silva', '8433215566');

insert into public.equipamentos (marca, modelo, id_cliente) values
  ('Samsung', 'Galaxy A54', 1),
  ('Xiaomi', 'POCO X8 Pro', 2),
  ('Motorola', 'Moto G84', 3),
  ('Apple', 'iPhone 13', 1);

insert into public.ordens_servico (id_equipamento, descricao_defeito, status, valor_total) values
  (1, 'Tela quebrada', 'aberta', 350),
  (2, 'Não liga', 'em andamento', 180),
  (3, 'Bateria estufada', 'finalizada', 220);

-- Endurecimento: o papel anon so le e inclui. Apagar e alterar ja eram barrados pela RLS (nao ha politica
-- para isso); o revoke tira tambem o privilegio que o projeto concede por padrao, e a API passa a recusar.
revoke update, delete on public.clientes, public.equipamentos, public.ordens_servico from anon;
