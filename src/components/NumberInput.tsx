import { cn } from '@/lib/utils';

import { Input } from './ui';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onBlur'> {
  value: string | number | undefined | null;
  onChange: (value: number | null) => void;
  onBlur: () => void;
}

export const NumberInput = ({ value, onChange, onBlur, className, ...props }: NumberInputProps) => (
  <Input
    {...props}
    inputMode="decimal"
    type="text"
    className={cn('min-h-10', className)}
    value={value == null ? '' : value}
    onChange={(e) => {
      const raw = e.target.value;
      if (raw === '' || raw === '-') return onChange(null);

      const parsed = Number(raw);
      if (!isNaN(parsed)) onChange(parsed);
    }}
    onBlur={() => {
      onBlur();

      if (value == null) onChange(0);
    }}
  />
);
