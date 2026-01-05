import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

export interface ExamSubmission {
  userId: string;
  quizId: string;
  answers: {
    questionId: string;
    selectedAnswerId: string;
  }[];
  timeSpent?: number;
}

export interface ExamResult {
  id: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  submittedAt: string;
  quizTitle: string;
}

export interface QuizWithQuestionsAndAnswers {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  questions: {
    id: string;
    content: string;
    type: string;
    order: number;
    answers: {
      id: string;
      content: string;
    }[];
  }[];
}

// Submit exam
export function useSubmitExam() {
  return useMutation({
    mutationFn: async ({ userId, quizId, answers }: ExamSubmission) => {
      const response = await apiClient.post<ExamResult>(
        `/exam/submit/${userId}/${quizId}`,
        { answers }
      );
      return response.data;
    },
  });
}

// Get quiz submissions for a specific quiz
export function useQuizSubmissions(quizId: string) {
  return useQuery({
    queryKey: ['quiz-submissions', quizId],
    queryFn: async () => {
      const response = await apiClient.get<ExamResult[]>(`/exam/quizzes/${quizId}/submissions`);
      return response.data;
    },
    enabled: !!quizId,
  });
}

// Get submission by ID
export function useSubmission(submissionId: string) {
  return useQuery({
    queryKey: ['submission', submissionId],
    queryFn: async () => {
      const response = await apiClient.get<ExamResult>(`/exam/submissions/${submissionId}`);
      return response.data;
    },
    enabled: !!submissionId,
  });
}

// Get user submissions
export function useUserSubmissions(userId: string) {
  return useQuery({
    queryKey: ['user-submissions', userId],
    queryFn: async () => {
      const response = await apiClient.get<ExamResult[]>(`/exam/users/${userId}/submissions`);
      return response.data;
    },
    enabled: !!userId,
  });
}

// Get quiz with full questions and answers for taking exam
export function useQuizForExam(quizId: string) {
  return useQuery({
    queryKey: ['quiz-exam', quizId],
    queryFn: async () => {
      const response = await apiClient.get<QuizWithQuestionsAndAnswers>(`/quizzes/${quizId}`);
      return response.data;
    },
    enabled: !!quizId,
  });
}
