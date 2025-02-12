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
        Schema::create('diet_plans', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->string('title');
            $table->string('description');
            $table->string('foods');
            $table->float('kcal');
            $table->integer('food1_id')->nullable();
            $table->integer('food2_id')->nullable();
            $table->integer('food3_id')->nullable();
            $table->string('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diet_plans');
    }
};
