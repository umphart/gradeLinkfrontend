import api from './api';

export const getExams = async () => {
  const response = await api.get('/exams');
  return response.data;
};

export const getExam = async (id) => {
  const response = await api.get(`/exams/${id}`);
  return response.data;
};

export const createExam = async (examData) => {
  const response = await api.post('/exams', examData);
  return response.data;
};

export const updateExam = async (id, examData) => {
  const response = await api.patch(`/exams/${id}`, examData);
  return response.data;
};

export const deleteExam = async (id) => {
  const response = await api.delete(`/exams/${id}`);
  return response.data;
};

export const getExamResults = async (examId) => {
  const response = await api.get(`/exams/${examId}/results`);
  return response.data;
};