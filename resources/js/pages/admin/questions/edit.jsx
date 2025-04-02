import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import * as LucideIcons from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';

// Import question type specific form components
import MCQForm from '@/components/questions/MCQForm';
import TrueFalseForm from '@/components/questions/TrueFalseForm';
import ShortAnswerForm from '@/components/questions/ShortAnswerForm';
import CodingForm from '@/components/questions/CodingForm';
import TagSelector from '@/components/questions/TagSelector';

const EditQuestion = ({ question, categories, tags }) => {
  // Initialize form with question data
  const { data, setData, patch, processing, errors } = useForm({
    title: question.title || '',
    content: question.content || '',
    type: question.type || '',
    difficulty: question.difficulty || 'medium',
    tags: question.tags_with_type?.filter(tag => tag.type === 'tag').map(tag => tag.name) || [],
    categories: question.tags_with_type?.filter(tag => tag.type === 'category').map(tag => tag.name) || [],
    
    // Type-specific data - initialize based on question type
    ...(() => {
      switch (question.type) {
        case 'mcq':
          return {
            options: question.mcq_details?.options || ['', ''],
            correct_option: question.mcq_details?.correct_option || 0,
          };
        case 'true_false':
          return {
            is_true: question.true_false_details?.is_true || false,
          };
        case 'short_answer':
          return {
            model_answer: question.short_answer_details?.model_answer || '',
          };
        case 'coding':
          return {
            language: question.coding_details?.language || 'javascript',
            test_cases: question.coding_details?.test_cases || [''],
            expected_output: question.coding_details?.expected_output || [''],
          };
        default:
          return {};
      }
    })(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    patch(route('admin.questions.update', question.id));
  };

  const renderQuestionTypeForm = () => {
    switch (question.type) {
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
        return null;
    }
  };

  return (
    <AppLayout>
      <Head title={`Edit Question: ${question.title}`} />

      <div className="container mx-auto py-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href={route('dashboard')}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href={route('admin.questions.index')}>Questions</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <Heading>Edit Question</Heading>
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
                    Edit the basic information for your question
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
                        <Input
                          id="type"
                          value={data.type === 'mcq' ? 'Multiple Choice' :
                                data.type === 'true_false' ? 'True/False' :
                                data.type === 'short_answer' ? 'Short Answer' :
                                data.type === 'coding' ? 'Coding' : ''}
                          disabled
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Question type cannot be changed after creation
                        </p>
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
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>
                    {question.type === 'mcq' && 'Multiple Choice Options'}
                    {question.type === 'true_false' && 'True/False Configuration'}
                    {question.type === 'short_answer' && 'Short Answer Configuration'}
                    {question.type === 'coding' && 'Coding Challenge Configuration'}
                  </CardTitle>
                  <CardDescription>
                    Configure the specific details for this question type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderQuestionTypeForm()}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tags & Categories</CardTitle>
                  <CardDescription>
                    Add tags and categories to organize your question
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
                    Update Question
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

export default EditQuestion;
