'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { PersonalContactInfo } from '@/app/contacts/create/PersonalContantInfo';
import { ProfessionalChessInfo } from '@/app/contacts/create/ProfessionalInfo';
import { ContactAddressInfo } from '@/app/contacts/create/ContactAddressInfo';

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters.' }),
  role: z.string(),
  email: z.string().email({ message: 'Invalid email address.' }),
  phoneNumber: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits.' }),
  academyNames: z.array(z.string()),
  website: z
    .string()
    .url({ message: 'Invalid URL.' })
    .optional()
    .or(z.literal('')),
  country: z
    .string()
    .min(2, { message: 'Country must be at least 2 characters.' }),
  yearOfBirth: z.number().min(1900).max(new Date().getFullYear()),
  dateOfBirth: z.date(),
  gender: z.enum(['male', 'female', 'other']),
  languagesSpoken: z.array(z.string()),
  currentAcademy: z.string(),
  workingMode: z.enum(['online', 'offline', 'hybrid']),
  onlinePercentage: z.number().min(0).max(100).optional(),
  offlinePercentage: z.number().min(0).max(100).optional(),
  stateRegion: z.string(),
  cityLocation: z.string(),
  address: z.string(),
  social: z.object({
    linkedin: z.string().url().optional(),
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    twitter: z.string().url().optional(),
  }),
  rating: z.object({
    classic: z.number().optional(),
    rapid: z.number().optional(),
    blitz: z.number().optional(),
  }),
  fideId: z.string().optional(),
  titles: z.array(z.string()),
  physicallyTaught: z.array(z.string()),
  lastContacted: z.date().optional(),
  notes: z.string().optional(),
  customTags: z.array(z.string()),
  yearsInOperation: z.number().min(0),
  numberOfCoaches: z.number().min(0),
  status: z.enum(['active', 'inactive', 'pending']),
  profilePhoto: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ChessCoachForm() {
  const [step, setStep] = useState(1);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, 3));
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  return (
    <div className="mx-40">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {step === 1 && <PersonalContactInfo form={form} />}
          {step === 2 && <ProfessionalChessInfo form={form} />}
          {step === 3 && <ContactAddressInfo form={form} />}

          <div className="flex justify-between">
            {step > 1 && (
              <Button type="button" onClick={prevStep}>
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
