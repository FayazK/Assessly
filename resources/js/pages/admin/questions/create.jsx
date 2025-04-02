import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import * as LucideIcons from 'lucide-react';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';

// Import question type specific form components

const breadcrumbs = [
  {
    title: 'Dashboard', href: route('dashboard'),
  },
  {
    title: 'Questions', href: route('admin.questions.index'),
  },
  {
    title: 'Create', href: route('admin.questions.create'),
  },
];
import MCQForm from '@/components/questions/MCQForm';
import TrueFalseForm from '@/components/questions/TrueFalseForm';
import ShortAnswerForm from '@/components/questions/ShortAnswerForm';
import CodingForm from '@/components/questions/CodingForm';
import TagSelector from '@/components/questions/TagSelector';

const CreateQuestion = ({ categories, tags }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    content: '',
    type: '',
    difficulty: 'medium',
    tags: [],
    categories: [],
    // MCQ specific
    options: ['', ''],
    correct_option: 0,
    // True/False specific
    is_true: false,
    // Short Answer specific
    model_answer: '',
    // Coding specific
    language: 'javascript',
    test_cases: [''],
    expected_output: [''],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('admin.questions.store'), {
      onSuccess: () => reset(),
    });
  };

  const renderQuestionTypeForm = () => {
    switch (data.type) {
      case 'mcq':
        return (
          <MCQForm
            options={data.options}
            correctOption={data.correct_option}
            setOptions={(options) => setData('options', options)}
            setCorrectOption={(index) => setData('correct_option', index)}
            errors={errors}
          />
        );
      case 'true_false':
        return (
          <TrueFalseForm
            isTrue={data.is_true}
            setIsTrue={(value) => setData('is_true', value)}
            errors={errors}
          />
        );
      case 'short_answer':
        return (
          <ShortAnswerForm
            modelAnswer={data.model_answer}
            setModelAnswer={(value) => setData('model_answer', value)}
            errors={errors}
          />
        );
      case 'coding':
        return (
          <CodingForm
            language={data.language}
            testCases={data.test_cases}
            expectedOutput={data.expected_output}
            setLanguage={(value) => setData('language', value)}
            setTestCases={(value) => setData('test_cases', value)}
            setExpectedOutput={(value) => setData('expected_output', value)}
            errors={errors}
          />
        );
      default:
        return (
          <div className="bg-gray-100 p-8 rounded-md text-center">
            <p>Please select a question type to continue</p>
          </div>
        );
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Question" />

      <div className="p-4 space-y-4">

        <div className="flex justify-between items-center mb-6">
          <Heading>Create New Question</Heading>
          <Button as={Link} href={route('admin.questions.index')} variant="outline">
            <LucideIcons.ArrowLeft className="mr-2 h-4 w-4" />
            Back to Questions
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Question Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Question Information</CardTitle>
                  <CardDescription>
                    Enter the basic information for your question
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={data.title}
                        onChange={e => setData('title', e.target.value)}
                      />
                      {errors.title && <InputError message={errors.title} />}
                    </div>

                    <div>
                      <Label htmlFor="content">Question Content</Label>
                      <Textarea
                        id="content"
                        value={data.content}
                        onChange={e => setData('content', e.target.value)}
                        rows={5}
                      />
                      {errors.content && <InputError message={errors.content} />}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="type">Question Type</Label>
                        <Select
                          value={data.type}
                          onValueChange={(value) => setData('type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a question type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mcq">Multiple Choice</SelectItem>
                            <SelectItem value="true_false">True/False</SelectItem>
                            <SelectItem value="short_answer">Short Answer</SelectItem>
                            <SelectItem value="coding">Coding</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.type && <InputError message={errors.type} />}
                      </div>

                      <div>
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select
                          value={data.difficulty}
                          onValueChange={(value) => setData('difficulty', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.difficulty && <InputError message={errors.difficulty} />}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Question Type Specific Form */}
              {data.type && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>
                      {data.type === 'mcq' && 'Multiple Choice Options'}
                      {data.type === 'true_false' && 'True/False Configuration'}
                      {data.type === 'short_answer' && 'Short Answer Configuration'}
                      {data.type === 'coding' && 'Coding Challenge Configuration'}
                    </CardTitle>
                    <CardDescription>
                      Configure the specific details for this question type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderQuestionTypeForm()}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tags & Categories</CardTitle>
                  <CardDescription>
                    Add tags and categories to organize your questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Categories</Label>
                    <TagSelector
                      availableTags={categories}
                      selectedTags={data.categories}
                      setSelectedTags={(value) => setData('categories', value)}
                    />
                    {errors.categories && <InputError message={errors.categories} />}
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <TagSelector
                      availableTags={tags}
                      selectedTags={data.tags}
                      setSelectedTags={(value) => setData('tags', value)}
                      allowCreate
                    />
                    {errors.tags && <InputError message={errors.tags} />}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Button type="submit" className="w-full" disabled={processing}>
                    Create Question
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default CreateQuestion;
