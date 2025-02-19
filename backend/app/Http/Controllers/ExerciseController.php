<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Exercise;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Gate;
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
            'img' => 'nullable|image',
            'type' => 'required'
        ]);
    
        if ($request->hasFile('img')) {
            $filePath = $request->file('img')->store('exercises', 'public');
            $fields['img'] = url('storage/' . $filePath);
        }
    
        $exercise = $request->user()->exercise()->create($fields);
    
        return response()->json([
            'status' => 200,
            'message' => 'Data uploaded',
            'exercise' => [
                'exercise_name' => $exercise->exercise_name,
                'muscle_group' => $exercise->muscle_group,
                'description' => $exercise->description,
                'img' => $exercise->img ? url('storage/' . $exercise->img) : null,
                'type' => $exercise->type,
            ]
        ], 200);
    }
    

    public function delete_exercise(Request $request, $id)
    {
        $exercise = Exercise::find($id);

        if ($exercise) {
            if ($exercise->user_id == $request->user()->id) {
                $exercise->delete();
                return response()->json(['message' => 'Exercise deleted'], 200);
            } else {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } else {
            return response()->json(['message' => 'Exercise not found'], 404);
        }
    }
}
