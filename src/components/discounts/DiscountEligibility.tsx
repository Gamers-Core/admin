'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { discountEligibilities, DiscountSchema } from '@/api';
import { useDisclosure } from '@/hooks';

import { Field, FieldError, FieldGroup } from '../ui';
import { Button } from '../Button';
import { UserSelectModal } from '../users';

export const DiscountEligibility = () => {
  const usersDisclosure = useDisclosure();

  const form = useFormContext<DiscountSchema>();
  const selectedEligibility = form.watch('eligibility');

  return (
    <section className="bg-sidebar p-4 rounded-lg flex flex-col gap-6">
      <h3 className="text-lg font-semibold">Eligibility</h3>

      <FieldGroup className="flex flex-col gap-2">
        <Controller
          name="eligibility"
          control={form.control}
          render={({ field }) => (
            <Field className="flex flex-row flex-wrap gap-2 items-center min-w-auto">
              {discountEligibilities.map((eligibility) => (
                <Button
                  key={eligibility}
                  className="capitalize flex-1 h-10 max-w-none min-w-40 font-semibold text-base"
                  onClick={() => {
                    field.onChange(eligibility);
                    form.setValue('eligibleUsers', undefined, { shouldValidate: true, shouldDirty: true });
                  }}
                  variant={field.value === eligibility ? 'default' : 'secondary'}
                >
                  {eligibility.replaceAll('_', ' ')}
                </Button>
              ))}
            </Field>
          )}
        />

        {selectedEligibility === 'custom_users' && (
          <Controller
            name="eligibleUsers"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <Button variant="secondary" onClick={usersDisclosure.onOpen} className="min-h-28 min-w-full h-auto">
                  Select Users
                </Button>

                {field.value?.map((user) => (
                  <UserCard key={user.id} name={user.name} email={user.email} ordersCount={user.ordersCount} />
                ))}

                <UserSelectModal
                  mode="multiple"
                  canHaveNoAddresses
                  canHaveNoOrders
                  userIds={field.value?.map(({ id }) => id)}
                  onUsersSelect={(users) => field.onChange(users)}
                  {...usersDisclosure}
                />

                {fieldState.invalid && (
                  <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}
      </FieldGroup>
    </section>
  );
};

interface UserCardProps {
  name: string;
  email: string;
  ordersCount: number;
}

const UserCard = ({ name, email }: UserCardProps) => (
  <div className="min-h-24 w-full rounded-2xl border border-border bg-background/70 p-4">
    <div className="flex flex-col gap-1 min-w-0">
      <p className="text-sm font-semibold truncate" title={name}>
        {name}
      </p>

      <p className="text-xs text-muted-foreground truncate" title={email}>
        {email}
      </p>
    </div>
  </div>
);
