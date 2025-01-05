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
        Schema::create('food', function (Blueprint $table) {
            $table->user_id();
            $table->food_id();
            $table->string('descriptipn');
            $table->string('type');
            $table->float('calorie');
            $table->float('fat');
            $table->float('protein');
            $table->float('carb');
            $table->string('img_url')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
