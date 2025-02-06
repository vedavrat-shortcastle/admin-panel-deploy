'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formSchema } from '@/schemas/contacts';
import type { FormValues } from '@/types/contactSection';
import { useToast } from '@/hooks/use-toast';

import { ProfessionalChessInfo } from '@/components/contacts/ProfessionalInfo';
import { ContactAddressInfo } from '@/components/contacts/ContactAddressInfo';
import { Contact } from 'lucide-react';
import { defaultFormValues } from '@/utils/contactFormDefaults';
import { PersonalContactInfo } from '@/components/contacts/PersonalContactInfo';

export default function NewContactForm() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: defaultFormValues,
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    toast({
      title: 'Form Submitted',
      description: 'Your form has been successfully submitted.',
    });
    form.reset();
    setStep(1);
  };

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      toast({
        title: 'Form Submitted',
        description: 'Your form has been successfully submitted.',
      });
      await form.handleSubmit(onSubmit)();
    } else {
      console.log('Form validation failed:', form.getValues());
      console.log('errors', form.formState.errors);
      // Log form data if validation fails
      toast({
        title: 'Validation Error',
        description: 'Invalid or Incomplete field',
        variant: 'destructive',
      });
    }
  };

  const nextStep = () => {
    setStep((prevStep) => Math.min(prevStep + 1, 3));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
    window.scrollTo(0, 0);
  };

  const stepTitles = [
    'Personal Information',
    'Professional Information',
    'Address and Notes',
  ];

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-start">
            <div className="flex items-center">
              <Contact color="#645EEB" size={35} />
              <div className="ml-2">Add Contact</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {stepTitles[step - 1]}
            </h2>
            <div className="flex mb-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 border-b-4 ${
                    s <= step ? 'border-[#645EEB]' : 'border-gray-300'
                  } pb-2 ${s < 3 ? 'mr-2' : ''}`}
                >
                  Step {s}
                </div>
              ))}
            </div>
          </div>

          <Form {...form}>
            {step === 1 && <PersonalContactInfo form={form} />}
            {step === 2 && <ProfessionalChessInfo form={form} />}
            {step === 3 && <ContactAddressInfo form={form} />}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <Button type="button" onClick={prevStep} variant="outline">
                  Previous
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  variant="accent"
                  onClick={nextStep}
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="accent"
                  onClick={handleSubmit}
                  className="ml-auto"
                >
                  Submit
                </Button>
              )}
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
