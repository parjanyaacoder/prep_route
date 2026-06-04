import { apiClient } from './client';
import type { Test, Question } from '../types';

export const authService = {
  login: async (credentials: any) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
};

export const metadataService = {
  getSubjects: async () => {
    const response = await apiClient.get('/subjects');
    return response.data;
  },
  getTopicsBySubject: async (subjectId: string) => {
    const response = await apiClient.get(`/topics/subject/${subjectId}`);
    return response.data;
  },
  getSubTopicsByTopic: async (topicId: string) => {
    const response = await apiClient.get(`/sub-topics/topic/${topicId}`);
    return response.data;
  },
  getSubTopicsByMultiTopics: async (topicIds: string[]) => {
    const response = await apiClient.post('/sub-topics/multi-topics', { topicIds });
    return response.data;
  }
};

export const testService = {
  getAllTests: async () => {
    const response = await apiClient.get('/tests');
    return response.data;
  },
  getTestById: async (id: string) => {
    const response = await apiClient.get(`/tests/${id}`);
    return response.data;
  },
  createTest: async (testData: Partial<Test>) => {
    const response = await apiClient.post('/tests', testData);
    return response.data;
  },
  updateTest: async (id: string, updateData: any) => {
    const response = await apiClient.put(`/tests/${id}`, updateData);
    return response.data;
  },
  publishTest: async (id: string) => {
    const response = await apiClient.put(`/tests/${id}`, { status: 'live' });
    return response.data;
  }
};

export const questionService = {
  createBulkQuestions: async (questions: Question[]) => {
    const response = await apiClient.post('/questions/bulk', { questions });
    return response.data;
  },
  fetchBulkQuestions: async (questionIds: string[]) => {
    const response = await apiClient.post('/questions/fetchBulk', { question_ids: questionIds });
    return response.data;
  }
};
