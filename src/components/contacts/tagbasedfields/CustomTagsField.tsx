import { useState, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import { X } from 'lucide-react';

interface Tag {
  name: string;
}

export const CustomTagsField: React.FC<{ form: UseFormReturn<any> }> = ({
  form,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false); // Controls dropdown visibility
  const [tagsDataState, setTagsDataState] = useState<Tag[]>([]);

  trpc.tags.getTags.useQuery(searchTerm, {
    enabled: searchTerm.length > 0,
    onSuccess: (data) => {
      setTagsDataState(data || []);
      setShowDropdown(true); // Show dropdown when results arrive
    },
  });

  const selectedTags = form.watch('customTags') || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true); // Reopen dropdown on search
  };

  const handleAddTag = useCallback(() => {
    if (!searchTerm.trim()) return;

    if (!selectedTags.includes(searchTerm)) {
      form.setValue('customTags', [...selectedTags, searchTerm]);
      setTagsDataState((prev) => [
        ...prev,
        { id: Date.now(), name: searchTerm },
      ]);
    }

    setSearchTerm('');
    setShowDropdown(false); // Close dropdown after adding
  }, [form, searchTerm, selectedTags]);

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      form.setValue('customTags', [...selectedTags, tag]);
    }

    setSearchTerm('');
    setShowDropdown(false); // Close dropdown after selection
  };

  const handleRemoveTag = (tag: string) => {
    form.setValue(
      'customTags',
      selectedTags.filter((t: string) => t !== tag)
    );
  };

  return (
    <div>
      <label className="block font-medium mb-2">Custom Tags</label>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search or add a tag..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
        />
        {showDropdown && searchTerm && (
          <div className="absolute left-0 w-full bg-white border rounded-md mt-1 z-10 shadow-lg">
            {tagsDataState.length > 0 ? (
              tagsDataState.map((tag, index) => (
                <div
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleTagSelect(tag.name)}
                >
                  {tag.name}
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">No tags found</div>
            )}
          </div>
        )}
      </div>

      {searchTerm && (
        <Button className="mt-2" onClick={handleAddTag}>
          Add Tag
        </Button>
      )}

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap mt-3 gap-2">
          {selectedTags.map((tag: string) => (
            <div
              key={tag}
              className="flex items-center bg-gray-200 px-3 py-1 rounded-lg"
            >
              <span>{tag}</span>
              <button onClick={() => handleRemoveTag(tag)} className="ml-2">
                <X size={16} className="text-gray-600 hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
