<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DietController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\UserLikeExerciseController;
use App\Http\Controllers\UserLikeFoodController;
use App\Http\Controllers\UserPhysiqueController;
use App\Http\Controllers\WorkoutController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register',[AuthController::class, 'register']);
Route::post('/login',[AuthController::class, 'login']);
Route::post('/logout',[AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::post('/forgot_password',[AuthController::class, 'forgot']);
Route::post('/reset_password',[AuthController::class, 'reset']);

Route::get('exercise',[ExerciseController::class, 'view_exercises']);
Route::get('exercise/{id}',[ExerciseController::class, 'view_exercise_by_exercise_id']);
Route::post('exercise',[ExerciseController::class, 'post_exercises']);
Route::delete('exercise/{id}',[ExerciseController::class, 'delete_exercise']);

Route::get('food',[FoodController::class, 'view_foods']);
Route::get('food/{id}',[FoodController::class, 'view_foods_by_id']);
Route::post('food',[FoodController::class, 'post_foods']);
Route::delete('food/{id}',[FoodController::class, 'delete_food']);

Route::get('food_ingredients/{id}',[IngredientController::class, 'view_ingredient_by_food_id']);
Route::post('food_ingredients',[IngredientController::class, 'post_ingredients']);
Route::delete('food_ingredients/{id}',[IngredientController::class, 'delete_ingredient']);

Route::get('workout_plan',[WorkoutController::class, 'view_workout_plan']);
Route::post('workout_plan',[WorkoutController::class, 'post_workout_plan']);
Route::delete('workout_plan/{id}',[WorkoutController::class, 'delete_workout']);

Route::get('diet_plan',[DietController::class, 'view_diet_plan']);
Route::post('diet_plan',[DietController::class, 'post_diet_plan']);
Route::delete('diet_plan/{id}',[DietController::class, 'delete_diet']);

Route::get('user_like_exercise',[UserLikeExerciseController::class, 'view_user_like_exercise']);
Route::post('user_like_exercise',[UserLikeExerciseController::class, 'post_user_like_exercise']);
Route::delete('user_like_exercise/{id}',[UserLikeExerciseController::class, 'delete_user_like_exercise']);

Route::get('user_like_food',[UserLikeFoodController::class, 'view_user_like_food']);
Route::post('user_like_food',[UserLikeFoodController::class, 'post_user_like_food']);
Route::delete('user_like_food/{id}',[UserLikeFoodController::class, 'delete_user_like_food']);

Route::get('user_physique',[UserPhysiqueController::class, 'view_user_physique']);
Route::post('user_physique',[UserPhysiqueController::class, 'post_user_physique']);