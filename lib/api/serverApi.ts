import { cookies } from 'next/headers';
import { api } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';
import { ResponseData } from './clientApi';

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await api.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res;
};

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  const data = await res.json();
  return data;
};

export async function fetchNoteById(noteId: string, cookie: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${noteId}`, {
    headers: {
      Cookie: cookie,
    },
  });

  return data;
}

export async function fetchNotes(
  cookie: string,
  {
    searchText = '',
    page = 1,
    perPage = 10,
    tag,
  }: {
    searchText?: string;
    page?: number;
    perPage?: number;
    tag?: string;
  }
): Promise<ResponseData> {
  const { data } = await api.get<ResponseData>('/notes', {
    params: {
      search: searchText,
      page,
      perPage,
      ...(tag && tag !== 'all' ? { tag } : {}),
    },
    headers: {
      Cookie: cookie,
    },
  });

  return data;
}
