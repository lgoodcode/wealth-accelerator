'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  title?: string;
  content: JSX.Element;
}

export function HelpDialog({ open, onOpenChange, title = 'Help', content }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl capitalize">{title}</DialogTitle>
        </DialogHeader>

        <DialogDescription>{content}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
