<?php

namespace App\Http\Controllers;

use App\Models\Food;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FoodController extends Controller
{
    public function view_foods(){
        $food = Food::all();

        $data = [
            'status' =>200,
            'food'=> $food
        ];
        return response()->json($data,200);
    }

    public function post_food(Request $request){
        $validator = Validator::make($request->all(),
        [
            'description'=>'required'
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
            $food = new Food();

            $food->description=$request->description;
            $food->type=$request->type;
            $food->calorie=$request->calorie;
            $food->fat=$request->fat;
            $food->protein=$request->protein;
            $food->carb=$request->carb;
            $food->img_url = $request->img_url ?: null;
            
            $food->save();

            $data=[
                
                'status'=>200,
                'message'=>'Data uploaded'
            ];

            return response()->json($data,200);
        }

    }
}
