<?php

namespace App\Http\Controllers;

use App\Models\Meals;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class MealsController extends Controller implements HasMiddleware
{
    /**
     * Display a listing of the resource.
     */
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum')
        ];
    }

    public function view_meals_by_user_id(Request $request)
    {
        $user = $request->user();

        $yesterday = now()->subDay()->toDateString();
        Meals::where('user_id', $user->id)
            ->whereDate('date', $yesterday)
            ->delete();
        
        $meals = Meals::where('user_id', $user->id)->get();

        if ($meals->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'No meals found'
            ], 404);
        }
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
}
