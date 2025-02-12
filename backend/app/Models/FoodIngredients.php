<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class FoodIngredients extends Model
{
    use HasFactory, Notifiable, HasApiTokens;
    public $timestamps = false;
    protected $primaryKey = 'ingredient_id';
    protected $fillable = [
        'food_id',
        'ingredient_name',
        'amount',
        'calorie',
        'fat',
        'protein',
        'carb'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
