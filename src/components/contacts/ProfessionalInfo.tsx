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
import { AcademyNames } from '@/components/contacts/tagbasedfields/AcademyNamesField';
import { PhysicallyTaught } from '@/components/contacts/tagbasedfields/PhysicallyTaught';
import { Titles } from '@/components/contacts/tagbasedfields/Titles';

import { LanguagesSpoken } from '@/components/contacts/tagbasedfields/LanguagesSpoken';
import { CustomTags } from '@/components/contacts/tagbasedfields/CustomTagsField';

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
      {/* First Row: Current Academy and Role */}
      <div className="col-span-12 lg:col-span-6 space-y-2">
        <FormField
          control={form.control}
          name="currentAcademy"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="font-medium">Current Academy</FormLabel>
              <FormControl>
                <Input className="w-full" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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
                    <SelectItem value="coach">Coach</SelectItem>
                    <SelectItem value="player">Player</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Academy Names */}
      <div className="col-span-12">
        <AcademyNames form={form} />
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

      {/* Working Mode */}
      <div className="col-span-12 space-y-2">
        <FormField
          control={form.control}
          name="workingMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Working Mode</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <label className="font-medium" htmlFor="online">
                      Online
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="offline" id="offline" />
                    <label className="font-medium" htmlFor="offline">
                      Offline
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hybrid" id="hybrid" />
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
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
        <CustomTags form={form} />
      </div>

      <div className="col-span-12">
        <LanguagesSpoken scrollableRef={scrollableRef} form={form} />
      </div>
    </div>
  );
};
