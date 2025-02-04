<?php

namespace App\Http\Controllers;

use App\Models\Meals;
use App\Models\UserLikeExercise;
use App\Models\UserLikeFood;
use App\Models\UserPhysique;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Validator;

class UserDataController extends Controller implements HasMiddleware
{
    public static function middleware(){
        return [
            new Middleware('auth:sanctum')
        ];
    }
    
    public function view_user_like_exercise(){
        $UserLikeExercise = UserLikeExercise::all();

        $data = [
            'status' =>200,
            'UserLikeExercise'=> $UserLikeExercise
        ];
        return response()->json($data,200);
    }

    public function view_user_like_food(){
        $UserLikeFood = UserLikeFood::all();

        $data = [
            'status' =>200,
            'UserLikeFood'=> $UserLikeFood
        ];
        return response()->json($data,200);
    }

    public function view_user_physique(){
        $UserPhysique = UserPhysique::all();

        $data = [
            'status' =>200,
            'UserPhysique'=> $UserPhysique
        ];
        return response()->json($data,200);
    }

    public function view_meals(){
        $meal = Meals::all();

        $data = [
            'status' =>200,
            'meal'=> $meal
        ];
        return response()->json($data,200);
    }

    public function post_user_physique(Request $request){
        $fields = $request->validate([
            'user_id' => 'required',
            'height' => 'required',
            'weight' => 'required',
            'age' => 'required',
            'gender' => 'required',
    ]);

        $userPhysique = $request->user()->physique()->create($fields);

        return response()->json([
            'status' => 200,
            'message' => 'Data uploaded',
            'data' => $userPhysique
        ], 200);
    }

    public function post_user_like_food(Request $request){
        $fields = $request->validate([
            'user_id' => 'required',
            'food_id' => 'required',
        ]);

        $userLikeFood = $request->user()->likeFoods()->create($fields);

        return response()->json([
            'status' => 200,
            'message' => 'Data uploaded',
            'data' => $userLikeFood
        ], 200);
    }
    
    public function post_user_like_exercise(Request $request){
        $fields = $request->validate([
            'user_id' => 'required',
            'exercise_id' => 'required',
        ]);

        $userLikeExercise = $request->user()->likeExercises()->create($fields);

        return response()->json([
            'status' => 200,
            'message' => 'Data uploaded',
            'data' => $userLikeExercise
        ], 200);
    }

    public function post_meals(Request $request){
        $fields = $request->validate([
            'user_id' => 'required',
            'meal_name' => 'required',
            'calories' => 'required',
            'protein' => 'required',
            'carbs' => 'required',
            'fat' => 'required',
        ]);

        $meal = $request->user()->meals()->create($fields);

        return response()->json([
            'status' => 200,
            'message' => 'Data uploaded',
            'data' => $meal
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

    public function view_user_like_food_by_user_id($id){
        $UserLikeFood = UserLikeFood::where('user_id',$id)->get();

        $data = [
            'status' =>200,
            'UserLikeFood'=> $UserLikeFood
        ];
        return response()->json($data,200);
    }

    public function view_user_physique_by_user_id($id){
        $UserPhysique = UserPhysique::where('user_id',$id)->get();

        $data = [
            'status' =>200,
            'UserPhysique'=> $UserPhysique
        ];
        return response()->json($data,200);
    }

    public function view_meals_by_user_id($id){
        $meal = Meals::where('user_id',$id)->get();

        $data = [
            'status' =>200,
            'meal'=> $meal
        ];
        return response()->json($data,200);
    }
}
