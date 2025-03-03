<?php

namespace App\Http\Controllers;

use App\Models\UserPhysique;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Validator;

class UserPhysiqueController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum')
        ];
    }

    public function post_user_physique(Request $request)
    {
        $fields = $request->validate([
            'progress_picture' => 'sometimes|image',
            'height' => 'required',
            'weight' => 'required',
            'age' => 'required',
            'gender' => 'required',
            'daily_calorie_intake' => 'required',
            'activity_level' => 'required',
            'goal' => 'required'
        ]);

        if ($request->hasFile('progress_picture')) {
            $image = $request->file('progress_picture');
            $imageData = file_get_contents($image->getRealPath());
            $mimeType = $image->getClientMimeType();
            $fields['progress_picture'] = 'data:' . $mimeType . ';base64,' . base64_encode($imageData);
        }

        $userPhysique = $request->user()->physique()->create($fields);

        return response()->json([
            'status' => 200,
            'message' => 'Data uploaded',
            'data' => $userPhysique
        ], 200);
    }

    public function view_user_physique(Request $request)
    {
        $user = $request->user();
        $userPhysique = UserPhysique::where('user_id', $user->id)->get();

        return response()->json([
            'status' => 200,
            'UserPhysique' => $userPhysique
        ], 200);
    }

    public function update_user_physique(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'progress_picture' => 'sometimes|image',
            'height' => 'sometimes',
            'weight' => 'sometimes',
            'age' => 'sometimes',
            'gender' => 'sometimes',
            'daily_calorie_intake' => 'sometimes',
            'activity_level' => 'sometimes',
            'goal' => 'sometimes'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $userPhysique = UserPhysique::where('user_id', $user->id)->first();

        if (!$userPhysique) {
            return response()->json([
                'status' => 404,
                'message' => 'User physique not found'
            ], 404);
        }

        $updateData = $validator->validated();

        if ($request->hasFile('progress_picture')) {
            $image = $request->file('progress_picture');

            if ($image->isValid()) {
                $imageData = file_get_contents($image->getRealPath());
                $mimeType = $image->getClientMimeType();
                $updateData['progress_picture'] = 'data:' . $mimeType . ';base64,' . base64_encode($imageData);
            } else {
                return response()->json([
                    'status' => 422,
                    'errors' => ['progress_picture' => 'Invalid image file']
                ], 422);
            }
        }

        $userPhysique->update($updateData);

        return response()->json([
            'status' => 200,
            'message' => 'Data updated',
            'data' => $userPhysique->fresh()
        ], 200);
    }
}
