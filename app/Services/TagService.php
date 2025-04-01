<?php

namespace App\Services;

use App\Models\CategoryHierarchy;
use Illuminate\Database\Eloquent\Collection;
use Spatie\Tags\Tag;

class TagService
{
    /**
     * Create a new category.
     *
     * @param string $name
     * @param string|null $description
     * @param int|null $parentId
     * @return Tag
     */
    public function createCategory(string $name, ?string $description = null, ?int $parentId = null): Tag
    {
        // Create a new tag with type 'category'
        $tag = Tag::findOrCreate($name, 'category');
        
        // Store description in JSON properties if provided
        if ($description) {
            $tag->setCustomProperty('description', $description);
            $tag->save();
        }
        
        // Create hierarchy relationship if parent ID is provided
        if ($parentId) {
            CategoryHierarchy::create([
                'tag_id' => $tag->id,
                'parent_tag_id' => $parentId,
            ]);
        }
        
        return $tag;
    }
    
    /**
     * Get child categories for a specific category.
     *
     * @param int $categoryId
     * @return Collection
     */
    public function getCategoryChildren(int $categoryId): Collection
    {
        return Tag::whereHas('categoryHierarchies', function($query) use ($categoryId) {
            $query->where('parent_tag_id', $categoryId);
        })->get();
    }
    
    /**
     * Get parent category for a specific category.
     *
     * @param int $categoryId
     * @return Tag|null
     */
    public function getCategoryParent(int $categoryId): ?Tag
    {
        $hierarchy = CategoryHierarchy::where('tag_id', $categoryId)->first();
        
        if ($hierarchy && $hierarchy->parent_tag_id) {
            return Tag::find($hierarchy->parent_tag_id);
        }
        
        return null;
    }
    
    /**
     * Get all categories.
     *
     * @return Collection
     */
    public function getAllCategories(): Collection
    {
        return Tag::where('type', 'category')->get();
    }
    
    /**
     * Get all root categories (categories without parents).
     *
     * @return Collection
     */
    public function getRootCategories(): Collection
    {
        $childTagIds = CategoryHierarchy::pluck('tag_id');
        
        return Tag::where('type', 'category')
            ->whereNotIn('id', $childTagIds)
            ->get();
    }
}
