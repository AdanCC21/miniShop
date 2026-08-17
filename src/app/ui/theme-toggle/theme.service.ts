import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'minishop_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>('light');

  constructor() {
    this.apply(this.initialTheme());
  }

  toggle(): void {
    this.apply(this.theme() === 'light' ? 'dark' : 'light');
  }

  private initialTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  private apply(theme: Theme): void {
    this.theme.set(theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEY, theme);
  }
}