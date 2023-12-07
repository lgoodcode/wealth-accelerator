'use client';

import { useState, useCallback } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { ChevronsUpDown, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { accountsAtom, selectedAccountAtom } from '../atoms';
import { CreateAccountDialog } from './create-account-dialog';

export function AccountSelection() {
  const accounts = useAtomValue(accountsAtom);
  const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreateDialogOpenChange = useCallback((open?: boolean) => {
    setShowCreateDialog((prev) => open ?? !prev);
  }, []);

  return (
    <>
      <CreateAccountDialog open={showCreateDialog} onOpenChange={handleCreateDialogOpenChange} />

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            aria-label="Select an account"
            className="w-[420px] flex items-center"
          >
            <span className="flex flex-row">
              {!!selectedAccount ? selectedAccount.name : 'Select an account'}
            </span>
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[420px]">
          <Command>
            {!!accounts && !!accounts.length && (
              <>
                <CommandList>
                  <CommandGroup>
                    {accounts.map((account) => (
                      <CommandItem
                        key={`account-${account.id}`}
                        className="text-md"
                        onSelect={() => {
                          setIsOpen(false);
                          setSelectedAccount(account);
                        }}
                      >
                        {account.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
                <CommandSeparator />
              </>
            )}
            <CommandList>
              <CommandGroup>
                <CommandItem className="text-md" onSelect={() => setShowCreateDialog(true)}>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add Account
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
