<?php

namespace App\Http\Controllers;

use App\Models\WorkoutPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class WorkoutController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum', except: ['view_workout_plan'])
        ];
    }

    public function view_workout_plan()
    {
        $workout_plan = WorkoutPlan::all();

        $data = [
            'status' => 200,
            'workout_plan' => $workout_plan
        ];
        return response()->json($data, 200);
    }

    public function post_workout_plan(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'goodFor' => 'required',
            'description' => 'required',
            'type' => 'required',
            'exercise1_id' => 'sometimes',
            'exercise2_id' => 'sometimes',
            'exercise3_id' => 'sometimes',
            'exercise4_id' => 'sometimes',
            'exercise5_id' => 'sometimes'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $fields = $validator->validated();

        $workout_plan = $request->user()->workoutPlan()->create($fields);

        $data = [
            'status' => 200,
            'message' => 'Data uploaded',
            'workout_plan' => $workout_plan
        ];
        return response()->json($data, 200);
    }

    public function delete_workout(Request $request, $id)
    {
        $workout = WorkoutPlan::find($id);

        if ($workout) {
            if ($workout->user_id == $request->user()->id) {
                $workout->delete();
                return response()->json(['message' => 'workout deleted'], 200);
            } else {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } else {
            return response()->json(['message' => 'workout not found'], 404);
        }
    }
}
