<?php

namespace App\Http\Requests\Admin\Question;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateQuestionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization will be handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'difficulty' => ['required', Rule::in(['easy', 'medium', 'hard'])],
            'tags' => ['sometimes', 'array'],
            'tags.*' => ['sometimes', 'string'],
            'categories' => ['sometimes', 'array'],
            'categories.*' => ['sometimes', 'string'],
        ];

        // Type cannot be changed once created, so we don't validate it
        // Add type-specific validation rules based on the question's existing type
        $question = $this->route('question');
        
        switch ($question->type) {
            case 'mcq':
                $rules['options'] = ['required', 'array', 'min:2'];
                $rules['options.*'] = ['required', 'string'];
                $rules['correct_option'] = ['required', 'integer', 'min:0'];
                break;

            case 'true_false':
                $rules['is_true'] = ['required', 'boolean'];
                break;

            case 'short_answer':
                $rules['model_answer'] = ['required', 'string'];
                break;

            case 'coding':
                $rules['language'] = ['required', 'string'];
                $rules['test_cases'] = ['required', 'array'];
                $rules['test_cases.*'] = ['required', 'string'];
                $rules['expected_output'] = ['required', 'array'];
                $rules['expected_output.*'] = ['required', 'string'];
                break;
        }

        return $rules;
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'A question title is required',
            'content.required' => 'Question content is required',
            'difficulty.required' => 'Question difficulty is required',
            'difficulty.in' => 'Question difficulty must be one of: Easy, Medium, or Hard',
            
            // MCQ specific
            'options.required' => 'Options are required for MCQ questions',
            'options.min' => 'MCQ questions must have at least 2 options',
            'correct_option.required' => 'The correct option must be specified for MCQ questions',
            
            // True/False specific
            'is_true.required' => 'You must specify whether the statement is true or false',
            
            // Short Answer specific
            'model_answer.required' => 'A model answer is required for short answer questions',
            
            // Coding specific
            'language.required' => 'Programming language is required for coding questions',
            'test_cases.required' => 'Test cases are required for coding questions',
            'expected_output.required' => 'Expected outputs are required for coding questions',
        ];
    }
}
