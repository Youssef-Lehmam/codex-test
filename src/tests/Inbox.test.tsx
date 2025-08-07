import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, test } from 'vitest';
import Inbox from '../client/routes/Inbox';
import * as api from '../client/hooks/useTempMail';

vi.mock('../client/hooks/useTempMail');

test('render emails', async () => {
  (api.getDomains as any).mockResolvedValue({ success: true, result: ['test.com'] });
  (api.getEmails as any).mockResolvedValue({
    success: true,
    result: [{ id: '1', from: 'a', subject: 'hello', date: new Date().toISOString() }],
  });
  (api.emailCount as any).mockResolvedValue({ success: true, result: 1 });

  const client = new QueryClient();
  render(
    <QueryClientProvider client={client}>
      <Inbox theme="light" setTheme={() => {}} />
    </QueryClientProvider>
  );

  fireEvent.click(screen.getByText('New Address'));

  await waitFor(() => screen.getByText('hello'));
});
