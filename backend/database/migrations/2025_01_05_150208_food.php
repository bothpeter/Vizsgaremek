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
        Schema::create('foods', function (Blueprint $table) {
            $table->integer('food_id')->autoIncrement();
            $table->string('name');
            $table->string('description');
            $table->string('type');
            $table->integer('calorie');
            $table->float('fat');
            $table->float('protein');
            $table->float('carb');
            $table->string('img')->nullable();
            $table->string('recipe');
            $table->string('user_id');
        });

        Schema::create('food_ingredients', function (Blueprint $table) {
            $table->integer('ingredient_id')->autoIncrement();
            $table->integer('food_id');
            $table->string('ingredient_name');
            $table->text('amount');
            $table->integer('calorie');
            $table->float('fat');
            $table->float('protein');
            $table->float('carb');
            $table->string('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('foods');
        Schema::dropIfExists('food_ingredients');
    }
};
