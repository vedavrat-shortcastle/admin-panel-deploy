import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { ContactFormReturn } from '@/types/contactSection';
import { Address } from '@/components/contacts/Address';
import DatePicker from '@/components/DatePickerForForm';

interface ContactAddressProps {
  form: ContactFormReturn;
}

export const ContactAddressInfo: React.FC<ContactAddressProps> = ({ form }) => {
  return (
    <div className="p6">
      <Address form={form} />
      <div className="grid mt-2 md:grid-cols-2 gap-6">
        <DatePicker
          form={form}
          label="Last Contacted"
          fieldName="lastContacted"
        />

        <FormField
          control={form.control}
          name="yearsInOperation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years in operation</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))} // Convert input value to number
                  value={field.value ?? ''} // Ensure value is controlled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numberOfCoaches"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No of coaches</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))} // Convert input value to number
                  value={field.value ?? ''} // Ensure value is controlled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Status<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="linkedinUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Linkedin</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instagramUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="facebookUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="twitterUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
