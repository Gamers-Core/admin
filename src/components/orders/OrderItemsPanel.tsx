'use client';

import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit02Icon, Plus, Trash } from '@hugeicons/core-free-icons';

import {
  AddOrderItemSchema,
  Order,
  OrderItem,
  VariantWithProduct,
  UpdateOrderItemSchema,
  addOrderItemSchema,
  defaultLocale,
  updateOrderItemSchema,
} from '@/api';
import {
  useAddOrderItemMutation,
  useDisclosure,
  useFormatCurrency,
  useRemoveOrderItemMutation,
  useUpdateOrderItemMutation,
} from '@/hooks';
import { cn } from '@/lib/utils';

import { Image } from '../Image';
import { Link } from '../Link';
import { Button } from '../Button';
import { Form } from '../Form';
import { Modal, ModalFooter } from '../Modal';
import { ProductPreviewCard, ProductVariantsModal } from '../products';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Field,
  FieldError,
  FieldLabel,
  Input,
} from '../ui';

interface OrderItemsPanelProps {
  order: Order;
}

const addItemDefaults: AddOrderItemSchema = {
  externalId: '',
  quantity: 1,
};

export const OrderItemsPanel = ({ order }: OrderItemsPanelProps) => {
  const formatCurrency = useFormatCurrency();

  const addItemDisclosure = useDisclosure();
  const editItemDisclosure = useDisclosure();
  const variantDisclosure = useDisclosure();

  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VariantWithProduct | null>(null);

  const addOrderItemMutation = useAddOrderItemMutation();
  const updateOrderItemMutation = useUpdateOrderItemMutation();
  const removeOrderItemMutation = useRemoveOrderItemMutation();

  const addItemForm = useForm<AddOrderItemSchema>({
    defaultValues: addItemDefaults,
    mode: 'onChange',
    resolver: zodResolver(addOrderItemSchema),
  });

  const editItemForm = useForm<UpdateOrderItemSchema>({
    defaultValues: { quantity: 1 },
    mode: 'onChange',
    resolver: zodResolver(updateOrderItemSchema),
  });

  useEffect(() => {
    if (!addItemDisclosure.open) return;
    addItemForm.reset(addItemDefaults);
    setSelectedVariant(null);
  }, [addItemDisclosure.open, addItemForm]);

  useEffect(() => {
    if (!editItemDisclosure.open || !editingItem) return;
    editItemForm.reset({ quantity: editingItem.quantity });
  }, [editItemDisclosure.open, editingItem, editItemForm]);

  const onAddItemOpenChange = (open: boolean) => {
    if (!open) {
      addItemForm.reset(addItemDefaults);
      addOrderItemMutation.reset();
      variantDisclosure.onClose();
      setSelectedVariant(null);
    }

    addItemDisclosure.onOpenChange(open);
  };

  const onEditItemOpenChange = (open: boolean) => {
    if (!open) {
      editItemForm.reset({ quantity: editingItem?.quantity ?? 1 });
      updateOrderItemMutation.reset();
      setEditingItem(null);
    }

    editItemDisclosure.onOpenChange(open);
  };

  const onAddItemSubmit: SubmitHandler<AddOrderItemSchema> = (data) => {
    if (addOrderItemMutation.isPending) return;

    addOrderItemMutation.mutate(
      { orderNumber: order.orderNumber, ...data },
      {
        onSuccess: () => {
          toast.success('Item added successfully.');

          onAddItemOpenChange(false);
        },
        onError: (validationErrors) => {
          if (!validationErrors) return;

          validationErrors.errors.forEach((error) => {
            addItemForm.setError(error.property as keyof AddOrderItemSchema, { message: error.messages[0] });
          });

          toast.error('Please review the item details and try again.');
        },
      },
    );
  };

  const onEditItemSubmit: SubmitHandler<UpdateOrderItemSchema> = (data) => {
    if (!editingItem || updateOrderItemMutation.isPending) return;

    updateOrderItemMutation.mutate(
      { orderNumber: order.orderNumber, itemId: editingItem.id, ...data },
      {
        onSuccess: () => {
          toast.success('Item updated successfully.');

          onEditItemOpenChange(false);
        },
        onError: (validationErrors) => {
          if (!validationErrors) return;

          validationErrors.errors.forEach((error) => {
            editItemForm.setError(error.property as keyof UpdateOrderItemSchema, { message: error.messages[0] });
          });

          toast.error('Please review the item details and try again.');
        },
      },
    );
  };

  const onVariantSelect = (variants: VariantWithProduct[] | [VariantWithProduct]) => {
    const variant = variants[0];

    if (!variant) return;

    setSelectedVariant(variant);

    addItemForm.setValue('externalId', variant.externalId, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Items</p>

          <p className="text-base font-semibold">Order Items ({order.items.length})</p>
        </div>

        <Button
          size="sm"
          variant="outline"
          icon={<HugeiconsIcon icon={Plus} className="size-4" />}
          onClick={addItemDisclosure.onOpen}
        >
          Add Item
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl border border-border bg-background/70 p-4 transition-all duration-300 hover:border-sidebar-primary/30 hover:shadow-md"
          >
            <div className="flex gap-4">
              <div className="shrink-0 overflow-hidden h-fit rounded-xl border border-border bg-sidebar p-1">
                <Image
                  src={item.imageURL}
                  width={80}
                  height={80}
                  alt={item.productTitle[defaultLocale] + ' - ' + item.variantName?.[defaultLocale]}
                  className="h-20 w-20 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="min-w-0 flex flex-1 justify-between gap-6">
                <div className="min-w-0 flex flex-1 flex-col justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/products/${item.productId}`}
                      target="_blank"
                      className="line-clamp-2 text-base font-semibold hover:underline"
                    >
                      {item.productTitle[defaultLocale]}
                    </Link>

                    {item.variantName && (
                      <p className="text-sm text-muted-foreground">{item.variantName[defaultLocale]}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-3 text-sm text-muted-foreground">
                    <span>{formatCurrency(item.unitPrice)}</span>

                    <span>x</span>

                    <span className="rounded-full bg-sidebar px-2 py-1 text-xs font-semibold">{item.quantity}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon-sm"
                      variant="outline"
                      aria-label="Edit item quantity"
                      isDisabled={updateOrderItemMutation.isPending}
                      onClick={() => {
                        setEditingItem(item);
                        editItemDisclosure.onOpen();
                      }}
                      className="rounded-xl p-4"
                    >
                      <HugeiconsIcon icon={PencilEdit02Icon} className="size-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="icon-sm"
                          variant="destructive"
                          aria-label="Remove item"
                          isDisabled={order.items.length <= 1 || removeOrderItemMutation.isPending}
                          className="rounded-xl p-4"
                        >
                          <HugeiconsIcon icon={Trash} className="size-4" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent size="sm">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Item</AlertDialogTitle>

                          <AlertDialogDescription>
                            Remove {item.productTitle[defaultLocale]} from this order?
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={removeOrderItemMutation.isPending}>Cancel</AlertDialogCancel>

                          <AlertDialogAction asChild>
                            <Button
                              isLoading={removeOrderItemMutation.isPending}
                              onClick={() =>
                                removeOrderItemMutation.mutate(
                                  {
                                    orderNumber: order.orderNumber,
                                    itemId: item.id,
                                  },
                                  {
                                    onSuccess: () => toast.success('Item removed successfully.'),
                                  },
                                )
                              }
                            >
                              Remove
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <p className="text-lg font-bold text-sidebar-primary">{formatCurrency(item.lineTotal)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title="Add Item"
        description="Add a product variant to this order."
        asChild
        {...addItemDisclosure}
        onOpenChange={onAddItemOpenChange}
      >
        <Form className="flex-1 min-h-0 flex flex-col gap-5" onSubmit={onAddItemSubmit} {...addItemForm}>
          <Field>
            <FieldLabel htmlFor="externalId" className="text-sm font-semibold">
              Variant
            </FieldLabel>

            <input type="hidden" id="externalId" {...addItemForm.register('externalId')} />

            <div className="relative min-h-28 min-w-full">
              {selectedVariant ? (
                <ProductPreviewCard variant={selectedVariant} />
              ) : (
                <div className="min-h-28 w-full rounded-2xl border border-dashed border-border bg-background/70" />
              )}

              <Button
                type="button"
                variant="secondary"
                onClick={variantDisclosure.onOpen}
                className={cn('absolute inset-0 h-auto', { 'opacity-0 hover:opacity-100': !!selectedVariant })}
              >
                {selectedVariant ? 'Change Variant' : 'Select Variant'}
              </Button>
            </div>

            {addItemForm.formState.errors.externalId && (
              <FieldError errors={[addItemForm.formState.errors.externalId]} />
            )}
          </Field>

          <Controller
            name="quantity"
            control={addItemForm.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="quantity" className="text-sm font-semibold">
                  Quantity
                </FieldLabel>

                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={field.value ?? 1}
                  onChange={(e) => field.onChange(Number(e.target.value) || 1)}
                />

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <ModalFooter>
            <Button
              type="submit"
              variant="default"
              className="w-full h-auto py-2 text-lg"
              isLoading={addOrderItemMutation.isPending}
              isDisabled={!addItemForm.formState.isValid}
            >
              Add Item
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      <ProductVariantsModal
        mode="single"
        variantIds={selectedVariant ? [selectedVariant.id] : undefined}
        {...variantDisclosure}
        onVariantSelect={onVariantSelect}
      />

      <Modal
        title="Edit Item"
        description={editingItem ? `Update quantity for ${editingItem.productTitle[defaultLocale]}.` : undefined}
        asChild
        {...editItemDisclosure}
        onOpenChange={onEditItemOpenChange}
      >
        <Form className="flex-1 min-h-0 flex flex-col gap-5" onSubmit={onEditItemSubmit} {...editItemForm}>
          <Controller
            name="quantity"
            control={editItemForm.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="editQuantity" className="text-sm font-semibold">
                  Quantity
                </FieldLabel>

                <Input
                  id="editQuantity"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={field.value ?? 1}
                  onChange={(e) => {
                    const parsed = Number(e.target.value);

                    if (!isNaN(parsed)) field.onChange(parsed);
                  }}
                />

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <ModalFooter>
            <Button
              type="submit"
              variant="default"
              className="w-full h-auto py-2 text-lg"
              isLoading={updateOrderItemMutation.isPending}
              isDisabled={!editItemForm.formState.isValid}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};
