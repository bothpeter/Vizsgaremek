<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'exercise_name',
        'muscle_group',
        'descriptipn',
        'img_url',
        'type'
    ];
}
