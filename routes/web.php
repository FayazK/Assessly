<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\QuestionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('users', UserController::class)->except(['create', 'edit', 'show']);
    Route::resource('questions', QuestionController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
