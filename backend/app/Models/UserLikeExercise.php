<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLikeExercise extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'exercise_id'
    ];
}
