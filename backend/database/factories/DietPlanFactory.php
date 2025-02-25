<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DietPlan>
 */
class DietPlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id'=>$this->faker->randomNumber(1, 10),
            'title'=>$this->faker->word,
            'description'=>$this->faker->text,
            'foods'=>$this->faker->text,
            'kcal'=>$this->faker->randomNumber(2),
            'food1_id'=>$this->faker->randomNumber(2),
            'food2_id'=>$this->faker->randomNumber(2),
            'food3_id'=>$this->faker->randomNumber(2),
            'user_id'=>$this->faker->randomNumber(2),
        ];
    }
}
