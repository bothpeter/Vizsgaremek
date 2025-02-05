<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DietController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\UserDataController;
use App\Http\Controllers\WorkoutController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register',[AuthController::class, 'register']);
Route::post('/login',[AuthController::class, 'login']);
Route::post('/logout',[AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('exercise',[ExerciseController::class, 'view_exercises']);
Route::get('exercise/{id}',[ExerciseController::class, 'view_exercise_by_exercise_id']);
Route::post('exercise',[ExerciseController::class, 'post_exercises']);

Route::get('food',[FoodController::class, 'view_foods']);
Route::get('food/{id}',[FoodController::class, 'view_foods_by_id']);
Route::post('food',[FoodController::class, 'post_foods']);

Route::get('food_ingredients',[IngredientController::class, 'view_ingredients']);
Route::get('food_ingredients/{id}',[IngredientController::class, 'view_ingredient_by_food_id']);
Route::post('food_ingredients',[IngredientController::class, 'post_ingredients']);

Route::get('workout_plan',[WorkoutController::class, 'view_workout_plan']);
Route::post('workout_plan',[WorkoutController::class, 'post_workout_plan']);

Route::get('meals',[UserDataController::class, 'view_meals']);
Route::get('meals/{id}',[UserDataController::class, 'view_meals_by_user_id']);
Route::post('meals',[UserDataController::class, 'post_meals']);

Route::get('diet_plan',[DietController::class, 'view_diet_plan']);
Route::post('diet_plan',[DietController::class, 'post_diet_plan']);

Route::get('user_like_exercise',[UserDataController::class, 'view_user_like_exercise']);
Route::get('user_like_exercise/{id}',[UserDataController::class, 'view_user_like_exercise_by_user_id']);
Route::post('user_like_exercise',[UserDataController::class, 'post_user_like_exercise']);

Route::get('user_like_food',[UserDataController::class, 'view_user_like_food']);
Route::get('user_like_food/{id}',[UserDataController::class, 'view_user_like_food_by_user_id']);
Route::post('user_like_food',[UserDataController::class, 'post_user_like_food']);

Route::get('user_physique',[UserDataController::class, 'view_user_physique']);
Route::get('user_physique/{id}',[UserDataController::class, 'view_user_physique_by_user_id']);
Route::post('user_physique',[UserDataController::class, 'post_user_physique']);