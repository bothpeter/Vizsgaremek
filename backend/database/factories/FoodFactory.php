<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Food>
 */
class FoodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'food_id' => $this->faker->randomNumber(1, 10),
            'name' => $this->faker->word,
            'description' => $this->faker->text,
            'type' => $this->faker->word,
            'calorie' => $this->faker->randomFloat(2, 0, 9999),
            'fat' => $this->faker->randomFloat(2, 0, 9999),
            'protein' => $this->faker->randomFloat(2, 0, 9999),
            'carb' => $this->faker->randomFloat(2, 0, 9999),
            'img' => $this->faker->word,
            'recipe' => $this->faker->text,
            'user_id'=>User::factory(),
        ];
    }
}
