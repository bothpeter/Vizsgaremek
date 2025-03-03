<?php

namespace App\Http\Controllers;

use App\Models\Meals;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class MealsController extends Controller implements HasMiddleware
{

    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum')
        ];
    }

    public function view_meals_by_user_token(Request $request)
    {
        $user = $request->user();

        $yesterday = now()->subDay()->toDateString();
        Meals::where('user_id', $user->id)
            ->whereDate('date', $yesterday)
            ->delete();

        $meals = Meals::where('user_id', $user->id)->get();

        $data = [
            'status' => 200,
            'Meals' => $meals
        ];
        return response()->json($data, 200);
    }

    public function post_meals(Request $request)
    {
        $fields = $request->validate([
            'food_id' => 'required',
            'date' => 'required',
        ]);

        $meals = $request->user()->meals()->create($fields);

        return response()->json([
            'status' => 200,
            'message' => 'Meal uploaded',
            'data' => $meals
        ], 200);
    }

    public function delete_meals_by_food_id(Request $request, $id)
    {
        $user = $request->user();
        $meals = Meals::where('user_id', $user->id)
            ->where('food_id', $id)
            ->delete();

        if ($meals) {
            return response()->json([
                'status' => 200,
                'message' => 'Meal deleted'
            ], 200);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Meal not found'
            ], 404);
        }
    }
}
