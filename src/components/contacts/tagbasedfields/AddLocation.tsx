'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { trpc } from '@/utils/trpc';
import { newCitySchema } from '@/schemas/contacts';
import { toast } from '@/hooks/use-toast';

type NewCityValues = z.infer<typeof newCitySchema>;

export default function AddLocation() {
  const createLocationMutation = trpc.location.create.useMutation();

  const form = useForm<NewCityValues>({
    resolver: zodResolver(newCitySchema),
    defaultValues: {
      city: '',
      state: '',
      country: '',
    },
  });

  const handleAddLocation = async () => {
    const values = form.getValues();

    try {
      await createLocationMutation.mutateAsync({
        city: values.city,
        state: values.state,
        country: values.country,
      });

      toast({
        title: 'Location Created!',
        description: 'You can now add the location',
      });
      form.reset();
    } catch (error: any) {
      console.error('Error creating location:', error);

      toast({
        title: 'Error creating location',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City/Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter City" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State/Region (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter State/Region"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="Enter Country" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="button"
          onClick={handleAddLocation}
          disabled={createLocationMutation.isLoading}
        >
          {createLocationMutation.isLoading ? 'Creating...' : 'Add Location'}
        </Button>
      </div>
    </Form>
  );
}
