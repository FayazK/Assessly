<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CandidateInterview extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'candidate_id',
        'interview_id',
        'status',
        'started_at',
        'completed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the candidate for the interview.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function candidate(): BelongsTo
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }

    /**
     * Get the interview.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function interview(): BelongsTo
    {
        return $this->belongsTo(Interview::class);
    }

    /**
     * Get the responses for the candidate interview.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function responses(): HasMany
    {
        return $this->hasMany(CandidateResponse::class);
    }

    /**
     * Get the result for the candidate interview.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function result(): HasOne
    {
        return $this->hasOne(InterviewResult::class);
    }
    
    /**
     * Calculate the progress percentage for this candidate interview.
     *
     * @return float
     */
    public function getProgressPercentageAttribute(): float
    {
        $totalQuestions = $this->interview->getAllQuestions->count();
        
        if ($totalQuestions === 0) {
            return 0;
        }
        
        $answeredQuestions = $this->responses()->count();
        
        return round(($answeredQuestions / $totalQuestions) * 100, 2);
    }
}
