<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Tags\Tag;

class CategoryHierarchy extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'tag_id',
        'parent_tag_id',
    ];

    /**
     * Get the tag that owns the hierarchy record.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function tag(): BelongsTo
    {
        return $this->belongsTo(Tag::class, 'tag_id');
    }

    /**
     * Get the parent tag.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function parentTag(): BelongsTo
    {
        return $this->belongsTo(Tag::class, 'parent_tag_id');
    }
}
