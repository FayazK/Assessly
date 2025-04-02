import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import InputError from '@/components/input-error';

const TrueFalseForm = ({ isTrue, setIsTrue, errors }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Correct Answer</Label>
        <p className="text-sm text-gray-500 mb-2">
          Select whether the statement is true or false
        </p>

        <RadioGroup 
          value={isTrue ? "true" : "false"} 
          onValueChange={(value) => setIsTrue(value === "true")}
          className="flex space-x-6 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="true" />
            <Label htmlFor="true" className="font-normal">True</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="false" />
            <Label htmlFor="false" className="font-normal">False</Label>
          </div>
        </RadioGroup>

        {errors.is_true && <InputError message={errors.is_true} />}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <p className="text-sm">
          The question text should be a statement that can be evaluated as either true or false.
        </p>
      </div>
    </div>
  );
};

export default TrueFalseForm;
