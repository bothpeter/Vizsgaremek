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
            $table->id('food_id'); // Primary key
            $table->unsignedBigInteger('user_id'); // Foreign key
            $table->string('description'); // Corrected typo
            $table->string('type');
            $table->float('calorie')->nullable();
            $table->float('fat')->nullable();
            $table->float('protein')->nullable();
            $table->float('carb')->nullable();
            $table->string('img_url')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('food');
    }
};
