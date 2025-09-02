import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { generateEmbeddings, transcribeAudio } from "../services/gemini.ts";
import { schema } from "../db/schema/index.ts";

export const uploadAudioRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/rooms/:roomId/audio",
    {
      schema: {
        params: z.object({
          roomId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const audio = await request.file();

      if (!audio) {
        throw new Error("Audio is required.");
      }

      const audioBuffer = await audio.toBuffer();
      const audioAsBase64 = audioBuffer.toString("base64");

      const transcription = await transcribeAudio(
        audioAsBase64,
        audio.mimetype,
      );
      const embeddings = await generateEmbeddings(transcription);

      const result = await db
        .insert(schema.audioChunks)
        .values({
          roomId,
          transcription,
          embeddings,
        })
        .returning();

      const chunck = result[0];

      if (!chunck) {
        throw new Error("Failed to save audio chunk.");
      }

      return reply.status(201).send({ transcription, embeddings });

      // Transcrever o aúdio
      // Gerar o verto semântico / embeddings
      // Salvar no banco de dados
    },
  );
};
