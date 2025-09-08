# NLW Agents - Salas de Perguntas com Áudio e IA

Aplicação full-stack para criação de salas, envio de áudios, transcrição via Gemini, indexação por embeddings e perguntas com respostas baseadas no conteúdo transcrito.

## Stack
- **Backend**: Fastify, Drizzle ORM (PostgreSQL + drizzle-kit), Zod, @google/genai
- **Banco**: PostgreSQL (pgvector para embeddings)
- **Frontend**: React + Vite + TypeScript, React Router, TanStack Query
- **UI**: Tailwind + componentes (shadcn/ui)

## Estrutura do projeto
```
DEV/
  server/              # API Fastify + Drizzle
    src/
      db/
        schema/        # Tabelas: rooms, questions, audio_chunks
        connection.ts  # Conexão com Postgres via postgres-js + Drizzle
        seed.ts        # Seed de desenvolvimento
      routes/          # Rotas REST
      services/        # Integração com Google Gemini
      env.ts           # Validação de variáveis de ambiente (Zod)
  web/                 # Front-end React
    src/
      pages/           # Páginas e rotas
      components/      # Componentes de UI
      http/            # Hooks HTTP (React Query)
      lib/             # Utilitários (dayjs, classes)
```

## Requisitos
- Node 20+
- PostgreSQL 16+ com extensão `pgvector`
- Chave de API do Google Gemini

## Configuração de ambiente
Crie um arquivo `.env` dentro de `server/` com:
```
PORT=3333
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME
GEMINI_API_KEY=seu_token_aqui
```

Observação: o repositório mostra `.env` removido do git. Certifique-se de recriá-lo localmente.

## Banco de dados
- Gere e aplique migrações com drizzle-kit (já configurado em `server/drizzle.config.ts`).
- Para popular dados de desenvolvimento:
```
cd server
npm run db:seed
```

## Executar em desenvolvimento
- Backend:
```
cd server
npm install
npm run dev
```
A API iniciará em `http://localhost:3333`.

- Frontend:
```
cd web
npm install
npm run dev
```
A aplicação iniciará em `http://localhost:5173` (Vite).

## Endpoints principais
- `POST /rooms` cria uma sala
  - body: `{ name: string, description?: string }`
  - resposta: `{ roomId: string }`
- `GET /rooms` lista salas com contagem de perguntas
- `POST /rooms/:roomId/audio` envia áudio (multipart `file`) para transcrição e armazenamento de embeddings
- `POST /rooms/:roomId/questions` cria pergunta, busca contexto por similaridade dos embeddings e pode gerar `answer`
- `GET /rooms/:roomId/questions` lista perguntas e respostas da sala

## Fluxo de IA
1. Upload de áudio → `transcribeAudio` (Gemini) → salva `transcription` e `embeddings` em `audio_chunks`.
2. Pergunta do usuário → gera embedding → busca chunks semelhantes (> 0.7) → `generateAnswer` (Gemini) com contexto.

## Notas de desenvolvimento
- Comentários em PT-BR foram adicionados em todo o código para facilitar entendimento (server e web).
- O serviço do Gemini lê `GEMINI_API_KEY` do `.env`.
- O front utiliza React Query com cache por chave (`get-rooms`, `get-questions/:roomId`) e atualização otimista ao criar perguntas.

## Scripts úteis (server)
- `npm run dev` inicia a API (usa `--env-file .env`)
- `npm run db:generate` gera migrações do Drizzle
- `npm run db:migrate` aplica migrações
- `npm run db:seed` recria/popula o banco para desenvolvimento

## Licença
ISC 