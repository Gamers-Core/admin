'use client';

import { Controller, SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  CreateOrderSchema,
  createOrderSchema,
  defaultLocale,
  SearchUser,
  paymentMethods,
  VariantWithProduct,
} from '@/api';
import { Disclosure, useCreateOrderMutation, useDisclosure } from '@/hooks';

import {
  Field,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLabel,
  FieldLegend,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from '../ui';
import { Button } from '../Button';
import { Form } from '../Form';
import { Modal, ModalFooter } from '../Modal';
import { ProductVariantsModal } from '../products/ProductVariantsModal';
import { UserSelectModal } from '../users';

const defaultValues: CreateOrderSchema = {
  user: undefined as unknown as SearchUser,
  paymentMethod: paymentMethods[0],
  note: undefined,
  canOpenPackage: false,
  variants: [],
};

interface OrderCreateModalProps extends Partial<CreateOrderSchema> {
  disclosure: Disclosure;
}

export const OrderCreateModal = ({ disclosure, ...orderValues }: OrderCreateModalProps) => {
  const router = useRouter();

  const form = useForm<CreateOrderSchema>({
    defaultValues: { ...defaultValues, ...orderValues },
    mode: 'onChange',
    resolver: zodResolver(createOrderSchema),
  });
  const { isValid, isDirty } = useFormState({ control: form.control });

  const variantsDisclosure = useDisclosure();
  const userDisclosure = useDisclosure();

  const createOrderMutation = useCreateOrderMutation();

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset(defaultValues);
      createOrderMutation.reset();
    }

    disclosure.onOpenChange(open);
  };

  const onSubmit: SubmitHandler<CreateOrderSchema> = async (data) => {
    if (!isValid || createOrderMutation.isPending) return;

    await createOrderMutation.mutateAsync(data, {
      onSuccess: (order) => {
        toast.success('Order created successfully.');

        onOpenChange(false);

        router.push(`/orders/${order.orderNumber}`);
      },
      onError: (validationErrors) => {
        if (!validationErrors) return;

        validationErrors.errors.forEach((error) => {
          form.setError(error.property, { message: error.messages[0] });
        });

        toast.error('Please review the form and fix the errors before submitting again.');
      },
    });
  };

  const canSubmit = isValid && isDirty;

  return (
    <Modal
      title="Create Order"
      description="Create a new order by providing the customer, address, and items."
      asChild
      {...disclosure}
      onOpenChange={onOpenChange}
    >
      <Form className="flex-1 min-h-0 flex flex-col gap-5" onSubmit={onSubmit} {...form}>
        <Controller
          name="user"
          control={form.control}
          render={({ field, fieldState }) => {
            const defaultAddress =
              field.value?.addresses?.find(({ isDefault }) => isDefault) ?? field.value?.addresses?.[0];

            return (
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="userId" className="text-sm font-semibold">
                    Customer
                  </FieldLabel>

                  <div className="relative min-h-24 min-w-full">
                    {field.value ? (
                      <div className="min-h-24 w-full rounded-2xl border border-border bg-background/70 p-4">
                        <div className="flex flex-col gap-3">
                          <div className="flex gap-2 items-center justify-between">
                            <div className="flex flex-col gap-1">
                              <p className="text-sm font-semibold truncate" title={field.value.name}>
                                {field.value.name}
                              </p>

                              <p className="text-xs text-muted-foreground truncate" title={field.value.email}>
                                {field.value.email}
                              </p>
                            </div>

                            <span className="w-fit rounded-full bg-sidebar px-3 py-1 text-xs font-medium text-muted-foreground">
                              {field.value.ordersCount} orders
                            </span>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            <p className="font-medium text-foreground font-cairo">{defaultAddress.nameAr}</p>

                            <p>{defaultAddress.phoneNumber}</p>

                            <p className="font-cairo">
                              {defaultAddress.cityName} • {defaultAddress.districtName}
                            </p>

                            <p className="line-clamp-2 font-cairo">{defaultAddress.detailedAddress}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="min-h-20 w-full rounded-2xl border border-dashed border-border bg-background/70" />
                    )}

                    <Button
                      variant="secondary"
                      onClick={userDisclosure.onOpen}
                      className={cn('absolute inset-0 h-auto', { 'opacity-0 hover:opacity-100': !!field.value })}
                    >
                      {field.value ? 'Change User' : 'Select User'}
                    </Button>
                  </div>

                  <FieldError errors={[fieldState.error]} />

                  <UserSelectModal
                    mode="single"
                    userIds={field.value ? [field.value.id] : []}
                    {...userDisclosure}
                    onUsersSelect={([user]) => field.onChange(user)}
                    canHaveNoOrders
                  />
                </Field>
              </FieldGroup>
            );
          }}
        />

        <Controller
          name="paymentMethod"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="paymentMethod" className="text-sm font-semibold">
                Payment Method
              </FieldLabel>

              <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                <SelectTrigger className="w-full text-sm capitalize">
                  <SelectValue placeholder="Select a payment method" />
                </SelectTrigger>

                <SelectContent position="popper">
                  <SelectGroup>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method} className="capitalize text-sm">
                        {method}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="canOpenPackage"
          control={form.control}
          render={({ field }) => (
            <FieldLabel htmlFor="canOpenPackage" className="text-sm font-semibold">
              <Field orientation="horizontal" className="flex items-center!">
                <span>Allow package opening</span>

                <Switch
                  id="canOpenPackage"
                  checked={Boolean(field.value)}
                  onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                />
              </Field>
            </FieldLabel>
          )}
        />

        <Controller
          name="note"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="note" className="text-sm font-semibold">
                Delivery Note
              </FieldLabel>

              <Textarea
                id="note"
                placeholder="Add an optional note for this order..."
                className="font-cairo"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value)}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="variants"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldSet className="gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <FieldLegend className="text-sm">Items</FieldLegend>
              </div>

              <FieldError errors={[fieldState.error]} />

              {field.value?.length === 0 ? (
                <div className="relative min-h-24 min-w-full">
                  <div className="min-h-24 w-full rounded-2xl border border-dashed border-border bg-background/70" />

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={variantsDisclosure.onOpen}
                    className="absolute inset-0 h-auto"
                  >
                    Add Variants
                  </Button>
                </div>
              ) : (
                field.value.map((variant: VariantWithProduct, index) => (
                  <Controller
                    key={variant.externalId}
                    name={`variants.${index}`}
                    control={form.control}
                    render={({ field: variantField, fieldState: { error } }) => (
                      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background/70 p-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-xs text-muted-foreground">Variant</p>

                          <p className="text-sm font-semibold capitalize">
                            {variantField.value.product.name[defaultLocale]} · {variantField.value.name[defaultLocale]}
                          </p>
                        </div>

                        <Field>
                          <FieldLabel htmlFor={`variants.${index}.quantity`} className="text-xs font-semibold">
                            Quantity
                          </FieldLabel>

                          <Input
                            id={`variants.${index}.quantity`}
                            type="number"
                            min={1}
                            max={variantField.value.stock}
                            inputMode="numeric"
                            value={variantField.value.quantity ?? 1}
                            onChange={(e) =>
                              variantField.onChange({ ...variantField.value, quantity: Number(e.target.value) || 1 })
                            }
                          />

                          <FieldError errors={[error]} />
                        </Field>

                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => field.onChange(field.value.filter((_, i) => i !== index))}
                          >
                            Remove Item
                          </Button>
                        </div>
                      </div>
                    )}
                  />
                ))
              )}

              {field.value.length > 0 && (
                <div className="relative min-h-24 min-w-full">
                  <div className="min-h-24 w-full rounded-2xl border border-dashed border-border bg-background/70" />

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={variantsDisclosure.onOpen}
                    className="absolute inset-0 h-auto"
                  >
                    Edit Variants
                  </Button>
                </div>
              )}

              <ProductVariantsModal
                mode="multiple"
                variantIds={field.value.map(({ id }) => id)}
                {...variantsDisclosure}
                onVariantSelect={(variants) => field.onChange(variants.map((variant) => ({ ...variant, quantity: 1 })))}
              />
            </FieldSet>
          )}
        />

        <ModalFooter>
          <Button
            type="submit"
            variant="default"
            className="w-full h-auto py-2 text-lg"
            isLoading={createOrderMutation.isPending}
            isDisabled={!canSubmit}
          >
            Create Order
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
