<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'food_id',
        'descriptipn',
        'type',
        'calorie',
        'fat',
        'protein',
        'carb',
        'img_url',  
    ];
}
