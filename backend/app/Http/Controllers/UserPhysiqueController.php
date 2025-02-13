<?php

namespace App\Http\Controllers;

use App\Models\Meals;
use App\Models\User;
use App\Models\UserLikeExercise;
use App\Models\UserLikeFood;
use App\Models\UserPhysique;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Validator;

class UserPhysiqueController extends Controller implements HasMiddleware
{
    public static function middleware(){
        return [
            new Middleware('auth:sanctum')
        ];
    }
    
    public function post_user_physique(Request $request){
        $fields = $request->validate([
            'height' => 'required',
            'weight' => 'required',
            'age' => 'required',
            'gender' => 'required',
    ]);

        $userPhysique = $request->user()->physique()->create($fields);

        return response()->json([
            'status' => 200,
            'message' => 'Data uploaded',
            'data' => $userPhysique
        ], 200);
    }

    public function view_user_physique_by_user_id(Request $request){
        $user = $request->user();
        $UserPhysique = UserPhysique::where('user_id', $user->id)->get();

        $data = [
            'status' =>200,
            'UserPhysique'=> $UserPhysique
        ];
        return response()->json($data,200);
    }
}
