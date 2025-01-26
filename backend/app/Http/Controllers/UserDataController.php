<?php

namespace App\Http\Controllers;

use App\Models\UserLikeExercise;
use App\Models\UserLikeFood;
use App\Models\UserPhysique;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserDataController extends Controller
{
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
            'UserLikeFood$UserLikeFood'=> $UserLikeFood
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

    public function post_user_physique(Request $request){
        $validator = Validator::make($request->all(),
        [
            'user_id'=>'required',
            'height'=>'required',
            'weight'=>'required',
            'age'=>'required',
            'gender'=>'required'
        ]);

        if($validator->fails())
        {
            $data=[
                
                "status"=>422,
                "message"=>$validator->messages()
            ];
            
            return response()->json($data,422);
        }

        else
        {
            $meal = new UserPhysique();

            $meal->user_id = $request->user_id;
            $meal->height = $request->height;
            $meal->weight = $request->weight;
            $meal->age = $request->age;
            $meal->gender = $request->gender;

            $meal->save();

            $data=[
                
                'status'=>200,
                'message'=>'Data uploaded'
            ];

            return response()->json($data,200);
        }

    }

    public function post_user_like_food(Request $request){
        $UserLikeFood = new UserLikeFood();

        $UserLikeFood->user_id=$request->user_id;
        $UserLikeFood->food_id=$request->food_id;

        $UserLikeFood->save();

        $data=[
            'status'=>200,
            'message'=>'Data uploaded'
        ];

        return response()->json($data,200);
    }

    public function post_user_like_exercise(Request $request){
        $UserLikeExercise = new UserLikeExercise();

        $UserLikeExercise->user_id=$request->user_id;
        $UserLikeExercise->exercise_id=$request->exercise_id;

        $UserLikeExercise->save();

        $data=[
            'status'=>200,
            'message'=>'Data uploaded'
        ];

        return response()->json($data,200);
    }
}
