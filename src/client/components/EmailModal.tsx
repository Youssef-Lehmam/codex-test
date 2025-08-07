import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEmail } from '../hooks/useTempMail';

interface Props {
  id: string;
  onClose: () => void;
}

export default function EmailModal({ id, onClose }: Props) {
  const { data } = useQuery({ queryKey: ['email', id], queryFn: () => getEmail(id).then(r => r.result) });
  const [tab, setTab] = useState<'html' | 'text'>('html');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    ref.current?.focus();
    return () => document.removeEventListener('keydown', esc);
  }, [onClose]);

  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center" onClick={onClose}>
      <div
        ref={ref}
        tabIndex={-1}
        className="bg-white dark:bg-gray-900 p-4 rounded-md max-w-2xl w-full space-y-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <button className={tab === 'html' ? 'font-bold' : ''} onClick={() => setTab('html')}>
              HTML
            </button>
            <button className={tab === 'text' ? 'font-bold' : ''} onClick={() => setTab('text')}>
              Text
            </button>
          </div>
          <button onClick={onClose}>Close</button>
        </div>
        {tab === 'html' ? (
          <iframe srcDoc={data.html} className="w-full h-96 border" title="email-html" />
        ) : (
          <pre className="overflow-auto h-96">{data.text}</pre>
        )}
      </div>
    </div>
  );
}
