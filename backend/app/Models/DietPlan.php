<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DietPlan extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'title',
        'description',
        'foods',
        'kcal',
        'food1_id',
        'food2_id',
        'food3_id',
    ];
}
