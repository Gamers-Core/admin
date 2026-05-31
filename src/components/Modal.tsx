'use client';

import { X } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Disclosure, useIsMobile } from '@/hooks';
import { cn } from '@/lib/utils';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './ui';
import { Button } from './Button';

interface ModalProps extends Disclosure {
  title: string;
  description?: string;
  children: React.ReactNode;
  fullscreen?: boolean;
  className?: string;
  asChild?: boolean;
}

export const Modal = (props: ModalProps) => {
  const isMobile = useIsMobile();

  const Component = isMobile ? MobileDrawer : DesktopDialog;

  return <Component {...props} onClose={() => props.onOpenChange(false)} />;
};

const MobileDrawer = ({ title, description, children, className, asChild, fullscreen, ...disclosure }: ModalProps) => (
  <Drawer direction="bottom" {...disclosure}>
    <DrawerContent
      className={cn('bg-transparent before:backdrop-blur-lg before:bg-popover/60 h-full pb-6 pt-0', {
        'h-screen': fullscreen,
      })}
    >
      <DrawerHeader className="flex flex-col gap-2 px-6">
        <DrawerTitle className="text-xl font-bold font-oxanium">{title}</DrawerTitle>

        <DrawerDescription className="text-xs font-semibold text-muted-foreground">{description}</DrawerDescription>
      </DrawerHeader>

      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-6">
        {asChild ? children : <div className={cn('flex flex-col flex-1 gap-4 min-h-0', className)}>{children}</div>}
      </div>
    </DrawerContent>
  </Drawer>
);

const DesktopDialog = ({ title, description, children, className, asChild, fullscreen, ...disclosure }: ModalProps) => (
  <Dialog {...disclosure}>
    <DialogContent
      showCloseButton={false}
      className={cn('flex flex-col md:max-w-2xl max-h-[90dvh] px-0', { 'md:max-w-[90dvw]': fullscreen })}
    >
      <DialogHeader className="flex flex-row justify-between items-center px-4">
        <div className="flex flex-col gap-2">
          <DialogTitle className="text-xl font-oxanium">{title}</DialogTitle>

          <DialogDescription>{description}</DialogDescription>
        </div>

        <DialogClose asChild>
          <Button icon={<HugeiconsIcon icon={X} />} variant="outline" aria-label="Close" />
        </DialogClose>
      </DialogHeader>

      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-4">
        {asChild ? children : <div className={cn('flex flex-col flex-1 gap-4 min-h-0', className)}>{children}</div>}
      </div>
    </DialogContent>
  </Dialog>
);

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalFooter = (props: ModalFooterProps) => {
  const isMobile = useIsMobile();

  const Component = isMobile ? DrawerFooter : DialogFooter;

  return <Component {...props} className="p-0" />;
};
