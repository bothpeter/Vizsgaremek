<?php

namespace App\Http\Controllers;

use App\Models\FoodIngredients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class IngredientController extends Controller
{
    public function view_ingredients(){
        $ingredients = FoodIngredients::all();

        $data = [
            'status' =>200,
            'ingredients'=> $ingredients
        ];
        return response()->json($data,200);
    }

    public function post_ingredients(Request $request){
        $validator = Validator::make($request->all(),
        [
            'food_id'=>'required',
            'ingredient_name'=>'required'
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
            $ingredients = new FoodIngredients();

            $ingredients->food_id = $request->food_id;
            $ingredients->ingredient_name = $request->ingredient_name;
            $ingredients->amount = $request->amount;
            $ingredients->calorie = $request->calorie;
            $ingredients->fat = $request->fat;
            $ingredients->protein = $request->protein;
            $ingredients->carb = $request->carb;

            $ingredients->save();

            $data=[
                
                'status'=>200,
                'message'=>'Data uploaded'
            ];

            return response()->json($data,200);
        }

    }

    public function view_ingredient_by_food_id($food_id){
        $ingredients = FoodIngredients::where('food_id', $food_id)->get();

        if($ingredients->isNotEmpty())
        {
            $data=[
                'status'=>200,
                'ingredients'=>$ingredients
            ];
            return response()->json($data,200);
        }
        else
        {
            $data=[
                'status'=>404,
                'message'=>'Ingredients not found for the given food ID'
            ];
            return response()->json($data,404);
        }
    }
}
