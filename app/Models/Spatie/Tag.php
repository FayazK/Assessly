<?php

namespace App\Models\Spatie;

use App\Models\CategoryHierarchy;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\Tags\Tag as SpatieTag;

class Tag extends SpatieTag
{
    /**
     * Get the hierarchy records where this tag is the child.
     *
     * @return HasOne
     */
    public function categoryHierarchy(): HasOne
    {
        return $this->hasOne(CategoryHierarchy::class, 'tag_id');
    }

    /**
     * Get all hierarchy records where this tag is the parent.
     *
     * @return HasMany
     */
    public function categoryHierarchies(): HasMany
    {
        return $this->hasMany(CategoryHierarchy::class, 'parent_tag_id');
    }

    /**
     * Get the parent category tag, if this is a category tag.
     *
     * @return SpatieTag|null
     */
    public function getParentAttribute()
    {
        if ($this->type !== 'category') {
            return null;
        }

        $hierarchy = $this->categoryHierarchy;

        return $hierarchy ? $hierarchy->parentTag : null;
    }

    /**
     * Get the child category tags, if this is a category tag.
     *
     * @return Collection
     */
    public function getChildrenAttribute()
    {
        if ($this->type !== 'category') {
            return collect();
        }

        return $this->categoryHierarchies->map(function ($hierarchy) {
            return $hierarchy->tag;
        });
    }
}
