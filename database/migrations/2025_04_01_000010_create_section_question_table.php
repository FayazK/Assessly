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
        Schema::create('section_question', function (Blueprint $table) {
            $table->id();
            $table->foreignId('interview_section_id')->constrained()->onDelete('cascade');
            $table->foreignId('question_id')->constrained()->onDelete('cascade');
            $table->integer('order');
            $table->timestamps();
            
            // Add indexes for frequently queried fields
            $table->index(['interview_section_id', 'order']);
            $table->unique(['interview_section_id', 'question_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('section_question');
    }
};
