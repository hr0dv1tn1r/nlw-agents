import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../db/connection.ts";
import { schema } from "../db/schema/index.ts";
import { z } from "zod/v4";
import { and, eq, sql } from "drizzle-orm";
import { generateEmbeddings, generateAnswer } from "../services/gemini.ts";

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/rooms/:roomId/questions",
    {
      schema: {
        params: z.object({ roomId: z.string() }),
        // Valida o parâmetro de rota `roomId` como string.
        body: z.object({ question: z.string().min(1) }),
        // Valida o corpo da requisição exigindo `question` não vazia.
      },
    },

    async (request, reply) => {
      const { roomId } = request.params;
      const { question } = request.body;

      const embeddings = await generateEmbeddings(question);
      // Gera o embedding da pergunta para comparar com os trechos de áudio.

      const embeddingsAsString = `[${embeddings.join(",")}]`;
      const chunks = await db
        .select({
          id: schema.audioChunks.id,
          transcription: schema.audioChunks.transcription,
          similarity: sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`,
        })
        .from(schema.audioChunks)
        .where(
          and(
            eq(schema.audioChunks.roomId, roomId),
            sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > 0.7`,
          ),
        )
        .orderBy(
          sql`${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector`,
        )
        .limit(3);
      // Busca os 3 trechos mais similares (distância vetorial) dentro da sala, com similaridade > 0.7.

      let answer: string | null = null;
      if (chunks.length > 0) {
        const transcriptions = chunks.map((chunk) => chunk.transcription);
        answer = await generateAnswer(question, transcriptions);
        // Se houver contexto relevante, gera a resposta usando as transcrições como contexto.
      }

      const result = await db
        .insert(schema.questions)
        .values({ roomId, question, answer })
        .returning();
      // Persiste a pergunta (e resposta se houver) no banco.

      const insertedQuestion = result[0];

      if (!insertedQuestion) {
        throw new Error("Failed to insert question");
      }

      return reply
        .status(201)
        .send({ questionId: insertedQuestion.id, answer });
    },
  );
};
