<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class WorkoutPlan extends Model
{
    use HasFactory, Notifiable, HasApiTokens;
    public $timestamps = false;
    protected $table = 'workout_plans';
    protected $fillable = [
        'title',
        'goodFor',
        'description',
        'type',
        'exercise1',
        'exercise2',
        'exercise3',
        'exercise4',
        'exercise5'
    ];

    public function user()
    {
        return $this->belongsToMany(User::class);
    }
}
