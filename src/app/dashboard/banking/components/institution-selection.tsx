'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, PlusCircle, Landmark } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const teams = [
  {
    label: 'Alicia Koch',
    value: 'personal',
  },

  {
    label: 'Acme Inc.',
    value: 'acme-inc',
  },
  {
    label: 'Monsters Inc.',
    value: 'monsters',
  },
];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface InstitutionSelectionProps extends PopoverTriggerProps {}

export function InstitutionSelection({ className }: InstitutionSelectionProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState(null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select an institution"
          className={cn('w-[420px] flex items-center text-muted-foreground', className)}
        >
          <span className="flex flex-row">
            <Landmark className="h-5 w-5" />
            <span className="ml-2">No institution selected</span>
          </span>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[420px]">
        <Command>
          <CommandList>
            {teams.map((team: any) => (
              <CommandItem
                key={team.value}
                onSelect={() => {
                  setSelectedTeam(team);
                  setOpen(false);
                }}
                className="text-md"
              >
                {team.label}
              </CommandItem>
            ))}
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                className="text-md"
                onSelect={() => {
                  // Plaid open
                }}
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
