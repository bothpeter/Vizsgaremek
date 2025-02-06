<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Exercise;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Validator;

class ExerciseController extends Controller implements HasMiddleware
{
    public static function middleware(){
        return [
            new Middleware('auth:sanctum', except: ['view_exercises','view_exercise_by_exercise_id'])
        ];
    }

    public function view_exercises(){
        $exercise = Exercise::all();

        $data = [
            'status' =>200,
            'exercise'=> $exercise
        ];
        return response()->json($data,200);
    }

    public function view_exercise_by_exercise_id($id){
        $exercise = Exercise::where('exercise_id',$id)->get();

        $data = [
            'status' =>200,
            'exercise'=> $exercise
        ];
        return response()->json($data,200);
    }

    public function post_exercises(Request $request){
        $fields = $request->validate([
            'exercise_name' => 'required',
            'muscle_group' => 'required',
            'description' => 'required',
            'img_url' => 'nullable',
            'type' => 'required'
        ]);

        $exercise = $request->user()->exercise()->create($fields);

        $data = [
            'status' => 200,
            'message' => 'Data uploaded',
            'exercise' => $exercise
        ];
        return response()->json($data, 200);
    }
}
