'use client';

import { useUserQuery } from '@/hooks';

interface UserAddressesProps {
  userId: number;
}

export const UserAddresses = ({ userId }: UserAddressesProps) => {
  const userQuery = useUserQuery(userId);

  if (!userQuery.data) return null;

  const { addresses } = userQuery.data;

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-sidebar/80 shadow-sm backdrop-blur-sm">
      <div className="border-b border-border p-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">User Addresses</p>

          <h2 className="text-xl font-semibold tracking-tight">Addresses</h2>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 md:p-6">
        {addresses.length ? (
          addresses.map((address) => (
            <div key={address.id} className="flex gap-3 rounded-2xl border border-border bg-background/70 p-4">
              <div className="min-w-0 flex-1 flex flex-col gap-1" dir="rtl">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground font-cairo text-sm">{address.nameAr}</p>

                  {address.isDefault && (
                    <span className="rounded-full bg-sidebar px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      Default
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground font-cairo">
                  {address.cityName} • {address.districtName}
                </p>

                <p className="whitespace-pre-wrap wrap-break-word leading-relaxed text-foreground font-cairo text-xs">
                  {address.detailedAddress}
                </p>

                <p className="text-[10px] text-muted-foreground" dir="ltr">
                  {address.phoneNumber}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground m-auto">No addresses available.</p>
        )}
      </div>
    </section>
  );
};
