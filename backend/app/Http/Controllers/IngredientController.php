<?php

namespace App\Http\Controllers;

use App\Models\FoodIngredients;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class IngredientController extends Controller implements HasMiddleware
{
    public static function middleware(){
        return [
            new Middleware('auth:sanctum', except: ['view_ingredients','view_ingredient_by_food_id'])
        ];
    }

    public function view_ingredients(){
        $ingredients = FoodIngredients::all();

        $data = [
            'status' =>200,
            'ingredients'=> $ingredients
        ];
        return response()->json($data,200);
    }

    public function post_ingredients(Request $request){
        $fields = $request->validate([
            'ingredient_id' => 'required',
            'food_id' => 'required',
            'ingredient_name' => 'required',
            'amount' => 'nullable',
            'calorie' => 'nullable',
            'fat' => 'nullable',
            'protein' => 'nullable',
            'carb' => 'nullable',
            'user_id' => 'required'
        ]);

        $ingredient = FoodIngredients::create($fields);

        $data = [
            'status' => 200,
            'message' => 'Data uploaded',
            'ingredient' => $ingredient
        ];
        return response()->json($data, 200);
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
