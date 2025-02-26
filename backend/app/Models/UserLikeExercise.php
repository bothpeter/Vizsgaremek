<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class UserLikeExercise extends Model
{
    use HasFactory, Notifiable, HasApiTokens;
    
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
