<?php

namespace App\Http\Controllers;

use App\Models\FoodIngredients;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Http\Request;

class IngredientController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum', except: ['view_ingredients', 'view_ingredient_by_food_id'])
        ];
    }

    public function post_ingredients(Request $request)
    {
        $fields = $request->validate([
            'food_id' => 'required',
            'ingredient_name' => 'required',
            'amount' => 'nullable',
            'calorie' => 'nullable',
            'fat' => 'nullable',
            'protein' => 'nullable',
            'carb' => 'nullable'
        ]);

        $ingredient = $request->user()->foodIngredient()->create($fields);

        $data = [
            'status' => 200,
            'message' => 'Data uploaded',
            'ingredient' => $ingredient
        ];
        return response()->json($data, 200);
    }

    public function view_ingredient_by_food_id($food_id)
    {
        $ingredients = FoodIngredients::where('food_id', $food_id)->get();

        if ($ingredients->isNotEmpty()) {
            $data = [
                'status' => 200,
                'ingredients' => $ingredients
            ];
            return response()->json($data, 200);
        } else {
            $data = [
                'status' => 404,
                'message' => 'Ingredients not found for the given food ID'
            ];
            return response()->json($data, 404);
        }
    }

    public function delete_ingredients_by_food_id(Request $request, $food_id)
    {
        $ingredients = FoodIngredients::where('food_id', $food_id)->get();

        if ($ingredients->isNotEmpty()) {
            foreach ($ingredients as $ingredient) {
                if ($ingredient->user_id == $request->user()->id) {
                    $ingredient->delete();
                } else {
                    return response()->json(['message' => 'Unauthorized'], 403);
                }
            }
            return response()->json(['message' => 'Ingredients deleted'], 200);
        } else {
            return response()->json(['message' => 'Ingredients not found for the given food ID'], 404);
        }
    }
}
