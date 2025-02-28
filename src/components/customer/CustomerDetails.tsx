import SearchContact from '@/components/customer/SearchContact';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { subscriptionFormReturns } from '@/types/customerSection';
import { AcademyNames } from '@/components/contacts/tagbasedfields/AcademyNamesField';

interface customerDetailsProps {
  form: subscriptionFormReturns;
}

export const CustomerDetails: React.FC<customerDetailsProps> = ({ form }) => {
  const academyId = form.watch('academyId');
  return (
    <div>
      <div className="space-y-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <SearchContact form={form} />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-6">
            <AcademyNames form={form} mode="single" initialIds={academyId} />
          </div>
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="adminName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="salesPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales Person</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="salesType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Sake Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UPSELL">UPSELL</SelectItem>
                        <SelectItem value="NEW">NEW</SelectItem>
                        <SelectItem value="RENEWAL">RENEWAL</SelectItem>
                        <SelectItem value="ONETIME">ONETIME</SelectItem>
                        <SelectItem value="LIFETIME">LIFETIME</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="col-span-12">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};
