import { Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90',
  secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:opacity-90',
  outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
};

const disabledClass = 'cursor-not-allowed bg-gray-200 text-gray-400';

@Component({
  selector: 'app-button',
  templateUrl: './button.html'
})
export class ButtonComponent {
  readonly text = input.required<string>();
  readonly variant = input<ButtonVariant>('primary');
  readonly disabled = input(false);
  readonly clicked = output<void>();
  readonly extraClass = input<string>("")

  protected classList(): string {
    const base = `rounded-lg px-4 py-2 text-sm font-medium transition cursor-pointer ${this.extraClass}`;
    return this.disabled() ? `${base} ${disabledClass} ` : `${base} ${variantClasses[this.variant()]}`;
  }
}
