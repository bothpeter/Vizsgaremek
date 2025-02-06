<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Testing\Fluent\Concerns\Has;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function physique()
    {
        return $this->hasOne(UserPhysique::class);
    }

    public function likeFood()
    {
        return $this->hasMany(UserLikeFood::class);
    }

    public function likeExercise()
    {
        return $this->hasMany(UserLikeExercise::class);
    }

    public function food()
    {
        return $this->hasMany(Food::class);
    }

    public function exercise()
    {
        return $this->hasMany(Exercise::class);
    }

    public function foodIngredient()
    {
        return $this->hasMany(FoodIngredients::class);
    }

    public function dietPlan()
    {
        return $this->hasMany(DietPlan::class);
    }

    public function workoutPlan()
    {
        return $this->hasMany(WorkoutPlan::class);
    }
}
