<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CandidateResponse extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'candidate_interview_id',
        'question_id',
        'response_content',
        'started_at',
        'submitted_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
    ];

    /**
     * Get the candidate interview that owns the response.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function candidateInterview(): BelongsTo
    {
        return $this->belongsTo(CandidateInterview::class);
    }

    /**
     * Get the question that the response is for.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * Get the evaluation for the response.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function evaluation(): HasOne
    {
        return $this->hasOne(ResponseEvaluation::class);
    }
    
    /**
     * Get the time spent on this question in seconds.
     *
     * @return int|null
     */
    public function getTimeSpentAttribute(): ?int
    {
        if ($this->started_at && $this->submitted_at) {
            return $this->submitted_at->diffInSeconds($this->started_at);
        }
        
        return null;
    }
}
