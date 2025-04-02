import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as LucideIcons from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const TagSelector = ({ availableTags, selectedTags, setSelectedTags, allowCreate = false }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSelect = (tag) => {
    // If tag is already selected, do nothing
    if (selectedTags.includes(tag)) {
      return;
    }
    
    // Add the tag to the selected tags
    setSelectedTags([...selectedTags, tag]);
    setInputValue('');
  };

  const handleRemove = (tagToRemove) => {
    // Remove the tag from selected tags
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(newTags);
  };

  const handleCreateTag = () => {
    if (!inputValue.trim()) return;
    
    // Create and select the new tag
    handleSelect(inputValue.trim());
    setInputValue('');
    setOpen(false);
  };

  const filteredTags = availableTags
    ? availableTags
        .filter(tag => !selectedTags.includes(tag.name))
        .filter(tag => 
          tag.name.toLowerCase().includes(inputValue.toLowerCase())
        )
    : [];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-10">
        {selectedTags.length === 0 ? (
          <div className="flex items-center text-gray-500 text-sm h-6">
            No tags selected
          </div>
        ) : (
          selectedTags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {tag}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemove(tag)}
              >
                <LucideIcons.X className="h-3 w-3" />
              </Button>
            </Badge>
          ))
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span>Select or enter tags</span>
            <LucideIcons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput 
              placeholder="Search tags..." 
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>
                {allowCreate ? (
                  <div className="py-3 px-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={handleCreateTag}
                    >
                      <LucideIcons.Plus className="mr-2 h-4 w-4" />
                      Create "{inputValue}"
                    </Button>
                  </div>
                ) : (
                  <div className="py-6 text-center text-sm">No tags found.</div>
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredTags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.name}
                    onSelect={() => {
                      handleSelect(tag.name);
                      setOpen(false);
                    }}
                  >
                    <LucideIcons.Tag className="mr-2 h-4 w-4" />
                    <span>{tag.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TagSelector;
