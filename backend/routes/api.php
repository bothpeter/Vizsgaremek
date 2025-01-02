<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExerciseController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('exercise', function () {
    return 'mukodik';
});

Route::get('exercise',[ExerciseController::class, 'index']);