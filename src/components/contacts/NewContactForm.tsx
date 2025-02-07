'use client';

import React, { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
  contactAddressSchema,
  formSchema,
  personalInfoSchema,
  professionalInfoSchema,
} from '@/schemas/contacts';
import type { FormValues } from '@/types/contactSection';
import { useToast } from '@/hooks/use-toast';

import { ProfessionalChessInfo } from '@/components/contacts/ProfessionalInfo';
import { ContactAddressInfo } from '@/components/contacts/ContactAddressInfo';
import { defaultFormValues } from '@/utils/contactFormDefaults';
import { PersonalContactInfo } from '@/components/contacts/PersonalContactInfo';

export default function NewContactForm() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched', // Ensures errors appear when a field is touched
    defaultValues: defaultFormValues,
  });

  const stepSchemas = [
    personalInfoSchema,
    professionalInfoSchema,
    contactAddressSchema,
  ];

  const scrollableRef = useRef<HTMLDivElement>(null!);

  const validateStep = async () => {
    const schema = stepSchemas[step - 1];
    const fieldsToValidate = Object.keys(schema.shape); // Get fields for the current step

    const isValid = await form.trigger(fieldsToValidate as any, {
      shouldFocus: true,
    });

    if (!isValid) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in the required fields.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

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
    const isValid = await form.trigger(); // Validate the entire form on final submit
    if (isValid) {
      await form.handleSubmit(onSubmit)();
    } else {
      toast({
        title: 'Validation Error',
        description: 'Please complete all required fields.',
        variant: 'destructive',
      });
    }
  };

  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setStep((prevStep) => Math.min(prevStep + 1, 3));
      setTimeout(() => {
        scrollableRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    }
  };

  const prevStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
    setTimeout(() => {
      scrollableRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  };

  const stepTitles = ['Personal Info', 'Professional Info', 'Address & Notes'];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">{stepTitles[step - 1]}</h2>
      </div>

      {/* Scrollable Content */}
      <div ref={scrollableRef} className="flex-grow overflow-y-auto pr-3">
        <Form {...form}>
          {step === 1 && <PersonalContactInfo form={form} />}
          {step === 2 && (
            <ProfessionalChessInfo scrollableRef={scrollableRef} form={form} />
          )}
          {step === 3 && <ContactAddressInfo form={form} />}
        </Form>
      </div>

      {/* Action Buttons - Fixed at Bottom */}
      <div className="p-4 border-t flex justify-between bg-white">
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
    </div>
  );
}
