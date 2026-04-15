import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  initialized: boolean;
}

// Получаем тему из localStorage или используем light по умолчанию
const getInitialTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    // Проверяем системные настройки
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
};

const initialState: ThemeState = {
  mode: 'light',
  initialized: false,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    initTheme: (state) => {
      if (!state.initialized && typeof window !== 'undefined') {
        state.mode = getInitialTheme();
        state.initialized = true;
      }
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.mode);
      }
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
  },
});

export const { toggleTheme, initTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
