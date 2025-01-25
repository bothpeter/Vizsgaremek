<?php

namespace App\Http\Controllers;

use App\Models\WorkoutPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WorkoutController extends Controller
{
    public function view_workout_plan(){
        $workout_plan = WorkoutPlan::all();

        $data = [
            'status' =>200,
            'workout_plan'=> $workout_plan
        ];
        return response()->json($data,200);
    }

    public function post_workout_plan(Request $request){
        $validator = Validator::make($request->all(),
        [
            'title'=>'required',
            'goodFor'=>'required',
            'description'=>'required',
            'type'=>'required'
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
            $workout_plan = new WorkoutPlan();

            $workout_plan->title = $request->title;
            $workout_plan->goodFor = $request->goodFor;
            $workout_plan->description = $request->description;
            $workout_plan->type = $request->type;
            $workout_plan->exercise1_id = $request->exercise1_id;
            $workout_plan->exercise2_id = $request->exercise2_id;
            $workout_plan->exercise3_id = $request->exercise3_id;
            $workout_plan->exercise4_id = $request->exercise4_id;
            $workout_plan->exercise5_id = $request->exercise5_id;

            $workout_plan->save();

            $data=[
                
                'status'=>200,
                'message'=>'Data uploaded'
            ];

            return response()->json($data,200);
        }

    }
}
