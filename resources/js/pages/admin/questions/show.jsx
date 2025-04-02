import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import * as LucideIcons from 'lucide-react';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';

const breadcrumbs = (question) => [
  {
    title: 'Dashboard', href: route('dashboard'),
  },
  {
    title: 'Questions', href: route('admin.questions.index'),
  },
  {
    title: 'View', href: route('admin.questions.show', question.id),
  },
];

const QuestionTypeIcon = ({ type }) => {
  const iconMap = {
    mcq: LucideIcons.ListOrdered,
    true_false: LucideIcons.ToggleLeft,
    short_answer: LucideIcons.TextCursorInput,
    coding: LucideIcons.Code,
  };

  const IconComponent = iconMap[type] || LucideIcons.HelpCircle;
  return <IconComponent className="mr-2 h-5 w-5" />;
};

const DifficultyBadge = ({ difficulty }) => {
  const colorMap = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-red-500',
  };

  return (
    <Badge className={colorMap[difficulty]}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </Badge>
  );
};

const ShowQuestion = ({ question }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    router.delete(route('admin.questions.destroy', question.id));
    setDeleteDialogOpen(false);
  };

  const renderQuestionTypeDetails = () => {
    switch (question.type) {
      case 'mcq':
        return (
          <div className="space-y-4">
            <HeadingSmall>Options</HeadingSmall>
            <ul className="space-y-2">
              {question.mcq_details?.options.map((option, index) => (
                <li key={index} className="flex items-center">
                  <Badge variant={index === question.mcq_details.correct_option ? "default" : "outline"} className="mr-2">
                    {String.fromCharCode(65 + index)}
                  </Badge>
                  <span className={index === question.mcq_details.correct_option ? "font-bold" : ""}>
                    {option}
                  </span>
                  {index === question.mcq_details.correct_option && (
                    <Badge className="ml-2 bg-green-500">Correct</Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      
      case 'true_false':
        return (
          <div className="space-y-4">
            <HeadingSmall>Answer</HeadingSmall>
            <div className="flex items-center">
              <Badge className="mr-2 bg-green-500">
                {question.true_false_details?.is_true ? 'True' : 'False'}
              </Badge>
              <span>The correct answer is {question.true_false_details?.is_true ? 'True' : 'False'}</span>
            </div>
          </div>
        );
      
      case 'short_answer':
        return (
          <div className="space-y-4">
            <HeadingSmall>Model Answer</HeadingSmall>
            <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
              {question.short_answer_details?.model_answer}
            </div>
          </div>
        );
      
      case 'coding':
        return (
          <div className="space-y-4">
            <HeadingSmall>Programming Language</HeadingSmall>
            <Badge variant="outline">{question.coding_details?.language}</Badge>
            
            <HeadingSmall>Test Cases</HeadingSmall>
            <div className="space-y-4">
              {question.coding_details?.test_cases.map((testCase, index) => (
                <div key={index} className="border rounded-md p-4 space-y-2">
                  <div>
                    <span className="font-medium">Input:</span>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 overflow-x-auto">
                      {testCase}
                    </pre>
                  </div>
                  <div>
                    <span className="font-medium">Expected Output:</span>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 overflow-x-auto">
                      {question.coding_details?.expected_output[index] || ''}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs(question)}>
      <Head title={`Question: ${question.title}`} />

      <div className="p-4 space-y-4">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <Heading>{question.title}</Heading>
          <div className="flex gap-2">
            <Button as={Link} href={route('admin.questions.edit', question.id)} variant="outline">
              <LucideIcons.Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <LucideIcons.Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Question Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Question Details</CardTitle>
                    <CardDescription>
                      Created on {new Date(question.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
                    <QuestionTypeIcon type={question.type} />
                    <span className="mr-4">
                      {question.type === 'mcq' && 'Multiple Choice'}
                      {question.type === 'true_false' && 'True/False'}
                      {question.type === 'short_answer' && 'Short Answer'}
                      {question.type === 'coding' && 'Coding'}
                    </span>
                    <DifficultyBadge difficulty={question.difficulty} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <HeadingSmall>Question Content</HeadingSmall>
                    <div className="mt-2 border rounded-md p-4 whitespace-pre-wrap">
                      {question.content}
                    </div>
                  </div>

                  <Separator />

                  {/* Type-specific details */}
                  {renderQuestionTypeDetails()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tags & Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <HeadingSmall>Categories</HeadingSmall>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {question.tags_with_type.filter(tag => tag.type === 'category').length === 0 ? (
                        <span className="text-gray-500">No categories assigned</span>
                      ) : (
                        question.tags_with_type
                          .filter(tag => tag.type === 'category')
                          .map(tag => (
                            <Badge key={tag.id} variant="secondary">
                              {tag.name}
                            </Badge>
                          ))
                      )}
                    </div>
                  </div>

                  <div>
                    <HeadingSmall>Tags</HeadingSmall>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {question.tags_with_type.filter(tag => tag.type === 'tag').length === 0 ? (
                        <span className="text-gray-500">No tags assigned</span>
                      ) : (
                        question.tags_with_type
                          .filter(tag => tag.type === 'tag')
                          .map(tag => (
                            <Badge key={tag.id} variant="outline">
                              {tag.name}
                            </Badge>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Created By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3">
                    {question.creator?.name.substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{question.creator?.name}</div>
                    <div className="text-sm text-gray-500">
                      Created {new Date(question.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default ShowQuestion;
