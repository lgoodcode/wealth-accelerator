'use client';

import Script from 'next/script';
import { useRef, useEffect } from 'react';
import { useSetAtom } from 'jotai';
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
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { useParsePdf } from '../hooks/use-parse-pdf';
import { insurancePolicyRowsAtom, newPolicyCompanyIdAtom } from '../../atoms';
import { policyInputsSchema, type PolicyInputsSchemaType } from '../../schema';
import type { InsuranceCompany } from '../../types';

interface PolicyInputsFormProps {
  companies: InsuranceCompany[];
}

export function PolicyInputsForm({ companies }: PolicyInputsFormProps) {
  const parsePdf = useParsePdf(companies);
  const fileRef = useRef<HTMLInputElement>(null);
  const setInsurancePolicyRows = useSetAtom(insurancePolicyRowsAtom);
  const setNewPolicyCompanyId = useSetAtom(newPolicyCompanyIdAtom);
  const form = useForm<PolicyInputsSchemaType>({
    resolver: zodResolver(policyInputsSchema),
  });

  // When resetting the file, we need to keep the company value because it won't reset
  // properly for some reason
  const resetFileInput = () => {
    form.reset({
      company: form.getValues('company'),
    });
    // This is used to actually reset the file input value
    if (fileRef.current) {
      fileRef.current.value = '';
    }

    setInsurancePolicyRows([]);
  };

  const handleProcessPdf = async (data: PolicyInputsSchemaType) => {
    try {
      const company_id = companies.find(({ name }) => name === data.company)?.id;

      if (company_id === undefined) {
        throw new Error('Company ID is undefined');
      }

      setInsurancePolicyRows(await parsePdf(company_id, data.file));
      setNewPolicyCompanyId(company_id);
    } catch (error: any) {
      console.error(error);
      captureException(error);
      toast.error('Failed to parse the PDF file');
    }
  };

  // Reset the atom when the form is reset or when the user navigates away from the page
  useEffect(() => {
    return () => {
      setInsurancePolicyRows([]);
    };
  }, []);

  return (
    <>
      {/**
       * Lazy load the PDF parser library. This is used because the npm package is janky
       */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.2.146/pdf.min.js"
        integrity="sha512-hA0/Bv8+ywjnycIbT0xuCWB1sRgOzPmksIv4Qfvqv0DOKP02jSor8oHuIKpweUCsxiWGIl+QaV0E82mPQ7/gyw=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        strategy="lazyOnload"
      />

      <Card className="flex flex-col max-w-[500px] w-full min-w-[280px]">
        <CardHeader className="space-y-1">
          <CardDescription>Select the company policy and then upload the PDF</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(handleProcessPdf, console.log)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Insurance company</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                      <SelectContent side="bottom">
                        {companies.map(({ name }) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Policy PDF</FormLabel>
                    <div className="flex flex-row gap-2">
                      <Input
                        ref={fileRef}
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0] ?? null);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!form.getValues('file')}
                        onClick={resetFileInput}
                      >
                        Reset
                      </Button>
                    </div>
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
                  Process PDF
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
