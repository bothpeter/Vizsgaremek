<?php

namespace App\Http\Controllers;

use App\Models\Food;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Validator;
use Illuminate\Routing\Controllers\Middleware;
use Nette\Schema\Expect;

class FoodController extends Controller implements HasMiddleware
{

    public static function middleware(){
        return [
            new Middleware('auth:sanctum', except: ['view_foods','view_foods_by_id'])
        ];
    }

    public function view_foods(){
        $food = Food::all();

        $data = [
            'status' =>200,
            'food'=> $food
        ];
        return response()->json($data,200);
    }

    public function post_foods(Request $request){
        $fields = $request->validate([
            'name' => 'required',
            'description' => 'required',
            'type' => 'required',
            'calorie' => 'nullable',
            'fat' => 'nullable',
            'protein' => 'nullable',
            'carb' => 'nullable',
            'img_url' => 'nullable',
            'recipe' => 'nullable'
        ]);

        $food = $request->user()->food()->create($fields);

        return response()->json([
            'status' => 200,
            'message' => 'Data uploaded',
            'data' => $food
        ], 200);
    }

    public function view_foods_by_id($id){
        $food = Food::where('food_id',$id)->get();

        $data = [
            'status' =>200,
            'food'=> $food
        ];
        return response()->json($data,200);
    }

    public function delete_food(Request $request, $id)
    {
        $food = Food::find($id);

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
