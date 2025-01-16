<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'food_id',
        'user_id',
        'name',
        'description',
        'type',
        'calorie',
        'fat',
        'protein',
        'carb',
        'img_url',
        'recipe'
    ];
    
}
