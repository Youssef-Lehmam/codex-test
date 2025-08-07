import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Inbox from './routes/Inbox';
import { tokens } from './theme/tokens';

type Theme = 'light' | 'dark';
const THEME_KEY = 'theme';

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const style = {
    ['--bg' as any]: tokens.colors[theme].bg,
    ['--text' as any]: tokens.colors[theme].text,
    ['--primary' as any]: tokens.colors[theme].primary,
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-150" style={style}>
      <Routes>
        <Route path="/" element={<Inbox theme={theme} setTheme={setTheme} />} />
      </Routes>
    </div>
  );
}
