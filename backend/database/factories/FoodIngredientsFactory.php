<?php

namespace Database\Factories;

use App\Models\Food;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FoodIngredients>
 */
class FoodIngredientsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'food_id' => Food::factory(),
            'ingredient_id' => $this->faker->randomNumber(1, 10),
            'ingredient_name' => $this->faker->word,
            'amount' => $this->faker->randomNumber(1, 10),
            'calorie' => $this->faker->randomFloat(2, 0, 9999),
            'fat' => $this->faker->randomFloat(2, 0, 9999),
            'protein' => $this->faker->randomFloat(2, 0, 9999),
            'carb' => $this->faker->randomFloat(2, 0, 9999),
            'user_id'=>User::factory(),
        ];
    }
}
