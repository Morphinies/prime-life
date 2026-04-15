import type { RootState } from '../index';

export const selectTheme = (state: RootState) => state.theme.mode;
export const selectIsDarkTheme = (state: RootState) => state.theme.mode === 'dark';
