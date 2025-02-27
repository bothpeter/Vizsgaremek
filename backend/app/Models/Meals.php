<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Meals extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $table = 'meals';
    protected $fillable = [
        'user_id',
        'food_id',
        'date'
    ];

    public function user()
    {
        return $this->belongsToMany(User::class);
    }
}
