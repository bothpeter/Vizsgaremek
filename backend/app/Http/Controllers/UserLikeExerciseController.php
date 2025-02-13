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

class UserLikeExerciseController extends Controller implements HasMiddleware
{
    public static function middleware(){
        return [
            new Middleware('auth:sanctum')
        ];
    }

    public function post_user_like_exercise(Request $request){
        $fields = $request->validate([
            'exercise_id' => 'required',
        ]);

        $userLikeExercise = $request->user()->likeExercise()->create($fields);

        return response()->json([
            'status' => 200,
            'message' => 'Data uploaded',
            'data' => $userLikeExercise
        ], 200);
    }

    public function view_user_like_exercise_by_user_id($id){
        $UserLikeExercise = UserLikeExercise::where('user_id',$id)->get();

        $data = [
            'status' =>200,
            'UserLikeExercise'=> $UserLikeExercise
        ];
        return response()->json($data,200);
    }

    public function delete_user_like_exercise(Request $request, $id)
    {
        $exercise = UserLikeExercise::find($id);

        if ($exercise) {
            if ($exercise->user_id == $request->user()->id) {
                $exercise->delete();
                return response()->json(['message' => 'exercise deleted'], 200);
            } else {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } else {
            return response()->json(['message' => 'exercise not found'], 404);
        }
    }
}
