import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  durationMinutes: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  totalQuestions?: number | null;
  questions?: Question[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Question {
  id: string;
  content: string;
  type: string;
  answers: Answer[];
  order?: number;
  status?: string;
}

export interface Answer {
  id: string;
  content: string;
  isCorrect: boolean;
  status?: string;
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

// Fetch all quizzes
export function useQuizzes(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Quiz>>('/quizzes');
      return response.data.content; // Return only the content array
    },
    enabled: options?.enabled ?? true,
  });
}

// Fetch single quiz by ID
export function useQuiz(id: string) {
  return useQuery({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const response = await apiClient.get<Quiz>(`/quizzes/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Fetch questions for a quiz
export function useQuizQuestions(quizId: string) {
  return useQuery({
    queryKey: ['quiz-questions', quizId],
    queryFn: async () => {
      const response = await apiClient.get<Question[]>(`/quizzes/${quizId}/questions`);
      return response.data;
    },
    enabled: !!quizId,
  });
}

// Create quiz mutation
export function useCreateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quiz: Omit<Quiz, 'id'>) => {
      const response = await apiClient.post<Quiz>('/quizzes', quiz);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
}

// Update quiz mutation
export function useUpdateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Quiz> }) => {
      const response = await apiClient.put<Quiz>(`/quizzes/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.id] });
    },
  });
}

// Delete quiz mutation
export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/quizzes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
}

// Add question to quiz
export function useAddQuestionToQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quizId, questionId }: { quizId: string; questionId: string }) => {
      const response = await apiClient.post(`/quizzes/${quizId}/questions/${questionId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.quizId] });
      queryClient.invalidateQueries({ queryKey: ['quiz-questions', variables.quizId] });
    },
  });
}

// Remove question from quiz
export function useRemoveQuestionFromQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quizId, questionId }: { quizId: string; questionId: string }) => {
      await apiClient.delete(`/quizzes/${quizId}/questions/${questionId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.quizId] });
      queryClient.invalidateQueries({ queryKey: ['quiz-questions', variables.quizId] });
    },
  });
}
