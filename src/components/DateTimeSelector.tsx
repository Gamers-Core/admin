'use client';

import { Card, CardContent, Field, FieldLabel, Calendar, Input, Separator } from './ui';

interface DateTimeSelectorProps {
  onChange?: (date: Date | undefined) => void;
  value?: string;
}

export const DateTimeSelector = ({ onChange, value }: DateTimeSelectorProps) => {
  const date = value ? new Date(value) : undefined;

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
    <Card size="sm" className="w-full flex flex-col md:flex-row md:items-start">
      <CardContent className="flex-1">
        <Calendar
          mode="single"
          weekStartsOn={6}
          selected={date}
          onSelect={onDateChange}
          className="w-full max-w-xs md:max-w-none md:w-fit mx-auto p-0"
        />
      </CardContent>

      <Separator orientation="horizontal" className="md:hidden" />

      <Separator orientation="vertical" className="hidden md:block self-stretch" />

      <CardContent className="w-full md:w-64 shrink-0 flex flex-col gap-4">
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
      </CardContent>
    </Card>
  );
};
