'use client';

import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { ChevronsUpDown, PlusCircle } from 'lucide-react';

import { usePlaid } from '@/lib/plaid/use-plaid';
import {
  isInsItemIdSyncingOrLoadingAtom,
  institutionsAtom,
  selectedInstitutionAtom,
  setSelectedInstitutionAtom,
} from '@/lib/plaid/atoms';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

interface InstitutionSelectionProps {
  disabled?: boolean;
}

export function InstitutionSelection({ disabled }: InstitutionSelectionProps) {
  const { open, ready, isGettingLinkToken } = usePlaid();
  const [isOpen, setIsOpen] = useState(false);
  const institutions = useAtomValue(institutionsAtom);
  const selectedInstitution = useAtomValue(selectedInstitutionAtom);
  const setSelectedInstitution = useSetAtom(setSelectedInstitutionAtom);
  const isInsItemIdSyncingOrLoading = useAtomValue(isInsItemIdSyncingOrLoadingAtom);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          disabled={disabled}
          aria-label="Select an institution"
          className="w-[420px] flex items-center"
        >
          <span className="flex flex-row">
            {selectedInstitution ? selectedInstitution.name : 'Select an institution'}
          </span>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[420px]">
        <Command>
          {!!institutions && !!institutions.length && (
            <>
              <CommandList>
                <CommandGroup>
                  {institutions.map((ins) => (
                    <CommandItem
                      key={ins.item_id}
                      className="text-md"
                      loading={ins.item_id === isInsItemIdSyncingOrLoading}
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
            </>
          )}
          <CommandList>
            <CommandGroup>
              <CommandItem
                className="text-md"
                onSelect={() => open()}
                disabled={!ready}
                loading={isGettingLinkToken}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Institution
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
