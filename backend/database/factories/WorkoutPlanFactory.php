<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WorkoutPlan>
 */
class WorkoutPlanFactory extends Factory
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
            'goodFor'=>$this->faker->word,
            'description'=>$this->faker->text,
            'type'=>$this->faker->word,
            'exercise1_id'=>$this->faker->randomNumber(2),
            'exercise2_id'=>$this->faker->randomNumber(2),
            'exercise3_id'=>$this->faker->randomNumber(2),
            'exercise4_id'=>$this->faker->randomNumber(2),
            'exercise5_id'=>$this->faker->randomNumber(2),
            'user_id'=>$this->faker->randomNumber(2),
        ];
    }
}
