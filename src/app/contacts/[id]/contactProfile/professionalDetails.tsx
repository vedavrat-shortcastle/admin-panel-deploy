import type React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ContactFormReturn } from '@/types/contactSection';
import { Titles } from '@/components/contacts/tagbasedfields/Titles';
import { AcademyNames } from '@/components/contacts/tagbasedfields/AcademyNamesField';
import { CustomTagsField } from '@/components/contacts/tagbasedfields/CustomTagsField';
import { CurrentAcademy } from '@/components/contacts/tagbasedfields/CurrentAcademyField';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ProfessionalChessInfoProps {
  form: ContactFormReturn;
}

export const ProfessionalChessInfo: React.FC<ProfessionalChessInfoProps> = ({
  form,
}) => {
  const academyIds =
    form
      .watch('academies')
      ?.map((academy: { academyId: string }) => academy.academyId) || [];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <AcademyNames initialIds={academyIds} form={form} mode="multiple" />
      </div>

      <div className="mt-6">
        <CurrentAcademy form={form} />
      </div>

      <Separator className="my-6" />

      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="teachingMode"
          render={({ field }) => (
            <FormItem className="col-span-full md:col-span-1">
              <FormLabel className="font-medium">Teaching Mode</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-4"
                >
                  {['online', 'offline', 'hybrid'].map((mode) => (
                    <div key={mode} className="flex items-center space-x-2">
                      <RadioGroupItem value={mode} id={mode} />
                      <label className="font-medium capitalize" htmlFor={mode}>
                        {mode}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fideId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">FIDE ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="onlinePercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Online Percentage</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="offlinePercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Offline Percentage</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator className="my-6" />

      <div className="grid md:grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Website</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          {['classicRating', 'rapidRating', 'blitzRating'].map((ratingType) => (
            <FormField
              key={ratingType}
              control={form.control}
              name={ratingType}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    {ratingType.replace('Rating', ' Rating')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid md:grid-cols-2 gap-6">
        <Titles form={form} />
        <CustomTagsField form={form} />
      </div>

      <Separator className="my-6" />
    </div>
  );
};
