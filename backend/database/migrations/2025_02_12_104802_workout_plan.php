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
        Schema::create('workout_plans', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->string('title');
            $table->string('goodFor');
            $table->string('description');
            $table->string('type');
            $table->integer('exercise1_id');
            $table->integer('exercise2_id');
            $table->integer('exercise3_id');
            $table->integer('exercise4_id');
            $table->integer('exercise5_id');
            $table->string('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workout_plans');
    }
};
