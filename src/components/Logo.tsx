import { LogoIcon } from '@/assets';
import { cn } from '@/lib/utils';

import { Link } from './Link';

interface LogoProps {
  isCompact?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo = ({ isCompact = false, className, onClick }: LogoProps) => (
  <Link
    href="/"
    className={cn(
      'relative flex items-center gap-2 w-fit dark:text-white before:absolute before:-inset-1.5',
      className,
    )}
    onClick={onClick}
  >
    {/* TODO: Add logo image when available */}

    <div className="flex">
      <div
        className={cn('overflow-x-hidden transition-all duration-700 max-w-250 opacity-100', {
          'max-w-0 opacity-0 duration-200': isCompact,
        })}
      >
        <LogoIcon className="text-inherit" />
      </div>

      <div
        className={cn('overflow-x-hidden transition-all duration-200 max-w-0 opacity-0', {
          'max-w-250 opacity-100 duration-700': isCompact,
        })}
      >
        <LogoIcon isCompact className="text-inherit" />
      </div>
    </div>
  </Link>
);
