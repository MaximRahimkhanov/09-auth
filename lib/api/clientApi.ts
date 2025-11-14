import { NewNoteData, Note } from '@/types/note';

import { api } from './api';
import { User } from '@/types/user';

export type ResponseData = {
  notes: Note[];
  totalPages: number;
};

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

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
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function fetchNoteById(noteId: string): Promise<Note> {
  const { data } = await api.get<Note>(
    `/api/notes/${noteId}`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const { data } = await api.delete<Note>(
    `/api/notes/${noteId}`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return data;
}

export async function addNote(newNoteData: NewNoteData): Promise<Note> {
  const { data } = await api.post<Note>('/api/notes', newNoteData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return data;
}

export async function fetchNoteByTag(tag?: string): Promise<Note[]> {
  const { data } = await api.get(`/api/notes`, {
    params: tag ? { tag } : {},
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_URL}`,
    },
  });

  return data.notes;
}

export type RegisterRequest = {
  email: string;
  password: string;
  userName: string;
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
  console.log('GETME');
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export interface EditUserBody {
  email?: string;
  username: string;
}

export async function updateMe(user: EditUserBody): Promise<User> {
  const { data } = await api.patch<User>('/users/me', user);
  return data;
}
