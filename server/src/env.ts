import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  // Porta do servidor. `coerce` permite ler strings numéricas do process.env. Padrão 3333.
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
  // String de conexão do Postgres, deve ser uma URL válida iniciando com o protocolo postgres.
  GEMINI_API_KEY: z.string(),
  // Chave de API para o serviço Google Gemini.
});

export const env = envSchema.parse(process.env);
// Valida as variáveis de ambiente na inicialização. Lança erro se algo obrigatório estiver ausente/inválido.
