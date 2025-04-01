<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('category_hierarchies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tag_id')->constrained('tags')->onDelete('cascade');
            $table->foreignId('parent_tag_id')->nullable()->constrained('tags')->onDelete('set null');
            $table->timestamps();
            
            // Add a unique constraint to prevent duplicate relationships
            $table->unique(['tag_id', 'parent_tag_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_hierarchies');
    }
};
