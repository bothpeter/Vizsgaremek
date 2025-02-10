<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request){
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $fields = $validator->validated();

        $user = User::create($fields);

        $token = $user->createToken($user->name, ['*'], now()->addHour());

        return [
            'user' => $user,
            'token' => base64_encode($token->plainTextToken)
        ];
    }

    public function login(Request $request){
        $validator = Validator::make($request->all(), [
            'login' => 'required',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $fields = $validator->validated();

        $user = User::where('email', $fields['login'])
                    ->orWhere('name', $fields['login'])
                    ->first();

        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response()->json(['message' => 'Bad credentials'], 401);
        }

        $token = $user->createToken($user->name, ['*'], now()->addHour());

        return [
            'user' => $user,
            'token' => base64_encode($token->plainTextToken)
        ];
    }
    
    public function logout(Request $request){
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out'
        ]);
    }
}
