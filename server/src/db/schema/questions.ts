import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { rooms } from "./rooms.ts";

export const questions = pgTable("questions", {
  id: uuid().primaryKey().defaultRandom(),
  // Identificador único da questão (UUID v4 gerado pelo BD)

  roomId: uuid()
    .references(() => rooms.id)
    .notNull(),
  // Sala à qual este Q/A pertence.

  question: text().notNull(),
  // Texto da pergunta feita pelo usuário.

  answer: text(),
  // Resposta opcional gerada pelo assistente.

  createdAt: timestamp().defaultNow().notNull(),
  // Timestamp de criação. Padrão: agora.
});
