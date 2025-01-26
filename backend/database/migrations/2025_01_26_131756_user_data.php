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
        Schema::create('user_likes_exercise', function (Blueprint $table) {
            $table->integer('user_id');
            $table->integer('exercise_id');
        });

        Schema::create('user_likes_food', function (Blueprint $table) {
            $table->integer('user_id');
            $table->integer('food_id');
        });

        Schema::create('user_physique', function (Blueprint $table) {
            $table->integer('user_id');
            $table->float('height');
            $table->float('weight');
            $table->integer('age');
            $table->string('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_likes_exercise');
        Schema::dropIfExists('user_likes_food');
        Schema::dropIfExists('user_physique');
    }
};
