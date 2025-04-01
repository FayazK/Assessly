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
        // For MCQ questions
        Schema::create('mcq_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained()->onDelete('cascade');
            $table->json('options');
            $table->string('correct_option');
            $table->timestamps();
        });

        // For True/False questions
        Schema::create('true_false_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained()->onDelete('cascade');
            $table->boolean('correct_answer');
            $table->timestamps();
        });

        // For Short Answer questions
        Schema::create('short_answer_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained()->onDelete('cascade');
            $table->text('model_answer');
            $table->text('evaluation_criteria')->nullable();
            $table->timestamps();
        });

        // For Coding questions
        Schema::create('coding_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained()->onDelete('cascade');
            $table->text('starter_code')->nullable();
            $table->json('test_cases');
            $table->json('expected_outputs');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mcq_details');
        Schema::dropIfExists('true_false_details');
        Schema::dropIfExists('short_answer_details');
        Schema::dropIfExists('coding_details');
    }
};
