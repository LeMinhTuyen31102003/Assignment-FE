import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

export interface Question {
  id: string;
  content: string;
  type: string;
  score?: number;
  order?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  answers?: Answer[];
}

export interface Answer {
  id: string;
  content: string;
  isCorrect: boolean;
  status?: string;
}

export interface CreateQuestionDto {
  content: string;
  type: string;
  order?: number;
  answers?: Omit<Answer, 'id'>[];
}

export interface UpdateQuestionDto {
  content?: string;
  type?: string;
  order?: number;
  answers?: {
    id?: string;
    content: string;
    isCorrect: boolean;
    status?: string;
  }[];
}

interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

export interface QuestionQueryParams {
  page?: number;
  size?: number;
  content?: string;
  type?: string;
}

// Fetch all questions
export function useQuestions(params?: QuestionQueryParams) {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Question>>('/questions', {
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
          ...(params?.content && { content: params.content }),
          ...(params?.type && { type: params.type }),
        },
      });
      return response.data;
    },
  });
}

// Fetch single question by ID
export function useQuestion(id: string) {
  return useQuery({
    queryKey: ['question', id],
    queryFn: async () => {
      const response = await apiClient.get<Question>(`/questions/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create question mutation
export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (question: CreateQuestionDto) => {
      const response = await apiClient.post<Question>('/questions', question);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

// Update question mutation
export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateQuestionDto }) => {
      const response = await apiClient.put<Question>(`/questions/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['question', variables.id] });
    },
  });
}

// Delete question mutation
export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/questions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}
