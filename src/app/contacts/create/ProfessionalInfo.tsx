import type { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function ProfessionalChessInfo({ form }: { form: UseFormReturn<any> }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-6">
        <FormField
          control={form.control}
          name="currentAcademy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Academy</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-6">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="coach">Coach</SelectItem>
                  <SelectItem value="player">Player</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-12">
        <FormField
          control={form.control}
          name="academyNames"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Academy Names (Multiple)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Separate academy names with commas"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-12">
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-12">
        <FormField
          control={form.control}
          name="workingMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Working Mode</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <label htmlFor="online">Online</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="offline" id="offline" />
                    <label htmlFor="offline">Offline</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hybrid" id="hybrid" />
                    <label htmlFor="hybrid">Hybrid</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-6">
        <FormField
          control={form.control}
          name="onlinePercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Online Percentage</FormLabel>
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
      <div className="col-span-6">
        <FormField
          control={form.control}
          name="offlinePercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offline Percentage</FormLabel>
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
      <div className="col-span-4">
        <FormField
          control={form.control}
          name="rating.classic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Classic Rating</FormLabel>
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
      <div className="col-span-4">
        <FormField
          control={form.control}
          name="rating.rapid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rapid Rating</FormLabel>
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
      <div className="col-span-4">
        <FormField
          control={form.control}
          name="rating.blitz"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blitz Rating</FormLabel>
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
      <div className="col-span-6">
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
      </div>
      <div className="col-span-6">
        <FormField
          control={form.control}
          name="titles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titles</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue="FIDE-trainer"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select titles" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="FIDE-trainer">FIDE Trainer </SelectItem>
                  <SelectItem value="FIDE-instructor">
                    FIDE Instructor
                  </SelectItem>
                  <SelectItem value="GM">GM</SelectItem>
                  <SelectItem value="IM">IM</SelectItem>
                  <SelectItem value="WIM">WIM</SelectItem>
                  <SelectItem value="WGM">WGM</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-6">
        <FormField
          control={form.control}
          name="physicallyTaught"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Physical Locations Taught</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-6">
        <FormField
          control={form.control}
          name="lastContacted"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Contacted</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split('T')[0]
                      : ''
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
      <div className="col-span-12">
        <FormField
          control={form.control}
          name="customTags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Tags</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Separate tags with commas" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-6">
        <FormField
          control={form.control}
          name="yearsInOperation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years in Operation</FormLabel>
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
      <div className="col-span-6">
        <FormField
          control={form.control}
          name="numberOfCoaches"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Coaches</FormLabel>
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
      <div className="col-span-12">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue="active">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-12">
        <FormField
          control={form.control}
          name="profilePhoto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Photo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
