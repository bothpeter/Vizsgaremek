<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Exercise;
use Illuminate\Support\Facades\Validator;

class ExerciseController extends Controller
{
    public function view_exercises(){
        $exercise = Exercise::all();

        $data = [
            'status' =>200,
            'exercise'=> $exercise
        ];
        return response()->json($data,200);
    }

    public function post_exercises(Request $request){
        $validator = Validator::make($request->all(),
        [
        
            'muscle_group'=>'required',
            'description'=>'required'
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
            $exercise = new Exercise();

            $exercise->muscle_group=$request->muscle_group;
            $exercise->description=$request->description;
            $exercise->img_url = $request->img_url ?: null;
            $exercise->type=$request->type;

            $exercise->save();

            $data=[
                
                'status'=>200,
                'message'=>'Data uploaded'
            ];

            return response()->json($data,200);
        }

    }
}
