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
import { subscriptionFormReturns } from '@/types/customerSection';

import React from 'react';

interface customerDetailsProps {
  form: subscriptionFormReturns;
}

const SubscriptionDetails: React.FC<customerDetailsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
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
        <div className="col-span-6">
          <FormField
            control={form.control}
            name="freeSeats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Free Seats</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
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
                  <Input
                    type="number"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
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
                      <SelectItem value="MANUAL">Manual</SelectItem>
                      <SelectItem value="AUTOMATIC">Automatic</SelectItem>
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
                      <SelectValue placeholder="Select Curency" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="STRIPE_US">Stripe US</SelectItem>
                      <SelectItem value="STRIPE_CANADA">
                        Stripe Canada
                      </SelectItem>
                      <SelectItem value="STRIPE_SINGAPORE">
                        Stripe Singapore
                      </SelectItem>
                      <SelectItem value="RAZORPAY_INDIA">
                        Razorpay India
                      </SelectItem>
                      <SelectItem value="G_PAY">GPAY</SelectItem>
                      <SelectItem value="BANK_TRANSFER">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
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
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
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
        <div className="col-span-6 lg:col-span-6 space-y-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6">
          <FormField
            control={form.control}
            name="saleChannel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sales Channel</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
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

export default SubscriptionDetails;
