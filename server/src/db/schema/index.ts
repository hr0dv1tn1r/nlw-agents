import { audioChunks } from "./audioChunks.ts";
import { questions } from "./questions.ts";
import { rooms } from "./rooms.ts";

export const schema = {
  rooms,
  questions,
  audioChunks,
};
// Export central utilizado pelo Drizzle para inferir tipos e mapear modelos.
