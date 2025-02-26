'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { contactUpdateSchema } from '@/schemas/contacts';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import type { Contact } from '@/types/contact';
import { toast } from '@/hooks/use-toast';
import { LanguagesSpoken } from '@/components/contacts/tagbasedfields/LanguagesSpoken';
import { InitialData } from '@/app/contacts/[id]/contactProfile/contactData';
import { trpc } from '@/hooks/trpc-provider';
import { PersonalContactInfo } from '@/app/contacts/[id]/contactProfile/personalDetails';
import { ProfessionalChessInfo } from '@/app/contacts/[id]/contactProfile/professionalDetails';
import { ContactAddressInfo } from '@/app/contacts/[id]/contactProfile/contactDetails';
import { PhysicallyTaught } from '@/components/contacts/tagbasedfields/PhysicallyTaught';

interface ContactProfileProps {
  contact: Contact;
}

export const ContactProfile: React.FC<ContactProfileProps> = ({ contact }) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(contactUpdateSchema),
    defaultValues: contact || InitialData,
  });
  const physicallyTaughtIds = form.watch('physicallyTaught');

  const { mutate: updateContact, isLoading } =
    trpc.contacts.updateById.useMutation();

  const handleSaveChanges = async () => {
    const isValid = await form.trigger();

    if (!isValid) {
      toast({
        title: 'Error',
        description: 'Validation failed! Give proper inputs.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const currentFormData = form.getValues();
      if (!contact?.id) {
        toast({
          title: 'Error',
          description: 'Invalid contact ID',
          variant: 'destructive',
        });
        return;
      }

      const { ...restFormData } = currentFormData;
      updateContact(
        { id: contact.id, ...restFormData },
        {
          onSuccess: () => {
            toast({
              title: 'Contact updated',
              description: 'The contact has been successfully updated.',
            });
            router.refresh();
          },
          onError: () => {
            toast({
              title: 'Error',
              description: 'Failed to update the contact. Please try again.',
              variant: 'destructive',
            });
          },
        }
      );
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <div className="grid md:grid-cols-[300px_1fr] gap-6 bg-white rounded-lg shadow-sm">
          <aside className="p-6 border-r">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <p>Player</p>
              </div>
              <div className="relative w-48 h-48 mx-auto">
                <Image
                  src={
                    'https://static.vecteezy.com/system/resources/previews/014/194/232/original/avatar-icon-human-a-person-s-badge-social-media-profile-symbol-the-symbol-of-a-person-vector.jpg'
                  }
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="w-full"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit details
                </Button>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Contact
                </Button>
              </div>
            </div>
          </aside>
          <main className="p-6">
            <fieldset disabled={!isEditing} className="p6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSaveChanges)}
                  className="space-y-6"
                >
                  <PersonalContactInfo form={form} />
                  <Separator />
                  <div className="grid md:grid-cols-1 gap-6">
                    <LanguagesSpoken form={form} />
                  </div>
                  <Separator />
                  <ProfessionalChessInfo form={form} />
                  <PhysicallyTaught
                    form={form}
                    initialLocationIds={physicallyTaughtIds}
                  />
                  <Separator />
                  <ContactAddressInfo form={form} />
                  <Separator />
                  <div>
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default ContactProfile;
