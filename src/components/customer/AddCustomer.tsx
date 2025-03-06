'use client';

import React, { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

import { trpc } from '@/utils/trpc';
import {
  customerDetailsSchema,
  subscriptionDetailsSchema,
  subscriptionFormValues,
  createSubscriptionSchema,
} from '@/schemas/subscription';
import { CustomerDetails } from '@/components/customer/CustomerDetails';
import SubscriptionDetails from '@/components/customer/SubscriptionDetails';
import { subscriptionFormDefaults } from '@/utils/subscriptionFormDefaults';

export default function AddCustomer() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const form = useForm<subscriptionFormValues>({
    resolver: zodResolver(createSubscriptionSchema),
    mode: 'onTouched',
    defaultValues: subscriptionFormDefaults,
  });

  const createCustomerMutation = trpc.subscription.create.useMutation({
    onSuccess: () => {
      toast({
        title: 'Form Submitted',
        description: 'Your form has been successfully submitted.',
      });
      form.reset();
      setStep(1);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'There was an error submitting the form.',
        variant: 'destructive',
      });
    },
  });

  const stepSchemas = [customerDetailsSchema, subscriptionDetailsSchema];

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
        description: 'Please fill in the required fields.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    createCustomerMutation.mutate(form.getValues());
  };

  const handleSubmit = async () => {
    const isValid = await form.trigger();
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
  };

  const stepTitles = ['Basic Information', 'Subscription and Plan Information'];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">{stepTitles[step - 1]}</h2>
      </div>

      {/* Scrollable Content */}
      <div ref={scrollableRef} className="flex-grow overflow-y-auto p-3">
        <Form {...form}>
          {step === 1 && <CustomerDetails form={form} />}
          {step === 2 && <SubscriptionDetails form={form} />}
        </Form>
      </div>

      {/* Action Buttons - Fixed at Bottom */}
      <div className="p-4 border-t flex justify-between bg-white">
        {step > 1 && (
          <Button type="button" onClick={prevStep} variant="default">
            Previous
          </Button>
        )}
        {step < 2 ? (
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
          >
            {createCustomerMutation.isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        )}
      </div>
    </div>
  );
}
