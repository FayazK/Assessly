import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as LucideIcons from 'lucide-react';
import InputError from '@/components/input-error';

const CodingForm = ({ 
  language, 
  testCases, 
  expectedOutput, 
  setLanguage, 
  setTestCases, 
  setExpectedOutput, 
  errors 
}) => {
  // Add a new test case and expected output
  const addTestCase = () => {
    setTestCases([...testCases, '']);
    setExpectedOutput([...expectedOutput, '']);
  };

  // Remove a test case and its expected output by index
  const removeTestCase = (indexToRemove) => {
    if (testCases.length <= 1) {
      return; // At least 1 test case is required
    }

    const newTestCases = testCases.filter((_, index) => index !== indexToRemove);
    const newExpectedOutput = expectedOutput.filter((_, index) => index !== indexToRemove);
    
    setTestCases(newTestCases);
    setExpectedOutput(newExpectedOutput);
  };

  // Update a test case's text
  const updateTestCase = (index, value) => {
    const newTestCases = [...testCases];
    newTestCases[index] = value;
    setTestCases(newTestCases);
  };

  // Update an expected output's text
  const updateExpectedOutput = (index, value) => {
    const newExpectedOutput = [...expectedOutput];
    newExpectedOutput[index] = value;
    setExpectedOutput(newExpectedOutput);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="language">Programming Language</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="csharp">C#</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="php">PHP</SelectItem>
            <SelectItem value="ruby">Ruby</SelectItem>
            <SelectItem value="go">Go</SelectItem>
            <SelectItem value="swift">Swift</SelectItem>
            <SelectItem value="kotlin">Kotlin</SelectItem>
            <SelectItem value="rust">Rust</SelectItem>
          </SelectContent>
        </Select>
        {errors.language && <InputError message={errors.language} />}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Test Cases</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTestCase}
            className="flex items-center"
          >
            <LucideIcons.Plus className="mr-2 h-4 w-4" />
            Add Test Case
          </Button>
        </div>
        
        <p className="text-sm text-gray-500">
          Add test cases and expected outputs to validate candidate solutions
        </p>

        {testCases.map((testCase, index) => (
          <div key={index} className="space-y-3 p-4 border rounded-md">
            <div className="flex items-center justify-between">
              <Label htmlFor={`test-case-${index}`}>Test Case {index + 1}</Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeTestCase(index)}
                disabled={testCases.length <= 1}
              >
                <LucideIcons.X className="h-4 w-4" />
              </Button>
            </div>
            
            <div>
              <Textarea
                id={`test-case-${index}`}
                value={testCase}
                onChange={(e) => updateTestCase(index, e.target.value)}
                rows={2}
                placeholder="Enter input for test case"
              />
            </div>
            
            <div>
              <Label htmlFor={`expected-output-${index}`}>Expected Output</Label>
              <Textarea
                id={`expected-output-${index}`}
                value={expectedOutput[index] || ''}
                onChange={(e) => updateExpectedOutput(index, e.target.value)}
                rows={2}
                placeholder="Enter expected output for this test case"
              />
            </div>
          </div>
        ))}

        {errors.test_cases && <InputError message={errors.test_cases} />}
        {errors.expected_output && <InputError message={errors.expected_output} />}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <div className="flex items-start space-x-2">
          <LucideIcons.Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Tips for creating good test cases:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Include edge cases and boundary conditions</li>
              <li>Test with both valid and invalid inputs</li>
              <li>Start with simple test cases and progress to more complex ones</li>
              <li>Make sure expected outputs match precisely what the candidate's solution should return</li>
              <li>Consider performance expectations if relevant to the problem</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingForm;
