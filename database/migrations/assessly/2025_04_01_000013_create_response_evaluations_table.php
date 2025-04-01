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
        Schema::create('response_evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_response_id')->constrained()->onDelete('cascade');
            $table->foreignId('evaluator_id')->nullable()->constrained('users')->onDelete('set null');
            $table->boolean('is_correct')->nullable();
            $table->decimal('score', 5, 2)->nullable();
            $table->text('feedback')->nullable();
            $table->boolean('is_auto_evaluated')->default(false);
            $table->timestamps();
            
            // Add indexes for frequently queried fields
            $table->index('candidate_response_id');
            $table->index('evaluator_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('response_evaluations');
    }
};
