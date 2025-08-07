export interface Email {
  id: string;
  from: string;
  subject: string;
  date: string;
}

export interface EmailDetail extends Email {
  html: string;
  text: string;
}

interface ApiResponse<T> {
  success: boolean;
  result: T;
}

const request = async <T>(input: RequestInfo, init?: RequestInit): Promise<ApiResponse<T>> => {
  const res = await fetch(input, init);
  if (!res.ok) {
    return { success: false, result: await res.text() as unknown as T };
  }
  return res.json();
};

export const getEmails = (addr: string, l = 20, o = 0) =>
  request<Email[]>(`/api/emails/${addr}?limit=${l}&offset=${o}`);

export const deleteAllEmails = (addr: string) =>
  request<null>(`/api/emails/${addr}`, { method: 'DELETE' });

export const getEmail = (id: string) =>
  request<EmailDetail>(`/api/inbox/${id}`);

export const deleteEmail = (id: string) =>
  request<null>(`/api/inbox/${id}`, { method: 'DELETE' });

export const emailCount = (addr: string) =>
  request<number>(`/api/emails/count/${addr}`);

export const getDomains = () =>
  request<string[]>(`/api/domains`);
