<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Meals;
use Illuminate\Support\Facades\Validator;

class MealsController extends Controller
{
    public function view_meals(){
        $meal = Meals::all();

        $data = [
            'status' =>200,
            'meal'=> $meal
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
}
