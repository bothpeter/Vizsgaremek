<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Meals extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'meals_id',
        'user_id',
        'food_id',
        'time'
    ];
}
