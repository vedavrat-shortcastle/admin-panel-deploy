'use client';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUsageSchema, usageFormValues } from '@/schemas/usage';
import { usageFormDefaults } from '@/utils/usageFormDefaults';
import { AcademyNames } from '../contacts/tagbasedfields/AcademyNamesField';

export default function UsageForm() {
  const form = useForm<usageFormValues>({
    resolver: zodResolver(createUsageSchema),
    mode: 'onTouched',
    defaultValues: usageFormDefaults,
  });

  const onSubmit = (data: any) => {
    console.log('Form Data:', data);
  };

  return (
    <div className="flex flex-col items-center   p-4">
      <div className="w-full max-w-3xl p-0 border rounded-lg shadow-md">
        {/* <div className="bg-gray-900 text-white p-4 rounded-t-lg text-lg font-bold">Usage</div> */}
        <div className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <AcademyNames mode="single" form={form} />
              <FormField
                control={form.control}
                name="coach"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Coach Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Coach Name" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="overallUsageColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overall Usage Color %</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Overall Usage Color" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="classroomColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classroom Color %</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Classroom Color" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tournamentColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tournament Color %</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Tournament Color" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coursesColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Courses Color %</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Courses Color" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gameAreaColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game Area Color %</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Game Area Color" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quizColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiz Color %</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Quiz Color" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assignmentColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignment Color %</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Assignment Color" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="databaseColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Database Color %</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Database Color" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline">
                  Back
                </Button>
                <Button
                  type="submit"
                  style={{ backgroundColor: 'rgb(116, 112, 219)' }}
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
