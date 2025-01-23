<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Meals;
use Illuminate\Support\Facades\Validator;

class MealsController extends Controller
{
    public function view_meals(){
        $meal = Meals::all();

        $data = [
            'status' =>200,
            'meal'=> $meal
        ];
        return response()->json($data,200);
    }
}
