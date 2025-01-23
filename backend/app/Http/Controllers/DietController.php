<?php

namespace App\Http\Controllers;

use App\Models\DietPlan;
use Illuminate\Http\Request;

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
}
