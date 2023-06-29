'use client';

import { useState } from 'react';
import { ChevronsUpDown, PlusCircle } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { usePlaid } from '@/lib/plaid/use-plaid';
import { isInsItemIdSyncingOrLoadingAtom } from '@/lib/atoms/institutions';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';
import { useAtomValue } from 'jotai';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface InstitutionSelectionProps extends PopoverTriggerProps {
  institutions: ClientInstitution[];
  selectedInstitution: ClientInstitution | null;
  setSelectedInstitution: (institution: ClientInstitution) => void;
}

export function InstitutionSelection({
  className,
  institutions,
  selectedInstitution,
  setSelectedInstitution,
}: InstitutionSelectionProps) {
  const { open, ready, isGettingLinkToken } = usePlaid();
  const [isOpen, setIsOpen] = useState(false);
  const isInsItemIdSyncingOrLoading = useAtomValue(isInsItemIdSyncingOrLoadingAtom);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          aria-label="Select an institution"
          className={cn('w-[420px] flex items-center', className)}
        >
          <span className="flex flex-row">
            {selectedInstitution ? selectedInstitution.name : 'Select an institution'}
          </span>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[420px]">
        <Command>
          <CommandList>
            <CommandGroup>
              {!institutions.length
                ? null
                : institutions.map((ins) => (
                    <CommandItem
                      key={ins.item_id}
                      className="text-md"
                      disabled={ins.item_id === isInsItemIdSyncingOrLoading}
                      onSelect={() => {
                        setIsOpen(false);
                        setSelectedInstitution(ins);
                      }}
                    >
                      {ins.name}
                    </CommandItem>
                  ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                className="text-md"
                onSelect={() => open()}
                disabled={!ready}
                loading={isGettingLinkToken}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add institution
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
