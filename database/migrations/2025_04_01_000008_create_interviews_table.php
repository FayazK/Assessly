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
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('creator_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['scheduled', 'instant'])->default('scheduled');
            $table->enum('status', ['draft', 'active', 'completed', 'archived'])->default('draft');
            $table->timestamp('scheduled_at')->nullable();
            $table->integer('duration')->nullable()->comment('In minutes');
            $table->string('access_code')->unique()->nullable();
            $table->timestamps();
            
            // Add indexes for frequently queried fields
            $table->index('type');
            $table->index('status');
            $table->index('scheduled_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interviews');
    }
};
