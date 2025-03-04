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
import { Card, CardContent } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUsageSchema, usageFormValues } from '@/schemas/usage';
import { usageFormDefaults } from '@/utils/usageFormDefaults';
import { GaugeCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AcademyNames } from '@/components/contacts/tagbasedfields/AcademyNamesField';

export default function UsageForm() {
  // form initialisation
  const form = useForm<usageFormValues>({
    resolver: zodResolver(createUsageSchema),
    mode: 'onTouched',
    defaultValues: usageFormDefaults,
  });

  // after submition
  const onSubmit = (data: any) => {
    console.log('Form Data:', data);
    toast({
      title: 'succesfully Submitted',
      description: 'succesfully Submitted.',
      // variant: 'default',
    });
  };
  // Redirecting to usage page
  // redirection code

  return (
    <div className="flex flex-col items-center min-h-screen  p-4">
      <div className="flex items-center w-full mb-4">
        <GaugeCircle className="text-primary" size={35} strokeWidth={2} />

        <h1 className="text-2xl m-2 font-bold">Usage</h1>
      </div>
      <div className="w-full max-w-3xl p-0 border rounded-lg shadow-md">
        <div className="bg-gray-900 text-white p-4 rounded-t-lg text-lg font-bold">
          Usage
        </div>
        <div className="p-4">
          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* FORM FIELDS */}

              <AcademyNames mode="single" form={form} />
              <FormField
                control={form.control}
                name="coach"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coach Name *</FormLabel>
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

              {/* BUTTONS */}
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

              {/* NOTE  */}
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Card className="w-full  ">
                    <CardContent
                      className="rounded-sm"
                      style={{ backgroundColor: 'rgb(245, 244, 255)' }}
                    >
                      <h2 className="text-sm font-semibold mb-2">
                        Usage metrics color code
                      </h2>
                      <ul className="text-sm">
                        <li>
                          <span>0%</span> - Black
                        </li>
                        <li>
                          <span>&lt; 20%</span> - Red
                        </li>
                        <li>
                          <span>20% - 40%</span> - Orange
                        </li>
                        <li>
                          <span>40% - 60%</span> - Blue
                        </li>
                        <li>
                          <span>60% - 80%</span> - Light green
                        </li>
                        <li>
                          <span>80% - 100%</span> - Dark green
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </FormControl>
              </FormItem>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
