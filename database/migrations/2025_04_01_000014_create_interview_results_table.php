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
        Schema::create('interview_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_interview_id')->constrained()->onDelete('cascade');
            $table->decimal('total_score', 8, 2)->nullable();
            $table->integer('total_questions');
            $table->integer('attempted_questions')->default(0);
            $table->integer('correct_answers')->default(0);
            $table->text('summary')->nullable();
            $table->timestamps();
            
            // Add indexes for frequently queried fields
            $table->index('candidate_interview_id');
            $table->unique('candidate_interview_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interview_results');
    }
};
