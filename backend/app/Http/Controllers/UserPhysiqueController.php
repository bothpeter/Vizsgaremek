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
            $image = $request->file('progress_picture');
            $imageData = base64_encode(file_get_contents($image->getRealPath()));
            $fields['progress_picture'] = $imageData;
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

    public function update_user_physique(Request $request){
        $fields = $request->validate([
            'progress_picture' => 'sometimes|image',
            'height' => 'sometimes',
            'weight' => 'sometimes',
            'age' => 'sometimes',
            'gender' => 'sometimes',
        ]);
    
        $user = $request->user();
        $userPhysique = UserPhysique::where('user_id', $user->id)->first();
    
        if (!$userPhysique) {
            return response()->json([
                'status' => 404,
                'message' => 'User physique not found'
            ], 404);
        }
    
        if ($request->hasFile('progress_picture')) {
            $image = $request->file('progress_picture');
            $imageData = base64_encode(file_get_contents($image->getRealPath()));
            $mimeType = $image->getMimeType(); 
            $fields['progress_picture'] = "data:$mimeType;base64,$imageData";
        }
    
        if (!empty($fields)) {
            $userPhysique->update($fields);
        }
    
        return response()->json([
            'status' => 200,
            'message' => 'Data updated',
            'data' => $userPhysique
        ], 200);
    }
    
}
