<?php

namespace App\Http\Controllers;

use App\Models\Meals;
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
            $userPhysique = new UserPhysique();

            $userPhysique->user_id = $request->user_id;
            $userPhysique->height = $request->height;
            $userPhysique->weight = $request->weight;
            $userPhysique->age = $request->age;
            $userPhysique->gender = $request->gender;

            $userPhysique->save();

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

    public function post_meals(Request $request){
        $validator = Validator::make($request->all(),
        [
            'user_id'=>'required',
            'food_id'=>'required'
        ]);

        if($validator->fails())
        {
            $data=[
                
                "status"=>422,
                "message"=>$validator->message()
            ];
            
            return response()->json($data,422);
        }

        else
        {
            $meal = new Meals();

            $meal->user_id = $request->user_id;
            $meal->food_id = $request->food_id;
            $meal->time = $request->time;

            $meal->save();

            $data=[
                
                'status'=>200,
                'message'=>'Data uploaded'
            ];

            return response()->json($data,200);
        }

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
