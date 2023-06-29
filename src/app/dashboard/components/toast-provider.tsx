'use client';

import { ToastContainer } from 'react-toastify';
import { useTheme } from 'next-themes';
import { Inter } from '@/lib/fonts';
import 'react-toastify/dist/ReactToastify.css';

export function ToastProvider() {
  const theme = useTheme();
  const themeValue = theme.theme === 'light' ? 'light' : 'dark';

  return (
    <ToastContainer
      theme={themeValue}
      position="bottom-right"
      newestOnTop
      bodyStyle={{
        ...Inter.style,
        fontWeight: 500,
        paddingBottom: '1rem',
      }}
    />
  );
}
