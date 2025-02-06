<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPhysique extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'height',
        'weight',
        'age',
        'gender'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
