<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        set_time_limit(3600);

        if (DB::getDriverName() === 'mysql') {
            DB::statement("SET GLOBAL max_allowed_packet = 10485760;");
        }
    }
}
