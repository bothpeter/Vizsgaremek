<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLikeExercise extends Model
{
    public $timestamps = false;
    protected $table = 'user_like_exercises';
    protected $fillable = [
        'exercise_id'
    ];

    public function user()
    {
        return $this->belongsToMany(User::class);
    }
}
