<?php

namespace App\Http\Controllers;

use App\Models\Meals;
use App\Models\User;
use App\Models\UserLikeExercise;
use App\Models\UserLikeFood;
use App\Models\UserPhysique;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware(){
        return [
            new Middleware('auth:sanctum')
        ];
    }

    public function update_user(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'string',
            'email' => 'email',
            'password' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $user = User::where('id', $user->id)->first();

        if ($user) {
            $user->update($validator->validated());

            return response()->json([
                'status' => 200,
                'message' => 'Data updated',
                'data' => $user
            ], 200);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'User physique not found'
            ], 404);
        }
    }
}
