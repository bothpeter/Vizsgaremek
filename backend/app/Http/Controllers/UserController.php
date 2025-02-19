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
            'name' => 'string|unique:users,name,' . $request->user()->id . '|nullable',
            'email' => 'email|unique:users,email,' . $request->user()->id . '|nullable',
            'password' => 'string|nullable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $data = array_filter($validator->validated(), function($value) {
            return !is_null($value);
        });

        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        $user->update($data);

        return response()->json([
            'status' => 200,
            'message' => 'Data updated',
            'data' => $user
        ], 200);
    }
}
