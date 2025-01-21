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
            $table->food_id();
            $table->integer('user_id');
            $table->string('name');
            $table->string('description');
            $table->string('type');
            $table->integer('calorie');
            $table->float('fat');
            $table->float('protein');
            $table->float('carb');
            $table->string('img_url')->nullable();
            $table->string('recipe');
        });

        Schema::create('food_ingredients', function (Blueprint $table) {
            $table->food_ingredients_id();
            $table->integer('food_id');
            $table->string('ingredient_name');
            $table->integer('calorie');
            $table->float('fat');
            $table->float('protein');
            $table->float('carb');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('food');
        Schema::dropIfExists('food_ingredients');
    }
};
