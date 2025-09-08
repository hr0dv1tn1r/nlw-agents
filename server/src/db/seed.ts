import { reset, seed } from "drizzle-seed";
import { db, sql } from "./connection.ts";
import { schema } from "./schema/index.ts";

await reset(db, schema);
// Limpa e recria as tabelas com base no schema (somente para desenvolvimento).

await seed(db, schema).refine((f) => {
  return {
    rooms: {
      count: 20,
      columns: {
        name: f.companyName(),
        description: f.loremIpsum(),
      },
    },
  };
});
// Popula a tabela `rooms` com 20 registros falsos (faker).

await sql.end();
// Encerra o pool de conexões.

// biome-ignore lint/suspicious/noConsole: only used in dev
console.log("Database seeded");
