import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { X } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { SearchableSelect } from '@/components/SearchableSelect';

interface Tag {
  name: string;
}

export const CustomTagsField: React.FC<{ form: UseFormReturn<any> }> = ({
  form,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: tagsData, isLoading } = trpc.tags.getTags.useQuery(searchTerm, {
    enabled: searchTerm.length > 0,
  });

  const selectedTags = form.watch('customTags') || [];

  const handleTagSelect = (selectedTag: Tag) => {
    if (!selectedTags.includes(selectedTag.name)) {
      form.setValue('customTags', [...selectedTags, selectedTag.name]);
    }

    setSearchTerm('');
  };

  const handleRemoveTag = (tag: string) => {
    form.setValue(
      'customTags',
      selectedTags.filter((t: string) => t !== tag)
    );
  };

  const onClick = (value: string) => {
    form.setValue('customTags', [...selectedTags, value]);
  };

  return (
    <div>
      <SearchableSelect<Tag>
        form={form}
        fieldName="tags"
        label="Tags"
        placeholder="Search or add tags..."
        data={tagsData || []}
        displayKey="name"
        selectionMode="multiple"
        onSelectItem={handleTagSelect}
        onSearch={setSearchTerm}
        showButton
        onClick={onClick}
        isLoading={isLoading}
      />

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
