<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FoodIngredients extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'food_ingredients_id',
        'food_id',
        'ingredient_name',
        'calorie',
        'fat',
        'protein',
        'carb',
    ];
}
