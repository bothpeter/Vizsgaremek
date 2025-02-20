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
        $fields = $request->validate([
            'progress_picture' => 'nullable|image',
            'height' => 'required|numeric',
            'weight' => 'required|numeric',
            'age' => 'required|integer',
            'gender' => 'required|string',
        ]);
    
        $user = $request->user();
        $userPhysique = $user->physique; // Use the correct relationship method
    
        if (!$userPhysique) {
            return response()->json([
                'status' => 404,
                'message' => 'User physique not found'
            ], 404);
        }
    
        if ($request->hasFile('progress_picture')) {
            $filePath = $request->file('progress_picture')->store('progress_pictures', 'public');
            $fields['progress_picture'] = url('storage/' . $filePath);
    
            // Delete the old image if it exists
            if ($userPhysique->progress_picture) {
                $oldImagePath = str_replace(url('storage/'), '', $userPhysique->progress_picture);
                Storage::disk('public')->delete($oldImagePath);
            }
        }
    
        $userPhysique->update($fields);
    
        return response()->json([
            'status' => 200,
            'message' => 'Data updated successfully',
            'data' => $userPhysique
        ], 200);
    }
}
