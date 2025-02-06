<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLikeFood extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'food_id'
    ];

    public function user()
    {
        return $this->belongsToMany(User::class);
    }

}
