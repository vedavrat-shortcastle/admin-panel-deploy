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

// ✅ Define type for form values based on the schema
type NewCityValues = z.infer<typeof newCitySchema>;

export default function AddLocation() {
  const createLocationMutation = trpc.location.create.useMutation();

  // ✅ Initialize react-hook-form
  const form = useForm<NewCityValues>({
    resolver: zodResolver(newCitySchema),
    defaultValues: {
      city: '',
      state: '',
      country: '',
    },
  });

  // ✅ Function to handle form submission
  const handleAddLocation = async () => {
    const values = form.getValues(); // Get form values manually

    try {
      await createLocationMutation.mutateAsync({
        city: values.city,
        state: values.state,
        country: values.country,
      });

      // ✅ Show success toast
      toast({
        title: 'Location Created!',
        description: 'You can now add the location',
      });
      form.reset(); // ✅ Reset form after successful submission
    } catch (error: any) {
      console.error('Error creating location:', error);

      // ✅ Show error toast
      toast({
        title: 'Error creating location',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-4">
        {/* ✅ City Input */}
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

        {/* ✅ State Input (Optional) */}
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

        {/* ✅ Country Input */}
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

        {/* ✅ Add Location Button */}
        <Button
          type="button"
          onClick={handleAddLocation} // Manually trigger the function
          disabled={createLocationMutation.isLoading}
        >
          {createLocationMutation.isLoading ? 'Creating...' : 'Add Location'}
        </Button>
      </div>
    </Form>
  );
}
