import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { generateEmbeddings, transcribeAudio } from "../services/gemini.ts";
import { schema } from "../db/schema/index.ts";
import { db } from "../db/connection.ts";

export const uploadAudioRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/rooms/:roomId/audio",
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        // Valida o parâmetro de rota `roomId`.
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const audio = await request.file();
      // Obtém o arquivo de áudio enviado via multipart/form-data.

      if (!audio) {
        throw new Error("Audio is required.");
      }

      const audioBuffer = await audio.toBuffer();
      const audioAsBase64 = audioBuffer.toString("base64");

      const transcription = await transcribeAudio(
        audioAsBase64,
        audio.mimetype,
      );
      // Transcreve o áudio em PT-BR usando o serviço Gemini.

      const embeddings = await generateEmbeddings(transcription);
      // Gera embeddings a partir da transcrição para buscas semânticas.

      const result = await db
        .insert(schema.audioChunks)
        .values({
          roomId,
          transcription,
          embeddings,
        })
        .returning();
      // Persiste o trecho de áudio transcrito e seus embeddings.

      const chunck = result[0];

      if (!chunck) {
        throw new Error("Failed to save audio chunk.");
      }

      return reply.status(201).send({ chunckId: chunck.id });
    },
  );
};
