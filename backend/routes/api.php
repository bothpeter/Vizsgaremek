<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\FoodController;

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