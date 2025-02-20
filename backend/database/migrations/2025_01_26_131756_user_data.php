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
        Schema::create('user_like_exercises', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('exercise_id');
        });

        Schema::create('user_like_foods', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('food_id');
        });

        Schema::create('user_physique', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('progress_picture')->nullable();
            $table->float('height');
            $table->float('weight');
            $table->integer('age');
            $table->string('gender');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_like_exercise');
        Schema::dropIfExists('user_like_foods');
        Schema::dropIfExists('user_physique');
    }
};
