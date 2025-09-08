import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateQuestionRequest } from "./types/createQuestionRequest";
import type { CreateQuestionResponse } from "./types/createQuestionResponse";
import type { GetRoomQuestionsResponse } from "./types/getRoomQuestionsResponse";

export function useCreateQuestion(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateQuestionRequest) => {
      const response = await fetch(
        `http://localhost:3333/rooms/${roomId}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result: CreateQuestionResponse = await response.json();

      return result;
    },

    // Executa no momento que for feita a chamada p/ API
    onMutate({ question }) {
      const questions = queryClient.getQueryData<GetRoomQuestionsResponse>([
        "get-questions",
        roomId,
      ]);

      const questionsArray = questions ?? [];

      const newQuestion = {
        id: crypto.randomUUID(),
        question,
        answer: null,
        createdAt: new Date().toISOString(),
        isGeneratingAnswer: true,
      };
      // Atualização otimista: insere a pergunta localmente enquanto a API processa.

      queryClient.setQueryData<GetRoomQuestionsResponse>(
        ["get-questions", roomId],
        [newQuestion, ...questionsArray],
      );

      return { newQuestion, questions };
    },

    onSuccess(data, _variables, context) {
      queryClient.setQueryData<GetRoomQuestionsResponse>(
        ["get-questions", roomId],
        (questions) => {
          if (!questions) {
            return questions;
          }

          if (!context.newQuestion) {
            return questions;
          }

          return questions.map((question) => {
            if (question.id === context.newQuestion.id) {
              return {
                ...context.newQuestion,
                id: data.questionId,
                answer: data.answer,
                isGeneratingAnswer: false,
              };
            }

            return question;
          });
        },
      );
      // Concilia a atualização: substitui o item otimista pelo retornado pela API.
    },

    onError(_error, _variables, context) {
      if (context?.questions) {
        queryClient.setQueryData<GetRoomQuestionsResponse>(
          ["get-questions", roomId],
          context.questions,
        );
      }
      // Rollback em caso de erro: restaura cache anterior.
    },

    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['get-questions', roomId] })
    // },
  });
}
