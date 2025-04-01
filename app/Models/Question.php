<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Builder;
use Spatie\Tags\HasTags;
use Spatie\Tags\Tag;

class Question extends Model
{
    use HasFactory, HasTags;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'creator_id',
        'title',
        'content',
        'type',
        'difficulty',
    ];

    /**
     * Get the user that created the question.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /**
     * Get the categories that the question belongs to.
     * This now uses Spatie Tags with type 'category'.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function categories()
    {
        return $this->tagsWithType('category');
    }

    /**
     * Get the tags that the question belongs to.
     * This now uses Spatie Tags with type 'tag'.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function tags()
    {
        return $this->tagsWithType('tag');
    }
    
    /**
     * Scope a query to only include questions with any of the given categories.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string|array $categories
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithCategories(Builder $query, $categories): Builder
    {
        return $query->withAnyTags($categories, 'category');
    }
    
    /**
     * Scope a query to only include questions with any of the given tags.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string|array $tags
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithTags(Builder $query, $tags): Builder
    {
        return $query->withAnyTags($tags, 'tag');
    }

    /**
     * Get the interview sections that the question belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function interviewSections(): BelongsToMany
    {
        return $this->belongsToMany(InterviewSection::class, 'section_question')
            ->withPivot('order')
            ->orderBy('order');
    }

    /**
     * Get the candidate responses for the question.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function candidateResponses(): HasMany
    {
        return $this->hasMany(CandidateResponse::class);
    }

    /**
     * Get the MCQ details for the question.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function mcqDetails(): HasOne
    {
        return $this->hasOne(McqDetail::class);
    }

    /**
     * Get the true/false details for the question.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function trueFalseDetails(): HasOne
    {
        return $this->hasOne(TrueFalseDetail::class);
    }

    /**
     * Get the short answer details for the question.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function shortAnswerDetails(): HasOne
    {
        return $this->hasOne(ShortAnswerDetail::class);
    }

    /**
     * Get the coding details for the question.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function codingDetails(): HasOne
    {
        return $this->hasOne(CodingDetail::class);
    }

    /**
     * Get the appropriate details model based on question type.
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function getDetailsAttribute()
    {
        return match($this->type) {
            'mcq' => $this->mcqDetails,
            'true_false' => $this->trueFalseDetails,
            'short_answer' => $this->shortAnswerDetails,
            'coding' => $this->codingDetails,
            default => null,
        };
    }
}
