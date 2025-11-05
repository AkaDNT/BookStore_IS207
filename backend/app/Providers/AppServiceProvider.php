<?php

namespace App\Providers;

use App\Models\Book;
use App\Observers\BookObserver;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }
        Book::observe(BookObserver::class);
    }
}
