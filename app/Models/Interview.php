<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Interview extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'creator_id',
        'type',
        'status',
        'scheduled_at',
        'duration',
        'access_code',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'scheduled_at' => 'datetime',
    ];

    /**
     * Get the user that created the interview.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /**
     * Get the sections for the interview.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function sections(): HasMany
    {
        return $this->hasMany(InterviewSection::class)->orderBy('order');
    }

    /**
     * Get the candidate interviews for the interview.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function candidateInterviews(): HasMany
    {
        return $this->hasMany(CandidateInterview::class);
    }

    /**
     * Get all questions for this interview across all sections.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllQuestionsAttribute()
    {
        $questions = collect();
        
        foreach ($this->sections as $section) {
            $questions = $questions->merge($section->questions);
        }
        
        return $questions;
    }
}
