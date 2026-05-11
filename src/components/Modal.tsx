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
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from './ui';
import { Button } from './Button';

interface ModalProps extends Disclosure {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
  asChild?: boolean;
}

export const Modal = (props: ModalProps) => {
  const isMobile = useIsMobile();

  const Component = isMobile ? MobileDrawer : DesktopDialog;

  return <Component {...props} onClose={() => props.onOpenChange(false)} />;
};

const MobileDrawer = ({ children, title, description, className, asChild, ...disclosure }: ModalProps) => (
  <Drawer direction="bottom" {...disclosure}>
    <DrawerContent className="bg-transparent before:backdrop-blur-lg before:bg-popover/60 h-full px-6">
      <DrawerHeader className="flex flex-row justify-between px-0">
        <div className="flex flex-col gap-2">
          <DrawerTitle className="text-xl font-bold text-start">{title}</DrawerTitle>

          <DrawerDescription className="text-xs font-semibold text-muted-foreground">{description}</DrawerDescription>
        </div>

        <DrawerClose asChild>
          <Button icon={<HugeiconsIcon icon={X} />} variant="outline" aria-label="Close" />
        </DrawerClose>
      </DrawerHeader>

      {asChild ? <div className={cn('flex flex-1 min-h-0', className)}>{children}</div> : children}
    </DrawerContent>
  </Drawer>
);

const DesktopDialog = ({ children, title, description, className, asChild, ...disclosure }: ModalProps) => (
  <Dialog {...disclosure}>
    <DialogContent showCloseButton={false} className="sm:max-w-md md:max-w-2xl">
      <DialogHeader className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-2">
          <DialogTitle className="text-xl">{title}</DialogTitle>

          <DialogDescription>{description}</DialogDescription>
        </div>

        <DialogClose asChild>
          <Button icon={<HugeiconsIcon icon={X} />} variant="outline" aria-label="Close" />
        </DialogClose>
      </DialogHeader>

      {asChild ? <div className={cn('flex flex-1 min-h-0', className)}>{children}</div> : children}
    </DialogContent>
  </Dialog>
);
