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
import { trpc } from '@/utils/trpc';

export default function AddContact() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
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
    const fieldsToValidate = Object.keys(schema.shape);

    const isValid = await form.trigger(fieldsToValidate as any, {
      shouldFocus: true,
    });

    if (!isValid) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in the required fields for this step.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const { mutate, isLoading } = trpc.contacts.create.useMutation({
    // Get mutate and isLoading
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Contact has been created.',
      });
      form.reset(); // Reset the form after successful submission
      setStep(1); // Go back to step 1
    },
    onError: (error) => {
      console.error('Error creating contact:', error);
      toast({
        title: 'Error!',
        description: 'Failed to create contact. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    // onSubmit now receives form data
    mutate(data); // Call the mutation with form data
  };

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      form.handleSubmit(onSubmit)(); // Call form's handleSubmit which in turn calls our onSubmit
    } else {
      toast({
        title: 'Validation Error',
        description: 'Please complete all required fields in all steps.',
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
      <div ref={scrollableRef} className="flex-grow overflow-y-auto p-3">
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
          <Button type="button" onClick={prevStep} variant="default">
            Previous
          </Button>
        )}
        {step < 3 ? (
          <Button
            type="button"
            variant="default"
            onClick={nextStep}
            className="ml-auto"
          >
            Next
          </Button>
        ) : (
          <Button
            type="button"
            variant="default"
            onClick={handleSubmit}
            className="ml-auto"
            disabled={isLoading} // Disable button while submitting
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        )}
      </div>
    </div>
  );
}
