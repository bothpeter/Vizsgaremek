<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class UserPhysique extends Model
{
    use HasFactory, Notifiable, HasApiTokens;

    public $timestamps = false;
    protected $table = 'user_physique';
    protected $fillable = [
        'progress_picture',
        'height',
        'weight',
        'age',
        'gender',
        'daily_calorie_intake',
        'activity_level',
        'goal',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
