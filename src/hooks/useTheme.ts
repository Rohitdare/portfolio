'use client';

import { useState, useEffect } from 'react';
import { playBeep } from '@/lib/audio';

export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('trainer_id_theme') as 'dark' | 'light' | null;
    const initial = saved || (document.documentElement.classList.contains('light') ? 'light' : 'dark');
    setTheme(initial);
    if (initial === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('trainer_id_theme', next);

    if (next === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }

    playBeep(next === 'light' ? 750 : 380, 0.08, 'sine');
  };

  return { theme, toggleTheme };
}
