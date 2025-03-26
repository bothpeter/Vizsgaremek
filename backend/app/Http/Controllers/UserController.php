<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserPhysique;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum', except:['get_user'])
        ];
    }

    public function get_user()
    {
        $users = User::with('physique')->get();
    
        $data = [
            'status' => 200,
            'users' => $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'progress_picture' => $user->physique->progress_picture ?? null
                ];
            }),
        ];
    
        return response()->json($data);
    }
    

    public function update_user(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes',
            'email' => 'sometimes',
            'password' => 'sometimes|confirmed',
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
        }
    }

    public function delete_user(Request $request)
    {
        $user = $request->user();
        $user = User::where('id', $user->id)->first();

        if ($user) {
            $user->delete();
            $user->tokens()->delete();

            return response()->json(['message' => 'User deleted'], 200);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }
}
