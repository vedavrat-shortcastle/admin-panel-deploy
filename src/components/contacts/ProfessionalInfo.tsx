import type { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { academies } from '@/app/contacts/dummyAcademyData';
import { useState } from 'react';

export function ProfessionalChessInfo({ form }: { form: UseFormReturn<any> }) {
  const [filteredAcademies, setFilteredAcademies] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedAcademies, setSelectedAcademies] = useState<string[]>([]);
  const [selectedFromDropdown, setSelectedFromDropdown] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleAcademySearch = (value: string) => {
    const searchValue = value.trim().toLowerCase();
    if (searchValue === '') {
      setFilteredAcademies([]);
      setShowDropdown(false);
      return;
    }

    const filtered = academies
      .filter(
        (academy) =>
          academy.name.toLowerCase().includes(searchValue) &&
          !selectedAcademies.includes(academy.name) // Exclude selected ones
      )
      .map((academy) => academy.name);

    setFilteredAcademies(filtered);
    setShowDropdown(filtered.length > 0);
  };

  const handleSelectAcademy = (academy: string) => {
    form.setValue('academyNames', academy);
    setSelectedFromDropdown(true);
    setShowDropdown(false);
  };

  const handleAddAcademy = () => {
    const selectedValue = form.watch('academyNames')?.trim();
    if (
      selectedValue &&
      selectedFromDropdown &&
      !selectedAcademies.includes(selectedValue)
    ) {
      setSelectedAcademies([...selectedAcademies, selectedValue]);
      form.setValue('academyNames', '');
      setSelectedFromDropdown(false);
    }
  };

  const handleRemoveAcademy = (academyName: string) => {
    setSelectedAcademies(
      selectedAcademies.filter((name) => name != academyName)
    );
  };

  const handleAddTag = () => {
    const tagValue = form.watch('customTags')?.trim();
    if (tagValue && !selectedTags.includes(tagValue)) {
      setSelectedTags([...selectedTags, tagValue]);
      form.setValue('customTags', '');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

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

      <div className="col-span-12 flex items-end space-x-2 relative">
        <FormField
          control={form.control}
          name="academyNames"
          render={({ field }) => (
            <FormItem className="flex-grow relative">
              <FormLabel>Academy Names (Multiple)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleAcademySearch(e.target.value);
                  }}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                />
              </FormControl>
              {showDropdown && (
                <div className="absolute left-0 right-0 bg-white border border-gray-300 shadow-lg mt-1 rounded-md max-h-40 overflow-y-auto z-10">
                  {filteredAcademies.map((academy, index) => (
                    <div
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onMouseDown={() => handleSelectAcademy(academy)}
                    >
                      {academy}
                    </div>
                  ))}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="button" onClick={handleAddAcademy} variant="accent">
          Add
        </Button>
      </div>

      <div className="col-span-12 flex justify-start">
        <div className="bg-white p-2 rounded-md min-w-fit w-auto">
          {selectedAcademies.map((academy, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-1 text-sm bg-gray-100 rounded-md mb-2 px-3"
            >
              <span className="whitespace-nowrap">{academy}</span>
              <button
                onClick={() => handleRemoveAcademy(academy)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <X className=" ml-3" size={14} strokeWidth={4} />
              </button>
            </div>
          ))}
        </div>
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

      <div className="col-span-12 flex items-end space-x-2">
        <FormField
          control={form.control}
          name="customTags"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Custom Tags</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  placeholder="Type a tag and press Add"
                  onChange={(e) => field.onChange(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), handleAddTag())
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" variant="accent" onClick={handleAddTag}>
          Add
        </Button>
      </div>

      {/* Display Selected Tags */}
      <div className="col-span-12 flex justify-start ">
        <div className="bg-white p-2 rounded-md min-w-fit w-auto">
          {selectedTags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-1 text-sm bg-gray-100 rounded-md mb-2 px-3"
            >
              <span className="whitespace-nowrap">{tag}</span>
              <button
                onClick={() => handleRemoveTag(tag)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <X className="ml-3" size={14} strokeWidth={4} />
              </button>
            </div>
          ))}
        </div>
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
    </div>
  );
}
