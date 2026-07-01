'use client';

import { Button } from './Button';
import { Card, CardContent, Field, FieldLabel, Calendar, Input, Separator } from './ui';
import { cn } from '@/lib/utils';

interface DateTimeSelectorProps {
  onChange?: (date: Date | undefined) => void;
  value?: string;
  forceOrientation?: 'horizontal' | 'vertical';
}

export const DateTimeSelector = ({ onChange, value, forceOrientation }: DateTimeSelectorProps) => {
  const date = value ? new Date(value) : undefined;

  const horizontal = forceOrientation === 'horizontal';
  const vertical = forceOrientation === 'vertical';
  const responsive = !forceOrientation;

  const onDateChange = (newDate: Date | undefined) => {
    if (!newDate) {
      onChange?.(undefined);
      return;
    }

    const merged = date ? new Date(date) : new Date();
    merged.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    onChange?.(merged);
  };

  const onTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes, seconds] = event.target.value.split(':').map(Number);
    const merged = date ? new Date(date) : new Date();
    merged.setHours(hours || 0, minutes || 0, seconds || 0, 0);
    onChange?.(merged);
  };

  const timeValue = date
    ? [
        String(date.getHours()).padStart(2, '0'),
        String(date.getMinutes()).padStart(2, '0'),
        String(date.getSeconds()).padStart(2, '0'),
      ].join(':')
    : '';

  return (
    <Card
      size="sm"
      className={cn('w-full flex flex-col', {
        'flex-row items-start': horizontal,
        'md:flex-row md:items-start': responsive,
      })}
    >
      <CardContent className="flex-1">
        <Calendar
          mode="single"
          weekStartsOn={6}
          selected={date}
          onSelect={onDateChange}
          className={cn('w-full max-w-xs p-0 mx-auto', {
            'md:max-w-none md:w-fit': horizontal || responsive,
          })}
        />
      </CardContent>

      <Separator
        orientation="horizontal"
        className={cn({
          hidden: horizontal,
          block: vertical,
          'md:hidden': responsive,
        })}
      />

      <Separator
        orientation="vertical"
        className={cn('self-stretch', {
          block: horizontal,
          hidden: vertical,
          'hidden md:block': responsive,
        })}
      />

      <CardContent
        className={cn('shrink-0 flex flex-col gap-4', {
          'w-64': horizontal,
          'w-full': vertical,
          'w-full md:w-64': responsive,
        })}
      >
        <Field>
          <FieldLabel htmlFor="time-from">Time</FieldLabel>
          <Input id="time-from" type="time" step="1" value={timeValue} onChange={onTimeChange} />
        </Field>

        {date && (
          <div className="rounded-xl border border-border p-3">
            <p className="text-xs text-muted-foreground">Selected</p>
            <p className="text-sm font-medium">{date.toLocaleString()}</p>
          </div>
        )}

        <Button isDisabled={!date} variant="outline" onClick={() => onChange?.(undefined)}>
          Clear
        </Button>
      </CardContent>
    </Card>
  );
};
