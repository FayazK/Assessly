<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Question\StoreQuestionRequest;
use App\Http\Requests\Admin\Question\UpdateQuestionRequest;
use App\Models\Question;
use App\Models\McqDetail;
use App\Models\TrueFalseDetail;
use App\Models\ShortAnswerDetail;
use App\Models\CodingDetail;
use App\Models\Spatie\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class QuestionController extends Controller
{
    /**
     * Display a listing of the questions.
     */
    public function index(Request $request)
    {
        $query = Question::with(['creator:id,name', 'tags', 'tagsWithType:id,name,type']);

        // Apply filters
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        if ($request->has('tags')) {
            $tags = is_array($request->tags) ? $request->tags : [$request->tags];
            $query->withTags($tags);
        }

        if ($request->has('categories')) {
            $categories = is_array($request->categories) ? $request->categories : [$request->categories];
            $query->withCategories($categories);
        }

        // Sort
        $sortField = $request->input('sortField', 'created_at');
        $sortDirection = $request->input('sortDirection', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Paginate
        $questions = $query->paginate($request->input('perPage', 10))
                          ->withQueryString();

        // Get categories and tags for filters
        $categories = Tag::where('type', 'category')->get(['id', 'name']);
        $tags = Tag::where('type', 'tag')->get(['id', 'name']);

        return Inertia::render('admin/questions/index', [
            'questions' => $questions,
            'filters' => [
                'search' => $request->search,
                'type' => $request->type,
                'difficulty' => $request->difficulty,
                'tags' => $request->tags,
                'categories' => $request->categories,
                'sortField' => $sortField,
                'sortDirection' => $sortDirection,
            ],
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Show the form for creating a new question.
     */
    public function create()
    {
        $categories = Tag::where('type', 'category')->get(['id', 'name']);
        $tags = Tag::where('type', 'tag')->get(['id', 'name']);

        return Inertia::render('admin/questions/create', [
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created question in storage.
     */
    public function store(StoreQuestionRequest $request)
    {
        // Begin transaction
        DB::beginTransaction();

        try {
            // Create question
            $question = new Question([
                'creator_id' => Auth::id(),
                'title' => $request->title,
                'content' => $request->input('content'),
                'type' => $request->type,
                'difficulty' => $request->difficulty,
            ]);

            $question->save();

            // Handle tags and categories
            if ($request->has('tags')) {
                $question->syncTagsWithType($request->tags, 'tag');
            }

            if ($request->has('categories')) {
                $question->syncTagsWithType($request->categories, 'category');
            }

            // Handle question type specific details
            switch ($question->type) {
                case 'mcq':
                    McqDetail::create([
                        'question_id' => $question->id,
                        'options' => $request->options,
                        'correct_option' => $request->correct_option,
                    ]);
                    break;

                case 'true_false':
                    TrueFalseDetail::create([
                        'question_id' => $question->id,
                        'is_true' => $request->is_true,
                    ]);
                    break;

                case 'short_answer':
                    ShortAnswerDetail::create([
                        'question_id' => $question->id,
                        'model_answer' => $request->model_answer,
                    ]);
                    break;

                case 'coding':
                    CodingDetail::create([
                        'question_id' => $question->id,
                        'language' => $request->language,
                        'test_cases' => $request->test_cases,
                        'expected_output' => $request->expected_output,
                    ]);
                    break;
            }

            // Commit transaction
            DB::commit();

            return redirect()->route('admin.questions.index')
                ->with('success', 'Question created successfully.');
        } catch (\Exception $e) {
            // Rollback transaction
            DB::rollBack();

            return redirect()->back()
                ->with('error', 'Error creating question: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified question.
     */
    public function show(Question $question)
    {
        $question->load(['creator:id,name', 'tags', 'tagsWithType:id,name,type']);

        // Load type-specific details
        switch ($question->type) {
            case 'mcq':
                $question->load('mcqDetails');
                break;

            case 'true_false':
                $question->load('trueFalseDetails');
                break;

            case 'short_answer':
                $question->load('shortAnswerDetails');
                break;

            case 'coding':
                $question->load('codingDetails');
                break;
        }

        return Inertia::render('admin/questions/show', [
            'question' => $question,
        ]);
    }

    /**
     * Show the form for editing the specified question.
     */
    public function edit(Question $question)
    {
        $question->load(['creator:id,name', 'tags', 'tagsWithType:id,name,type']);

        // Load type-specific details
        switch ($question->type) {
            case 'mcq':
                $question->load('mcqDetails');
                break;

            case 'true_false':
                $question->load('trueFalseDetails');
                break;

            case 'short_answer':
                $question->load('shortAnswerDetails');
                break;

            case 'coding':
                $question->load('codingDetails');
                break;
        }

        $categories = Tag::where('type', 'category')->get(['id', 'name']);
        $tags = Tag::where('type', 'tag')->get(['id', 'name']);

        return Inertia::render('admin/questions/edit', [
            'question' => $question,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Update the specified question in storage.
     */
    public function update(UpdateQuestionRequest $request, Question $question)
    {
        // Begin transaction
        DB::beginTransaction();

        try {
            // Update question
            $question->update([
                'title' => $request->title,
                'content' => $request->input('content'),
                'difficulty' => $request->difficulty,
            ]);

            // Handle tags and categories
            if ($request->has('tags')) {
                $question->syncTagsWithType($request->tags, 'tag');
            }

            if ($request->has('categories')) {
                $question->syncTagsWithType($request->categories, 'category');
            }

            // Handle question type specific details
            switch ($question->type) {
                case 'mcq':
                    $question->mcqDetails()->update([
                        'options' => $request->options,
                        'correct_option' => $request->correct_option,
                    ]);
                    break;

                case 'true_false':
                    $question->trueFalseDetails()->update([
                        'is_true' => $request->is_true,
                    ]);
                    break;

                case 'short_answer':
                    $question->shortAnswerDetails()->update([
                        'model_answer' => $request->model_answer,
                    ]);
                    break;

                case 'coding':
                    $question->codingDetails()->update([
                        'language' => $request->language,
                        'test_cases' => $request->test_cases,
                        'expected_output' => $request->expected_output,
                    ]);
                    break;
            }

            // Commit transaction
            DB::commit();

            return redirect()->route('admin.questions.index')
                ->with('success', 'Question updated successfully.');
        } catch (\Exception $e) {
            // Rollback transaction
            DB::rollBack();

            return redirect()->back()
                ->with('error', 'Error updating question: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified question from storage.
     */
    public function destroy(Question $question)
    {
        try {
            $question->delete();

            return redirect()->route('admin.questions.index')
                ->with('success', 'Question deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error deleting question: ' . $e->getMessage());
        }
    }
}
