<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Exercise extends Model
{
    use HasFactory, Notifiable, HasApiTokens;
    
    public $timestamps = false;
    protected $fillable = [
        'exercise_name',
        'muscle_group',
        'description',
        'img_url',
        'type'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
