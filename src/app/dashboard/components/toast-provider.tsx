'use client';

import { ToastContainer } from 'react-toastify';
import { useTheme } from 'next-themes';
import { inter } from '@/lib/fonts';
import 'react-toastify/dist/ReactToastify.css';

export function ToastProvider() {
  const theme = useTheme();
  const themeValue = theme.theme === 'light' ? 'light' : 'dark';

  return (
    <ToastContainer
      theme={themeValue}
      position="bottom-right"
      newestOnTop
      limit={5}
      toastClassName="border border-background-contrast shadow-lg"
      bodyStyle={{
        ...inter.style,
        fontWeight: 500,
        paddingBottom: '0.75rem',
      }}
    />
  );
}
