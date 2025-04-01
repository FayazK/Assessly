<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InterviewResult extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'candidate_interview_id',
        'total_score',
        'total_questions',
        'attempted_questions',
        'correct_answers',
        'summary',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total_score' => 'float',
        'total_questions' => 'integer',
        'attempted_questions' => 'integer',
        'correct_answers' => 'integer',
    ];

    /**
     * Get the candidate interview that owns the result.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function candidateInterview(): BelongsTo
    {
        return $this->belongsTo(CandidateInterview::class);
    }
    
    /**
     * Get the percentage score.
     *
     * @return float|null
     */
    public function getScorePercentageAttribute(): ?float
    {
        if ($this->total_questions > 0) {
            return round(($this->total_score / $this->total_questions) * 100, 2);
        }
        
        return null;
    }
    
    /**
     * Get the completion percentage.
     *
     * @return float
     */
    public function getCompletionPercentageAttribute(): float
    {
        if ($this->total_questions > 0) {
            return round(($this->attempted_questions / $this->total_questions) * 100, 2);
        }
        
        return 0;
    }
}
