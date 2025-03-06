'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { subscriptionFormValues } from '@/types/customerSection';
import { CustomerDetails } from '@/components/customer/CustomerDetails';
import SubscriptionDetails from '@/components/customer/SubscriptionDetails';
import { Subscription } from '@/types/subscription';
import { Form } from '@/components/ui/form';
import { trpc } from '@/utils/trpc';
import { createSubscriptionSchema } from '@/schemas/subscription';

interface CustomerProfileProps {
  subscription: Subscription;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({
  subscription,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  const form = useForm<subscriptionFormValues>({
    resolver: zodResolver(createSubscriptionSchema),
    defaultValues: subscription,
  });

  const { mutate: updateSubscription, isLoading } =
    trpc.subscription.update.useMutation();

  const handleSaveChanges = async () => {
    const isValid = await form.trigger();

    if (!isValid) {
      console.error('Validation Errors:', form.formState.errors);
      toast({
        title: 'Error',
        description: 'Validation failed! Give proper inputs.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const currentFormData = form.getValues();
      if (!subscription?.id) {
        toast({
          title: 'Error',
          description: 'Invalid subscription ID',
          variant: 'destructive',
        });
        return;
      }

      const { ...restFormData } = currentFormData;
      updateSubscription(
        { id: subscription.id.toString(), data: restFormData },
        {
          onSuccess: () => {
            toast({
              title: 'Subscription updated',
              description: 'The subscription has been successfully updated.',
            });
            router.refresh();
          },
          onError: (error) => {
            console.error('TRPC Error:', error);
            toast({
              title: 'Error',
              description:
                'Failed to update the subscription. Please try again.',
              variant: 'destructive',
            });
          },
        }
      );
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <div className="grid md:grid-cols-[300px_1fr] gap-6 bg-white rounded-lg shadow-sm">
          {/* Left Section */}
          <div className="p-6 border-r">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <p>Customer</p>
              </div>
              <form className="relative w-48 h-48 mx-auto">
                <label htmlFor="profile-upload" className="cursor-pointer">
                  <Image
                    src="https://static.vecteezy.com/system/resources/previews/014/194/232/original/avatar-icon-human-a-person-s-badge-social-media-profile-symbol-the-symbol-of-a-person-vector.jpg"
                    alt="Profile"
                    fill
                    className="rounded-full object-cover"
                  />
                </label>
              </form>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="w-full"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit details
                </Button>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <fieldset disabled={!isEditing} className="p6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSaveChanges)}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-1 gap-6">
                  <CustomerDetails form={form}></CustomerDetails>
                </div>
                <Separator />
                <div className="grid md:grid-cols-1 gap-6">
                  <SubscriptionDetails form={form}></SubscriptionDetails>
                </div>

                <Separator />

                {isEditing && (
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" onClick={handleSaveChanges}>
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </fieldset>
        </div>
      </div>
    </div>
  );
};
