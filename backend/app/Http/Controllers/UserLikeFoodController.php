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

class UserLikeFoodController extends Controller implements HasMiddleware
{
    public static function middleware(){
        return [
            new Middleware('auth:sanctum')
        ];
    }

    public function post_user_like_food(Request $request){
        $fields = $request->validate([
            'food_id' => 'required',
        ]);

        $userLikeFood = $request->user()->likeFood()->create($fields);

        return response()->json([
            'status' => 200,
            'message' => 'Data uploaded',
            'data' => $userLikeFood
        ], 200);
    }

    public function view_user_like_food(Request $request){
        $user = $request->user();
        $userLikeExercise = UserLikeExercise::where('user_id', $user->id)->get();

        $data = [
            'status' =>200,
            'userLikeExercise'=> $userLikeExercise
        ];
        return response()->json($data,200);
    }

    public function delete_user_like_food(Request $request, $id)
    {
        $food = UserLikeFood::find($id);

        if ($food) {
            if ($food->user_id == $request->user()->id) {
                $food->delete();
                return response()->json(['message' => 'food deleted'], 200);
            } else {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } else {
            return response()->json(['message' => 'food not found'], 404);
        }
    }

}
