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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log; // For debugging

class UserPhysiqueController extends Controller implements HasMiddleware
{
    public static function middleware(){
        return [
            new Middleware('auth:sanctum')
        ];
    }
    
    public function post_user_physique(Request $request){
        $fields = $request->validate([
            'progress_picture' => 'required|image',
            'height' => 'required',
            'weight' => 'required',
            'age' => 'required',
            'gender' => 'required',
        ]);

        if ($request->hasFile('progress_picture')) {
            $filePath = $request->file('progress_picture')->store('progress_pictures', 'public');
            $fields['progress_picture'] = url('storage/' . $filePath);
        }

        $userPhysique = $request->user()->physique()->create($fields);

        return response()->json([
            'status' => 200,
            'message' => 'Data uploaded',
            'data' => $userPhysique
        ], 200);
    }

    public function view_user_physique(Request $request){
        $user = $request->user();
        $userPhysique = UserPhysique::where('user_id', $user->id)->get();

        return response()->json([
            'status' => 200,
            'UserPhysique' => $userPhysique
        ], 200);
    }

public function update_user_physique(Request $request)
{
    // Log the incoming request payload for debugging
    Log::info('Request payload:', $request->all());

    // Manually validate the request data
    $validator = Validator::make($request->all(), [
        'progress_picture' => 'required|image', // Ensure this is set to 'required'
        'height' => 'required|numeric',
        'weight' => 'required|numeric',
        'age' => 'required|integer',
        'gender' => 'required|string',
    ]);

    // If validation fails, return a 422 response with the errors
    if ($validator->fails()) {
        Log::error('Validation errors:', $validator->errors()->toArray());
        return response()->json([
            'status' => 422,
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422);
    }

    // Get the validated fields
    $fields = $validator->validated();

    // Get the authenticated user
    $user = $request->user();

    // Find the user's physique record
    $userPhysique = $user->physique; // Use the correct relationship method

    // If the user physique record doesn't exist, return a 404 response
    if (!$userPhysique) {
        return response()->json([
            'status' => 404,
            'message' => 'User physique not found'
        ], 404);
    }

    // Handle the progress picture upload if provided
    if ($request->hasFile('progress_picture')) {
        // Store the new image and get the path
        $filePath = $request->file('progress_picture')->store('progress_pictures', 'public');
        $fields['progress_picture'] = url('storage/' . $filePath);

        // Optionally, delete the old progress picture if it exists
        if ($userPhysique->progress_picture) {
            $oldImagePath = str_replace(url('storage/'), '', $userPhysique->progress_picture);
            Storage::disk('public')->delete($oldImagePath); // Correct usage of the Storage facade
        }
    }

    // Log the fields being updated for debugging
    Log::info('Fields to update:', $fields);

    // Update the user physique record with the new data
    $updateResult = $userPhysique->update($fields);

    // Log the update result for debugging
    Log::info('Update result:', ['result' => $updateResult]);

    // Refresh the model to get the updated data
    $userPhysique->refresh();

    // Return a success response with the updated data
    return response()->json([
        'status' => 200,
        'message' => 'Data updated successfully',
        'data' => $userPhysique
    ], 200);
}
}
