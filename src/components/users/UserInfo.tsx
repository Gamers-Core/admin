'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { LanguageSkillIcon, Mail01Icon, UserIcon } from '@hugeicons/core-free-icons';

import { useUserQuery } from '@/hooks';

interface UserInfoProps {
  userId: number;
}

export const UserInfo = ({ userId }: UserInfoProps) => {
  const userQuery = useUserQuery(userId);

  if (!userQuery.data) return null;

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-sidebar/80 shadow-sm backdrop-blur-sm">
      <div className="border-b border-border p-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">User Details</p>

          <h2 className="text-xl font-semibold tracking-tight">User Info</h2>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="flex gap-4 rounded-2xl border border-border bg-background/70 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-sidebar">
            <HugeiconsIcon icon={UserIcon} className="size-5 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Name</p>

            <p className="truncate font-semibold text-foreground">{userQuery.data.name}</p>
          </div>
        </div>

        <div className="flex gap-4 rounded-2xl border border-border bg-background/70 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-sidebar">
            <HugeiconsIcon icon={Mail01Icon} className="size-5 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Email</p>

            <p className="truncate font-semibold text-foreground">{userQuery.data.email}</p>
          </div>
        </div>

        <div className="flex gap-4 rounded-2xl border border-border bg-background/70 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-sidebar">
            <HugeiconsIcon icon={LanguageSkillIcon} className="size-5 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Locale</p>

            <p className="truncate font-semibold text-foreground uppercase">{userQuery.data.locale}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
