<?php

use App\Http\Controllers\DietController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\MealsController;
use App\Http\Controllers\WorkoutController;
use App\Models\FoodIngredients;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('exercise', function () {
    return 'mukodik';
});

Route::get('exercise',[ExerciseController::class, 'view_exercises']);
Route::post('exercise',[ExerciseController::class, 'post_exercises']);

Route::get('food',[FoodController::class, 'view_foods']);
Route::post('food',[FoodController::class, 'post_foods']);

Route::get('food_ingredients',[IngredientController::class, 'view_ingredients']);
Route::post('food_ingredients',[IngredientController::class, 'post_ingredients']);

Route::get('workout_plan',[WorkoutController::class, 'view_workout_plan']);
Route::post('workout_plan',[WorkoutController::class, 'post_workout_plan']);

Route::get('meals',[MealsController::class, 'view_meals']);
Route::post('meals',[MealsController::class, 'post_meals']);

Route::get('diet_plan',[DietController::class, 'view_diet_plan']);
Route::post('diet_plan',[DietController::class, 'post_diet_plan']);