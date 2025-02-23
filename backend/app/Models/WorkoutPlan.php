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
    protected $primaryKey = 'id';
    protected $fillable = [
        'title',
        'goodFor',
        'description',
        'type',
        'exercise1_id',
        'exercise2_id',
        'exercise3_id',
        'exercise4_id',
        'exercise5_id'
    ];

    public function user()
    {
        return $this->belongsToMany(User::class);
    }
}
