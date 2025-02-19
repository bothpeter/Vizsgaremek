<?php

namespace Database\Factories;

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
            'exercise_name' => $this->faker->word,
            'muscle_group' => $this->faker->word,
            'description' => $this->faker->word,
            'img' => $this->faker->word,
            'type' => $this->faker->word,
            'user_id' => $this->faker->word,
        ];
    }
}
