import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import * as LucideIcons from 'lucide-react';
import InputError from '@/components/input-error';

const MCQForm = ({ options, correctOption, setOptions, setCorrectOption, errors }) => {
  // Add a new empty option
  const addOption = () => {
    setOptions([...options, '']);
  };

  // Remove an option by index
  const removeOption = (indexToRemove) => {
    if (options.length <= 2) {
      return; // At least 2 options are required
    }

    const newOptions = options.filter((_, index) => index !== indexToRemove);
    setOptions(newOptions);

    // Update the correct option index if needed
    if (correctOption === indexToRemove) {
      setCorrectOption(0);
    } else if (correctOption > indexToRemove) {
      setCorrectOption(correctOption - 1);
    }
  };

  // Update an option's text
  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Options</Label>
        <p className="text-sm text-gray-500 mb-2">
          Add at least two options and select the correct one
        </p>

        <RadioGroup 
          value={correctOption.toString()} 
          onValueChange={(value) => setCorrectOption(parseInt(value, 10))}
          className="space-y-3"
        >
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <div className="flex-1 flex items-center space-x-2">
                <Badge variant="outline">{String.fromCharCode(65 + index)}</Badge>
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  className="flex-1"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeOption(index)}
                disabled={options.length <= 2}
              >
                <LucideIcons.X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </RadioGroup>

        {errors.options && <InputError message={errors.options} />}
        {errors.correct_option && <InputError message={errors.correct_option} />}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addOption}
        className="flex items-center"
      >
        <LucideIcons.Plus className="mr-2 h-4 w-4" />
        Add Option
      </Button>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <div className="flex items-center text-sm">
          <LucideIcons.Info className="mr-2 h-4 w-4 text-blue-500" />
          <span>The selected option will be marked as the correct answer.</span>
        </div>
      </div>
    </div>
  );
};

export default MCQForm;
