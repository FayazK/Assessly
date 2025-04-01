<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    
    /**
     * Check if the user is an admin.
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
    
    /**
     * Check if the user is a candidate.
     *
     * @return bool
     */
    public function isCandidate(): bool
    {
        return $this->role === 'candidate';
    }
    
    /**
     * Get the candidate profile associated with the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function candidateProfile(): HasOne
    {
        return $this->hasOne(CandidateProfile::class);
    }
    
    /**
     * Get the questions created by the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class, 'creator_id');
    }
    
    /**
     * Get the interviews created by the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function createdInterviews(): HasMany
    {
        return $this->hasMany(Interview::class, 'creator_id');
    }
    
    /**
     * Get the candidate interviews for the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function candidateInterviews(): HasMany
    {
        return $this->hasMany(CandidateInterview::class, 'candidate_id');
    }
    
    /**
     * Get the response evaluations done by the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function responseEvaluations(): HasMany
    {
        return $this->hasMany(ResponseEvaluation::class, 'evaluator_id');
    }
}
