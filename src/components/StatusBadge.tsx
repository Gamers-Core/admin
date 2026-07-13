import { cn } from '@/lib/utils';

type Status = 'active' | 'draft' | 'unlisted' | 'inactive';

const statusStyles: Record<Status, string> = {
  active: 'bg-green-100 text-green-700',
  draft: 'bg-muted text-muted-foreground',
  unlisted: 'bg-yellow-100 text-yellow-700',
  inactive: 'bg-gray-100 text-gray-700',
};

interface StatusBadgeProps {
  status: Status;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium capitalize', statusStyles[status])}>{status}</span>
);
