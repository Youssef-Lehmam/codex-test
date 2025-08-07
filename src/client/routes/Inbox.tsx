import { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import Controls from '../components/Controls';
import EmailTable from '../components/EmailTable';
import EmailModal from '../components/EmailModal';
import { getEmails, deleteEmail, deleteAllEmails, emailCount, Email } from '../hooks/useTempMail';

interface Props {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

export default function Inbox({ theme, setTheme }: Props) {
  const [address, setAddress] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const { data, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: ['emails', address],
    queryFn: ({ pageParam = 0 }) => getEmails(address, 20, pageParam).then(r => r.result),
    enabled: !!address,
    getNextPageParam: (last, pages) => (last.length === 20 ? pages.length * 20 : undefined),
    refetchInterval: 10000,
  });

  const { data: count } = useQuery({
    queryKey: ['count', address],
    queryFn: () => emailCount(address).then(r => r.result),
    enabled: !!address,
    refetchInterval: 10000,
  });

  const emails: Email[] = data?.pages.flat() ?? [];

  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sentinel.current) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && hasNextPage) fetchNextPage();
      });
    });
    obs.observe(sentinel.current);
    return () => obs.disconnect();
  }, [sentinel.current, hasNextPage]);

  const handleDelete = async (id: string) => {
    await deleteEmail(id);
    refetch();
  };

  const handleDeleteAll = async () => {
    if (address) {
      await deleteAllEmails(address);
      refetch();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Controls address={address} setAddress={setAddress} onDeleteAll={handleDeleteAll} count={count ?? 0} theme={theme} setTheme={setTheme} />
      <EmailTable emails={emails} onSelect={setSelected} onDelete={handleDelete} />
      {hasNextPage && <div ref={sentinel} />}
      {selected && <EmailModal id={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
