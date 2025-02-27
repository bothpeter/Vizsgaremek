<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserPhysique>
 */
class UserPhysiqueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id'=>$this->faker->randomNumber(),
            'user_id'=>User::factory(),
            'progress_picture'=>$this->faker->image(),
            'height'=>$this->faker->randomFloat(0, 0, 9999.9999),
            'weight'=>$this->faker->randomFloat(0, 0, 9999.9999),
            'age'=>$this->faker->randomNumber(),
            'gender'=>$this->faker->word,
            'daily_calorie_intake'=>$this->faker->randomFloat(0, 0, 9999.9999),
            'activity_level'=>$this->faker->word,
            'goal'=>$this->faker->word,
        ];
    }
}
