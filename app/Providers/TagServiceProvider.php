<?php

namespace App\Providers;

use App\Models\Spatie\Tag;
use Illuminate\Support\ServiceProvider;

class TagServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(\Spatie\Tags\Tag::class, function ($app) {
            return new Tag();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
