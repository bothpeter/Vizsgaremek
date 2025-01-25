<?php

namespace App\Http\Controllers;

use App\Models\DietPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DietController extends Controller
{
    public function view_diet_plan(){
        $workout_plan = DietPlan::all();

        $data = [
            'status' =>200,
            'workout_plan'=> $workout_plan
        ];
        return response()->json($data,200);
    }

    public function post_diet_plan(Request $request){
        $validator = Validator::make($request->all(),
        [
            'title'=>'required',
            'description'=>'required',
            'foods'=>'required'
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
            $diet_plan = new DietPlan();

            $diet_plan->title = $request->title;
            $diet_plan->description = $request->description;
            $diet_plan->foods = $request->foods;
            $diet_plan->kcal = $request->kcal;
            $diet_plan->food1_id = $request->food1_id;
            $diet_plan->food2_id = $request->food2_id;
            $diet_plan->food3_id = $request->food3_id;

            $diet_plan->save();

            $data=[
                
                'status'=>200,
                'message'=>'Data uploaded'
            ];

            return response()->json($data,200);
        }

    }
}
