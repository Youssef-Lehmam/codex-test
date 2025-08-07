import { afterEach, vi, test, expect } from 'vitest';
import { getEmails } from '../client/hooks/useTempMail';

afterEach(() => {
  vi.restoreAllMocks();
});

test('getEmails success', async () => {
  vi.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, result: [] }),
  } as any);
  const res = await getEmails('a@b.com');
  expect(res.success).toBe(true);
});

test('getEmails error', async () => {
  vi.spyOn(global, 'fetch').mockResolvedValue({
    ok: false,
    text: async () => 'err',
  } as any);
  const res = await getEmails('a@b.com');
  expect(res.success).toBe(false);
});
