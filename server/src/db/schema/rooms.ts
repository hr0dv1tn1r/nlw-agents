import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const rooms = pgTable('rooms', {
	id: uuid().primaryKey().defaultRandom(),
	// Identificador único da sala (UUID v4 gerado pelo BD)

	name: text().notNull(),
	// Nome legível da sala. Obrigatório.

	description: text(),
	// Descrição opcional para o contexto da sala.

	createdAt: timestamp().defaultNow().notNull(),
	// Timestamp de criação. Padrão: agora.
})
