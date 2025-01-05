<?php

namespace App\Http\Controllers;

use App\Models\Food;
use Illuminate\Http\Request;

class FoodController extends Controller
{
    public function view_foods(){
        $food = Food::all();

        $data = [
            'status' =>200,
            'exercise'=> $food
        ];
        return response()->json($data,200);
    }
}
