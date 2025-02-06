<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Food extends Model
{
    use HasFactory, Notifiable, HasApiTokens;
    
    public $timestamps = false;
    protected $table = 'foods';
    protected $fillable = [
        'id',
        'name',
        'description',
        'type',
        'calorie',
        'fat',
        'protein',
        'carb',
        'img_url',
        'recipe',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsToMany(User::class);
    }
    
}
