import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../db/connection.ts";
import { schema } from "../db/schema/index.ts";
import { z } from "zod/v4";
import { desc, eq } from "drizzle-orm";

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/rooms/:roomId/questions",
    {
      schema: {
        params: z.object({ roomId: z.string() }),
      },
    },

    async (request, reply) => {
      const { roomId } = request.params;
      const { question } = request.body;

      const embeddings = generateEmbeddings(question);
      const chuncks = await db
        .select()
        .from(schema.audioChunks)
        .where(
          and(
            eq(schema.audioChunks.roomId, roomId),
            sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddings}) > 0.7`,
          )
            .orderBy(sql`${schema.audioChunks.embeddings} <=> ${embeddings}`)
            .limit(3),
        );

      const result = await db
        .select({
          id: schema.questions.id,
          question: schema.questions.question,
          answer: schema.questions.answer,
          createdAt: schema.questions.createdAt,
        })
        .from(schema.questions)
        .where(eq(schema.questions.roomId, roomId))
        .orderBy(desc(schema.questions.createdAt));

      if (!insertedQuestion) {
        throw new Error("Failed to insert question");
      }

      return reply.status(201).send({ questionId: insertedQuestion.id });
    },
  );
};
