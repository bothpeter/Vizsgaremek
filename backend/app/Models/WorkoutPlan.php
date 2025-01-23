<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkoutPlan extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'title',
        'goodFor',
        'description',
        'type',
        'exercise1',
        'exercise2',
        'exercise3',
        'exercise4',
        'exercise5',
    ];
}
