'use client';

import { useState, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { HelpDialog } from '@/components/help-dialog';
import { HelpCircle } from 'lucide-react';

interface HelpButtonProps {
  title?: string;
  content: JSX.Element;
}

export function HelpButton({ title, content }: HelpButtonProps) {
  const [open, setOpen] = useState(false);
  const handleOpenChange = useCallback((open?: boolean) => {
    setOpen((prev) => open ?? !prev);
  }, []);

  return (
    <>
      <div className="flex justify-end items-end">
        <Button variant="ghost" className="p-2.5" onClick={() => setOpen(true)}>
          <HelpCircle className="h-7 w-7" />
        </Button>
      </div>

      <HelpDialog open={open} onOpenChange={handleOpenChange} title={title} content={content} />
    </>
  );
}
