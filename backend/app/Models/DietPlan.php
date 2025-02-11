<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class DietPlan extends Model
{
    use HasFactory, Notifiable, HasApiTokens;
    public $timestamps = false;
    protected $table = 'diet_plans';
    protected $fillable = [
        'title',
        'description',
        'foods',
        'kcal',
        'food1_id',
        'food2_id',
        'food3_id'
    ];

    public function user()
    {
        return $this->belongsToMany(User::class);
    }
}
