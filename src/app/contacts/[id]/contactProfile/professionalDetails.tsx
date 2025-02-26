import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { ContactFormReturn } from '@/types/contactSection';
import { Titles } from '@/components/contacts/tagbasedfields/Titles';
import { AcademyNames } from '@/components/contacts/tagbasedfields/AcademyNamesField';
import { CustomTagsField } from '@/components/contacts/tagbasedfields/CustomTagsField';
import { CurrentAcademy } from '@/components/contacts/tagbasedfields/CurrentAcademyField';
// import {CurrentAcademy} from '@/app/contacts/[id]/contactProfile/CurrentAcademyField'
import { Separator } from '@/components/ui/separator';

interface ProfessionalChessInfoProps {
  form: ContactFormReturn; // Ensure this type is correctly defined
  scrollableRef: React.RefObject<HTMLDivElement>;
}

export const ProfessionalChessInfo: React.FC<ProfessionalChessInfoProps> = ({
  form,
}) => {
  // useEffect()
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6">
        <AcademyNames form={form} mode="multiple" />

        {/* <PhysicallyTaught form={form} /> */}
      </div>
      <Separator />

      {/* Working Mode */}
      <div className="grid md:grid-cols-4 gap-6">
        <FormField
          control={form.control}
          name="teachingMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Working mode<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>FIDE ID</FormLabel>
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
      <Separator />
      <div className="grid md:grid-cols-4 gap-6">
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
        <FormField
          control={form.control}
          name="classicRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Classic Rating</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="w-full"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rapidRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Rapid Rating</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="w-full"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="blitzRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Blitz Rating</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="w-full"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Separator />
      <div className="grid md:grid-cols-2 gap-6">
        <Titles form={form} />
        <CustomTagsField form={form} />
      </div>
      <div>
        <CurrentAcademy form={form} />
      </div>
      <Separator />
    </div>
  );
};
