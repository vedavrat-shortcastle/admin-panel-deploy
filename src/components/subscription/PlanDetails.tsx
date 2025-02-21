import DatePicker from '@/components/DatePickerForForm';
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
import { costumerFormReturn } from '@/types/customerSection';

import React from 'react';

interface PlanDetailsProps {
  form: costumerFormReturn;
}

const PlanDetails: React.FC<PlanDetailsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-6">
          <FormField
            control={form.control}
            name="freeSeats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Free Seats</FormLabel>
                <FormControl>
                  <Input placeholder="John" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-6">
          <FormField
            control={form.control}
            name="paidSeats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paid Seats</FormLabel>
                <FormControl>
                  <Input placeholder="Joe" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6 space-y-2">
          <FormField
            control={form.control}
            name="planType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-medium">Plan Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Plan Type" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="ANNUAL">Annual</SelectItem>
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
            name="renewalType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-medium">Renewal Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Renewal Type" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6 space-y-2">
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-medium">Currency</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Curency" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6 space-y-2">
          <FormField
            control={form.control}
            name="currentStatus"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-medium">Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Plan Type" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="churned">Churned</SelectItem>
                      <SelectItem value="high_prospect">
                        High Prospect
                      </SelectItem>
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
            name="paymentMode"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-medium">Payment Mode</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Payment Mode" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="MODE1">MODE1</SelectItem>
                      <SelectItem value="MODE2">MODE2</SelectItem>
                      <SelectItem value="MODE3">MODE3</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-6">
          <DatePicker
            form={form}
            label="Plan Start Date"
            fieldName="planStartDate"
          />
        </div>
        <div className="col-span-6">
          <DatePicker
            form={form}
            label="Plan End Date"
            fieldName="planEndDate"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6 space-y-2">
          <FormField
            control={form.control}
            name="salesType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-medium">Sales Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Curency" />
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
        <div className="col-span-12 lg:col-span-6 space-y-2">
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
  );
};

export default PlanDetails;
