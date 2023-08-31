import { useAtomValue } from 'jotai';
import { useForm } from 'react-hook-form';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useSavePolicy } from '../hooks/use-save-policy';
import { insurancePolicyRowsAtom } from '../../atoms';
import { policySaveSchema, type PolicySaveSchemaType } from '../../schema';

interface PolicySaveCardProps {
  users: {
    id: string;
    name: string;
  }[];
}

export function PolicySaveCard({ users }: PolicySaveCardProps) {
  const savePolicy = useSavePolicy();
  const insurancePolicyRows = useAtomValue(insurancePolicyRowsAtom);
  const form = useForm<PolicySaveSchemaType>({
    resolver: zodResolver(policySaveSchema),
  });

  if (!insurancePolicyRows.length) {
    return null;
  }

  const handleSave = async (data: PolicySaveSchemaType) => {
    await savePolicy(data.policy_name, data.user_id)
      .then(() => {
        form.reset();
        toast.success('Policy saved successfully');
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error('An error occurred while saving the policy');
      });
  };

  return (
    <Card className="flex flex-col max-w-[500px] w-full min-w-[280px]">
      <CardHeader className="space-y-1">
        <CardDescription>
          Enter the name for this policy, select the user, and save it
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
            <FormField
              control={form.control}
              name="policy_name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Policy name</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>User</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      {users.map(({ id, name }) => (
                        <SelectItem key={id} value={id}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid}
                loading={form.formState.isSubmitting}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
