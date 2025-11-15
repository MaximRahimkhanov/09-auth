import { NewNoteData, Note } from '@/types/note';

import { api } from './api';
import { User } from '@/types/user';

export type ResponseData = {
  notes: Note[];
  totalPages: number;
};

export async function fetchNotes({
  searchText = '',
  page = 1,
  perPage = 10,
  tag,
}: {
  searchText?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}): Promise<ResponseData> {
  const { data } = await api.get<ResponseData>('/notes', {
    params: {
      search: searchText,
      page,
      perPage,
      ...(tag && tag !== 'all' ? { tag } : {}),
    },
  });

  return data;
}

export async function fetchNoteById(noteId: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${noteId}`);

  return data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${noteId}`);

  return data;
}

export async function createNote(newNoteData: NewNoteData): Promise<Note> {
  const { data } = await api.post<Note>('/notes', newNoteData, {});

  return data;
}

export type RegisterRequest = {
  email: string;
  password: string;
  username: string;
};

export const register = async (registerData: RegisterRequest) => {
  const res = await api.post<User>('/auth/register', registerData);
  return res.data;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (loginData: LoginRequest) => {
  const res = await api.post<User>('/auth/login', loginData);
  return res.data;
};

export type CheckSessionRequest = {
  success: boolean;
};

export const checkSession = async () => {
  const res = await api.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
};

export const getMe = async () => {
  const { data } = await api.get<User>('/users/me');

  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export interface EditUserBody {
  username: string;
}

export async function updateMe(user: EditUserBody): Promise<User> {
  const { data } = await api.patch<User>('/users/me', user);
  return data;
}
