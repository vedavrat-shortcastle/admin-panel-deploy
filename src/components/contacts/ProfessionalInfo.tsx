import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

import { ContactFormReturn } from '@/types/contactSection';

import { PhysicallyTaught } from '@/components/contacts/tagbasedfields/PhysicallyTaught';
import { Titles } from '@/components/contacts/tagbasedfields/Titles';

import { LanguagesSpoken } from '@/components/contacts/tagbasedfields/LanguagesSpoken';

import { AcademyNames } from '@/components/contacts/tagbasedfields/AcademyNamesField';
import { CustomTagsField } from '@/components/contacts/tagbasedfields/CustomTagsField';
import { CurrentAcademy } from '@/components/contacts/tagbasedfields/CurrentAcademyField';

interface ProfessionalChessInfoProps {
  form: ContactFormReturn; // Ensure this type is correctly defined
  scrollableRef: React.RefObject<HTMLDivElement>;
}

export const ProfessionalChessInfo: React.FC<ProfessionalChessInfoProps> = ({
  form,
  scrollableRef,
}) => {
  return (
    <div className="grid grid-cols-12 gap-6 ">
      <div className="col-span-12 lg:col-span-6 space-y-2">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="font-medium">Role</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="FOUNDER">Founder</SelectItem>
                    <SelectItem value="HEADCOACH">Headcoach</SelectItem>
                    <SelectItem value="SUBCOACH">Subcoach</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-12 lg:col-span-6 space-y-2">
        <FormField
          control={form.control}
          name="currentStatus"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="font-medium">Current Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Current Stutus" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="LEAD">Lead</SelectItem>
                    <SelectItem value="PROSPECT">Prospect</SelectItem>
                    <SelectItem value="HIGH_PROSPECT">Hugh Prospect</SelectItem>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-12">
        <AcademyNames mode="multiple" form={form} />
      </div>
      <div className="col-span-12">
        <CurrentAcademy form={form} />
      </div>
      <div className="col-span-12">
        <PhysicallyTaught form={form} />
      </div>
      {/* Website */}
      <div className="col-span-12 space-y-2">
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Website</FormLabel>
              <FormControl>
                <Input type="url" className="w-full" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Teaching Mode */}
      <div className="col-span-12 space-y-2">
        <FormField
          control={form.control}
          name="teachingMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Teaching Mode</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ONLINE" id="online" />
                    <label className="font-medium" htmlFor="online">
                      Online
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="OFFLINE" id="offline" />
                    <label className="font-medium" htmlFor="offline">
                      Offline
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="HYBRID" id="hybrid" />
                    <label className="font-medium" htmlFor="hybrid">
                      Hybrid
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-12 lg:col-span-6 ">
        <FormField
          control={form.control}
          name="fideId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">FIDE ID</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="w-full"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-12 lg:col-span-6 ">
        <Titles form={form} />
      </div>
      {/* Percentages */}
      <div className="col-span-12 lg:col-span-6 space-y-2">
        <FormField
          control={form.control}
          name="onlinePercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Online Percentage</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="w-full"
                  {...field}
                  onChange={(e) => {
                    const newValue = e.target.valueAsNumber;
                    field.onChange(newValue);
                    form.setValue('offlinePercentage', 100 - newValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-12 lg:col-span-6 space-y-2">
        <FormField
          control={form.control}
          name="offlinePercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Offline Percentage</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="w-full"
                  {...field}
                  onChange={(e) => {
                    const newValue = e.target.valueAsNumber;
                    field.onChange(newValue);
                    form.setValue('onlinePercentage', 100 - newValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Ratings */}
      <div className="col-span-12 lg:col-span-4 space-y-2">
        <FormField
          control={form.control}
          name="rating.classic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Classic Rating</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="w-full"
                  {...field}
                  value={isNaN(field.value) ? '' : field.value}
                  onChange={(e) => {
                    const newValue = e.target.valueAsNumber;
                    field.onChange(isNaN(newValue) ? '' : newValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 space-y-2">
        <FormField
          control={form.control}
          name="rating.rapid"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Rapid Rating</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="w-full"
                  {...field}
                  value={isNaN(field.value) ? '' : field.value}
                  onChange={(e) => {
                    const newValue = e.target.valueAsNumber;
                    field.onChange(isNaN(newValue) ? '' : newValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 space-y-2">
        <FormField
          control={form.control}
          name="rating.blitz"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Blitz Rating</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="w-full"
                  {...field}
                  value={isNaN(field.value) ? '' : field.value}
                  onChange={(e) => {
                    const newValue = e.target.valueAsNumber;
                    field.onChange(isNaN(newValue) ? '' : newValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-12">
        <CustomTagsField form={form} />
      </div>
      <div className="col-span-12">
        <LanguagesSpoken scrollableRef={scrollableRef} form={form} />
      </div>
    </div>
  );
};
