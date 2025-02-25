<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Exercise>
 */
class ExerciseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'exercise_id' => $this->faker->randomNumber(1, 10),
            'exercise_name' => $this->faker->word,
            'muscle_group' => $this->faker->word,
            'description' => $this->faker->sentence,
            'img' => $this->faker->image(),
            'type' => $this->faker->word,
            'user_id' => User::factory(),
        ];
    }
}
