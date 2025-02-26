import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface SaveFilterDialogProps {
  onSave: (name: string) => void;
}

export function SaveFilterDialog({ onSave }: SaveFilterDialogProps) {
  const [open, setOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    if (!filterName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a filter name',
      });
      return;
    }

    onSave(filterName);
    setOpen(false);
    setFilterName('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Save Filter</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Filter</DialogTitle>
          <DialogDescription>
            Give your filter a name to save it for later use.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save filter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
