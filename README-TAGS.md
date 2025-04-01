# Tagging System Implementation

This document explains how tags and categories are implemented in the Assessly system using Spatie's Laravel Tags package.

## Overview

We've replaced custom Tag and Category models with Spatie's Laravel Tags package, while preserving hierarchical functionality for categories.

## Key Components

### 1. Spatie Laravel Tags

The core tagging functionality is provided by [Spatie's Laravel Tags](https://github.com/spatie/laravel-tags) package, which offers:
- Attaching/detaching tags to models
- Tag types for categorization
- Localization support
- Tag scopes for querying

### 2. Tag Types

We use two primary tag types:
- `tag`: For regular attributes like language, industry, etc.
- `category`: For hierarchical domains/subjects

### 3. CategoryHierarchy Model

For maintaining parent-child relationships between category tags, we've added:
- `CategoryHierarchy` model
- `category_hierarchies` table with `tag_id` and `parent_tag_id` columns

### 4. Extended Tag Model

We've extended Spatie's Tag model to add hierarchical functionality:
- Located at `App\Models\Spatie\Tag`
- Adds relationships for CategoryHierarchy
- Provides accessors for `parent` and `children` attributes

### 5. TagService

A service class that provides methods for:
- Creating categories with hierarchical relationships
- Retrieving parent/child categories
- Getting root categories (those without parents)

## Usage Examples

### Working with Questions and Tags

```php
// Add a regular tag to a question
$question->attachTag('php', 'tag');

// Add a category to a question
$question->attachTag('Programming', 'category');

// Get all tags for a question
$tags = $question->tags(); // Returns tags with type 'tag'

// Get all categories for a question
$categories = $question->categories(); // Returns tags with type 'category'

// Find questions with specific tags
$questions = Question::withTags(['php', 'laravel'])->get();

// Find questions with specific categories
$questions = Question::withCategories(['Programming', 'Databases'])->get();
```

### Working with Categories Hierarchy

```php
// Create a category with a parent
$service = app(TagService::class);
$category = $service->createCategory('PHP', 'PHP Language', $parentCategoryId);

// Get child categories
$children = $service->getCategoryChildren($categoryId);

// Get parent category
$parent = $service->getCategoryParent($categoryId);

// Get all root categories
$rootCategories = $service->getRootCategories();
```

## Migration Process

The migration from custom tag/category implementation to Spatie's system happens through several migrations:

1. Create Spatie Tags tables
2. Create CategoryHierarchy table
3. Migrate existing tags to Spatie's format
4. Migrate existing categories to Spatie's format with hierarchy
5. Drop old tables

This ensures a smooth transition without data loss.
