import { drizzle } from "drizzle-orm/postgres-js";
// A função `drizzle` adapta um cliente postgres-js para o Drizzle ORM, permitindo queries tipadas.

import postgres from "postgres";
// O export padrão de `postgres` cria um pool/cliente de conexão com PostgreSQL.

import { env } from "../env.ts";
// Importa variáveis de ambiente validadas (como DATABASE_URL) do módulo de env validado com Zod.

import { schema } from "./schema/index.ts";
// Importa as definições do esquema do banco para o Drizzle inferir tipos e mapear tabelas.

export const sql = postgres(env.DATABASE_URL);
// Inicializa um cliente postgres-js usando a DATABASE_URL do ambiente.
// Este cliente gerencia as conexões e a execução de queries.

export const db = drizzle(sql, {
  schema,
  casing: "camelCase",
});
// Envolve o cliente postgres-js com o Drizzle ORM, fornecendo:
// - `schema`: habilita queries tipadas e conhecimento das tabelas
// - `casing: "camelCase"`: mapeia colunas snake_case para campos camelCase nos resultados
