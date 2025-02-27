<?php

namespace Tests\Unit;

use App\Models\Food;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase;

class FoodTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_view_foods()
    {
        Food::factory()->create();

        $response = $this->getJson('/api/food');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 200,
                'food' => true,
            ]);
    }

    public function test_view_foods_by_food_id()
    {
        $food = Food::factory()->create();

        $response = $this->getJson('/api/food/' . $food->food_id);
        $response->assertStatus(200)
            ->assertJson([
                'status' => 200,
                'food' => true,
            ]);

        $response = $this->getJson('/api/food/999');
        $response->assertStatus(404)
            ->assertJson([
                'message' => "Food not found",
            ]);
    }

    public function test_post_foods()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $data = [
            'name' => 'Apple',
            'description' => 'A fruit',
            'type' => 'Fruit',
            'calorie' => 52,
            'fat' => 0.2,
            'protein' => 0.3,
            'carb' => 14,
            'img' => new \Illuminate\Http\UploadedFile(
                base_path('public/images/logo.png'),
                'logo.png',
                'image/png',
                null,
                true
            ),
            'recipe' => 'Eat it'
        ];

        $response = $this->postJson('/api/food', $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 200,
                'message' => 'Food uploaded',
                'food' => true,
            ]);

        $this->assertDatabaseHas('foods', [
            'name' => 'Apple',
            'description' => 'A fruit',
            'type' => 'Fruit',
            'calorie' => 52,
            'fat' => 0.2,
            'protein' => 0.3,
            'carb' => 14,
            'img' => 'data:image/png;base64,' . base64_encode(file_get_contents(base_path('public/images/logo.png'))),
            'recipe' => 'Eat it',
            'user_id' => $user->id
        ]);
    }

    public function test_delete_food()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $food = Food::factory()->create(['user_id' => $user->id]);
        $response = $this->deleteJson('/api/food/' . $food->food_id);

        $response->assertStatus(200)
            ->assertJson(['message' => 'food deleted']);

        $otherUser = User::factory()->create();
        $food = Food::factory()->create(['user_id' => $otherUser->id]);
        $response = $this->deleteJson('/api/food/' . $food->food_id);
        $response->assertStatus(403)
            ->assertJson(['message' => 'Unauthorized']);

        $response = $this->deleteJson('/api/food/999');
        $response->assertStatus(404)
            ->assertJson(['message' => 'food not found']);
    }
}
