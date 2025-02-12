<?php

namespace App\Http\Controllers;

use App\Models\DietPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class DietController extends Controller implements HasMiddleware
{
    public static function middleware(){
        return [
            new Middleware('auth:sanctum', except: ['view_diet_plan'])
        ];
    }

    public function view_diet_plan(){
        $workout_plan = DietPlan::all();

        $data = [
            'status' =>200,
            'workout_plan'=> $workout_plan
        ];
        return response()->json($data,200);
    }

    public function post_diet_plan(Request $request){
        $fields = $request->validate([
            'title' => 'required',
            'description' => 'required',
            'foods' => 'required',
            'kcal' => 'nullable',
            'food1_id' => 'nullable',
            'food2_id' => 'nullable',
            'food3_id' => 'nullable'
        ]);

        $diet_plan = $request->user()->dietPlan()->create($fields);

        $data = [
            'status' => 200,
            'message' => 'Data uploaded',
            'diet_plan' => $diet_plan
        ];
        return response()->json($data, 200);
    }

    public function delete_diet(Request $request, $id)
    {
        $diet = DietPlan::find($id);

        if ($diet) {
            if ($diet->user_id == $request->user()->id) {
                $diet->delete();
                return response()->json(['message' => 'diet deleted'], 200);
            } else {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } else {
            return response()->json(['message' => 'diet not found'], 404);
        }
    }
}
