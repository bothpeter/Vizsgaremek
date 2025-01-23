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
        Schema::create('workout_plan', function (Blueprint $table) {
            $table->string('title');
            $table->string('goodFor');
            $table->string('description');
            $table->string('type');
            $table->integer('exerccise1_id');
            $table->integer('exerccise2_id');
            $table->integer('exerccise3_id');
            $table->integer('exerccise4_id');
            $table->integer('exerccise5_id');
        });

        Schema::create('diet_plan', function (Blueprint $table) {
            $table->string('title');
            $table->string('description');
            $table->string('foods');
            $table->float('kcal');
            $table->integer('food1_id');
            $table->integer('food2_id');
            $table->integer('food3_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workout_plan');
        Schema::dropIfExists('diet_plan');
    }
};
