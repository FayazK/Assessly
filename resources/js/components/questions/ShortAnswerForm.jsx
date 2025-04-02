import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import * as LucideIcons from 'lucide-react';

const ShortAnswerForm = ({ modelAnswer, setModelAnswer, errors }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="model_answer">Model Answer</Label>
        <p className="text-sm text-gray-500 mb-2">
          Provide a model answer that will be used for evaluation
        </p>

        <Textarea
          id="model_answer"
          value={modelAnswer}
          onChange={(e) => setModelAnswer(e.target.value)}
          rows={5}
          placeholder="Enter the model answer for this question"
        />

        {errors.model_answer && <InputError message={errors.model_answer} />}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <div className="flex items-start space-x-2">
          <LucideIcons.Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Tips for creating good model answers:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Be clear and concise</li>
              <li>Include all key points that should be present in a good answer</li>
              <li>Use complete sentences to demonstrate proper expression</li>
              <li>Consider including alternative phrasings for key concepts</li>
              <li>This answer will be used as a reference when evaluating candidate responses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortAnswerForm;
