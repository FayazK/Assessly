import React, {useState} from 'react';
import {Head, Link, router} from '@inertiajs/react';
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Badge} from '@/components/ui/badge';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import * as LucideIcons from 'lucide-react';
import Heading from '@/components/heading';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu';

const QuestionTypeIcon = ({type}) => {
    const iconMap = {
        mcq: LucideIcons.ListOrdered,
        true_false: LucideIcons.ToggleLeft,
        short_answer: LucideIcons.TextCursorInput,
        coding: LucideIcons.Code,
    };

    const IconComponent = iconMap[type] || LucideIcons.HelpCircle;
    return <IconComponent className="mr-2 h-5 w-5"/>;
};

const DifficultyBadge = ({difficulty}) => {
    const colorMap = {
        easy: 'bg-green-500', medium: 'bg-yellow-500', hard: 'bg-red-500',
    };

    return (<Badge className={colorMap[difficulty]}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </Badge>);
};

const QuestionList = ({questions, filters, categories, tags}) => {
    const [searchInput, setSearchInput] = useState(filters.search || '');
    const [filterType, setFilterType] = useState(filters.type || 'all');
    const [filterDifficulty, setFilterDifficulty] = useState(filters.difficulty || 'all');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({search: searchInput});
    };

    const applyFilters = (newFilters) => {
        const finalFilters = {...filters, ...newFilters};

        // Convert 'all' values to empty strings for the backend
        if (finalFilters.type === 'all') finalFilters.type = '';
        if (finalFilters.difficulty === 'all') finalFilters.difficulty = '';

        router.get(route('admin.questions.index'), finalFilters, {preserveState: true});
    };

    const handleDelete = () => {
        if (questionToDelete) {
            router.delete(route('admin.questions.destroy', questionToDelete));
            setDeleteDialogOpen(false);
        }
    };

    const confirmDelete = (questionId) => {
        setQuestionToDelete(questionId);
        setDeleteDialogOpen(true);
    };

    return (<AppLayout>
        <Head title="Questions Management"/>

        <div className="container mx-auto py-6">
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink as={Link} href={route('dashboard')}>Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Questions</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex justify-between items-center mb-6">
                <Heading>Questions</Heading>
                <Button as={Link} href={route('admin.questions.create')}>
                    <LucideIcons.Plus className="mr-2 h-4 w-4"/>
                    Add Question
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Question List</CardTitle>
                    <CardDescription>
                        Manage your question bank for interviews
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Search and Filters */}
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                        <form onSubmit={handleSearch} className="md:col-span-2 flex">
                            <Input
                                placeholder="Search questions..."
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                className="mr-2"
                            />
                            <Button type="submit">Search</Button>
                        </form>

                        <Select
                            value={filterType}
                            onValueChange={(value) => {
                                setFilterType(value);
                                applyFilters({type: value});
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="mcq">Multiple Choice</SelectItem>
                                <SelectItem value="true_false">True/False</SelectItem>
                                <SelectItem value="short_answer">Short Answer</SelectItem>
                                <SelectItem value="coding">Coding</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filterDifficulty}
                            onValueChange={(value) => {
                                setFilterDifficulty(value);
                                applyFilters({difficulty: value});
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by difficulty"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Difficulties</SelectItem>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Questions Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Difficulty</th>
                                <th className="px-6 py-3">Tags</th>
                                <th className="px-6 py-3">Created</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {questions.data.length === 0 ? (<tr>
                                <td colSpan="6" className="px-6 py-4 text-center">
                                    No questions found. <Link href={route('admin.questions.create')}
                                                              className="text-blue-600 hover:underline">Create
                                    your first question</Link>.
                                </td>
                            </tr>) : (questions.data.map((question) => (
                                <tr key={question.id} className="border-b dark:border-gray-700">
                                    <td className="px-6 py-4 font-medium">
                                        <Link href={route('admin.questions.show', question.id)}
                                              className="text-blue-600 hover:underline">
                                            {question.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <QuestionTypeIcon type={question.type}/>
                                            {question.type === 'mcq' && 'Multiple Choice'}
                                            {question.type === 'true_false' && 'True/False'}
                                            {question.type === 'short_answer' && 'Short Answer'}
                                            {question.type === 'coding' && 'Coding'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <DifficultyBadge difficulty={question.difficulty}/>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {question.tags_with_type
                                                .filter(tag => tag.type === 'tag')
                                                .slice(0, 3)
                                                .map(tag => (<Badge key={tag.id} variant="outline" className="mr-1">
                                                    {tag.name}
                                                </Badge>))}
                                            {question.tags_with_type.filter(tag => tag.type === 'tag').length > 3 && (
                                                <Badge
                                                    variant="outline">+{question.tags_with_type.filter(tag => tag.type === 'tag').length - 3}</Badge>)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(question.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <LucideIcons.MoreVertical className="h-4 w-4"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('admin.questions.show', question.id)}>
                                                        <LucideIcons.Eye className="mr-2 h-4 w-4"/>
                                                        View
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('admin.questions.edit', question.id)}>
                                                        <LucideIcons.Edit className="mr-2 h-4 w-4"/>
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => confirmDelete(question.id)}>
                                                    <LucideIcons.Trash className="mr-2 h-4 w-4"/>
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>)))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {questions.data.length > 0 && (<div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-700">
                            Showing {questions.from} to {questions.to} of {questions.total} questions
                        </div>
                        <div className="flex space-x-2">
                            {questions.links.map((link, i) => {
                                if (link.url === null) {
                                    return (<Button key={i} variant="outline" disabled>
                                        {link.label}
                                    </Button>);
                                }

                                return (<Button
                                    key={i}
                                    variant={link.active ? "default" : "outline"}
                                    onClick={() => router.visit(link.url)}
                                >
                                    {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                </Button>);
                            })}
                        </div>
                    </div>)}
                </CardContent>
            </Card>
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
    </AppLayout>);
};

export default QuestionList;
