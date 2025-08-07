import { getDomains } from '../hooks/useTempMail';

interface Props {
  address: string;
  setAddress: (a: string) => void;
  onDeleteAll: () => void;
  count: number;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

export default function Controls({ address, setAddress, onDeleteAll, count, theme, setTheme }: Props) {
  const generate = async () => {
    const { result } = await getDomains();
    const domain = result[Math.floor(Math.random() * result.length)];
    const local = Math.random().toString(36).slice(2, 10);
    setAddress(`${local}@${domain}`);
  };

  const copy = async () => {
    if (address) await navigator.clipboard.writeText(address);
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={generate} className="px-3 py-1 rounded-md bg-[var(--primary)] text-white transition-colors">
        New Address
      </button>
      {address && (
        <>
          <span data-testid="address" className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 select-all">
            {address}
          </span>
          <button onClick={copy} className="px-2 py-1 border rounded-md">
            Copy
          </button>
          <button onClick={onDeleteAll} className="px-2 py-1 border rounded-md">
            Delete All ({count})
          </button>
        </>
      )}
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="ml-auto px-2 py-1 border rounded-md"
      >
        {theme === 'light' ? 'Dark' : 'Light'}
      </button>
    </div>
  );
}
