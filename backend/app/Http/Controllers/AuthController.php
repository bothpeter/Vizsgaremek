<?php

namespace App\Http\Controllers;

use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\PasswordReset;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Notifications\ResetPasswordNotification;


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

    public function forgot(ForgotPasswordRequest $request): JsonResponse
    {
    /** @var \App\Models\User $user */
        $user = (User::query());

        $user = $user->where('email', $request->input('email'))->first();

        if (!$user || !$user->email) {
            return response()->json(['message' => 'No Record Found', 'error' => 'Incorrect Email Address Provided'], 404);
        }

        $resetPasswordToken = str_pad(random_int(1, 9999), 4, '0', STR_PAD_LEFT);
        $expiresAt = now()->addMinutes(60);

        if (!$userPassReset = PasswordReset::where('email', $user->email)->first()) {
            PasswordReset::create([
                'email' => $user->email,
                'token' => $resetPasswordToken,
                'expires_at' => $expiresAt,
            ]);
        } else {
            $userPassReset->update([
                'email' => $user->email,
                'token' => $resetPasswordToken,
                'expires_at' => $expiresAt,
            ]);
        }
        $user->notify(
            new ResetPasswordNotification(
                $resetPasswordToken
            )
        );
    
    return new JsonResponse(['message'=> 'Reset Password Token Sent to your Email Address']);
    }

    public function reset(ResetPasswordRequest $request): JsonResponse
    {
        $attributes = $request->validated();

        $user = User::where('email', $attributes['email'])
                    ->first();

        if (!$user) {
            return response()->json(['error' => 'No Record Found', 'message' => 'Incorrect Email Address Provided'], 404);
        }

        $resetRequest = PasswordReset::where('email', $user->email)->first();

        if (!$resetRequest) {
            return response()->json(['error' => 'An Error Occurred. Please Try again.', 'message' => 'No reset request found.'], 400);
        }

        if ($resetRequest->token != $request->token) {
            return response()->json(['error' => 'An Error Occurred. Please Try again.', 'message' => 'Token mismatch.'], 400);
        }

        if ($resetRequest->expires_at->lt(now())) {
            return response()->json(['error' => 'Token Expired', 'message' => 'The reset token has expired.'], 400);
        }

        $user->update([
            'password' => Hash::make($attributes['password']),
        ]);
        $user->save();

        $user->tokens()->delete();

        $resetRequest->delete();

        $loginResponse = [
            'user' => $user,
        ];

        return new JsonResponse($loginResponse);
    }
}
