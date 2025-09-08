import { pgTable, text, timestamp, uuid, vector } from "drizzle-orm/pg-core";
import { rooms } from "./rooms.ts";

export const audioChunks = pgTable("audio_chunks", {
  id: uuid().primaryKey().defaultRandom(),
  // Identificador único do trecho de áudio (UUID v4 gerado pelo BD)

  roomId: uuid()
    .references(() => rooms.id)
    .notNull(),
  // Chave estrangeira para `rooms.id`; relaciona o trecho a uma sala. Obrigatório.

  transcription: text().notNull(),
  // Transcrição em texto do trecho de áudio.

  embeddings: vector({ dimensions: 768 }).notNull(),
  // Vetor de embedding (dimensão 768) usado para busca semântica.

  createdAt: timestamp().defaultNow().notNull(),
  // Timestamp de inserção. Padrão: agora.
});
