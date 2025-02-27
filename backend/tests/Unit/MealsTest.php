<?php

namespace Tests\Unit;

use App\Models\Meals;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase;

class MealsTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_view_meals()
    {
        $user = User::factory()->create();
        $token = $user->createToken('TestToken')->plainTextToken;

        $meals = Meals::factory()->create(['user_id' => $user->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/user_physique');

        $response = $this->getJson('/api/meals');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 200,
                'Meals' => [$meals->toArray()],
            ]);
    }

    public function test_post_meals()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $data = [
            'food_id' => 1,
            'date' => '2021-10-10',
        ];

        $response = $this->postJson('/api/meals', $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 200,
                'message' => 'Meal uploaded',
                'data' => [
                    'user_id' => $user->id,
                    'food_id' => $data['food_id'],
                    'date' => $data['date'],
                ],
            ]);
        $this->assertDatabaseHas('meals', $data);
    }

    public function test_delete_meals()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $meals = Meals::factory()->create(['user_id' => $user->id, 'food_id' => 1]);

        $response = $this->deleteJson('/api/meals/' . $meals->food_id);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Meal deleted',
            ]);

        $this->assertDatabaseMissing('meals', ['food_id' => $meals->food_id, 'user_id' => $user->id]);

        $response = $this->deleteJson('/api/meals/' . $meals->food_id);
        $response->assertStatus(404)
            ->assertJson([
                'message' => 'Meal not found',
            ]);
    }
}
