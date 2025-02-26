<?php

namespace Tests\Unit;

use App\Models\FoodIngredients;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

class FoodIngredientsTest extends BaseTestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_view_ingredient_by_food_id()
    {
        $ingredient = FoodIngredients::factory()->create();

        $response = $this->getJson('/api/food_ingredients/' . $ingredient->food_id);
        $response->assertStatus(200)
            ->assertJson([
                'status' => 200,
                'ingredients' => true,
            ]);
        $response = $this->getJson('/api/food_ingredients/999');
        $response->assertStatus(404)
            ->assertJson([
                'message' => "Ingredients not found for the given food ID",
            ]);
    }

    public function test_post_ingredients()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $data = [
            'food_id' => 1,
            'ingredient_name' => 'Apple',
            'amount' => '1',
            'calorie' => 52,
            'fat' => 0.2,
            'protein' => 0.3,
            'carb' => 13.8
        ];

        $response = $this->postJson('/api/food_ingredients', $data);

        $response->assertStatus(200)
            ->assertJson([
                "status" => 200,
                "message" => "Data uploaded",
                "ingredient" => [
                    "food_id" => 1,
                    "ingredient_name" => "Apple",
                    "amount" => "1",
                    "calorie" => 52,
                    "fat" => 0.2,
                    "protein" => 0.3,
                    "carb" => 13.8,
                    "user_id" => 1,
                    "ingredient_id" => 1
                ]
            ]);

        $this->assertDatabaseHas('food_ingredients', [
            'food_id' => 1,
            'ingredient_name' => 'Apple',
            'amount' => '1',
            'calorie' => 52,
            'fat' => 0.2,
            'protein' => 0.3,
            'carb' => 13.8
        ]);
    }

    public function test_delete_ingredients_by_food_id()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $food_ingredients = FoodIngredients::factory()->create(['user_id' => $user->id, 'food_id' => 1]);
        $response = $this->deleteJson('/api/food_ingredients/' . $food_ingredients->food_id);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Ingredients deleted']);

        $otherUser = User::factory()->create();
        $food_ingredients = FoodIngredients::factory()->create(['user_id' => $otherUser->id, 'food_id' => 2]);
        $response = $this->deleteJson('/api/food_ingredients/' . $food_ingredients->food_id);
        $response->assertStatus(403)
            ->assertJson(['message' => 'Unauthorized']);

        $response = $this->deleteJson('/api/food_ingredients/999');
        $response->assertStatus(404)
            ->assertJson(['message' => 'Ingredients not found for the given food ID']);
    }
}
