<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\UserLikeFood;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase;

class UserLikeFoodTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_view_user_like_food()
    {
        $user = User::factory()->create();
        $token = $user->createToken('TestToken')->plainTextToken;

        $food = UserLikeFood::factory()->create(['user_id' => $user->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/user_like_food');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 200,
                'UserLikeFood' => [$food->toArray()],
            ]);
    }

    public function test_post_user_like_food()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $data= [
            'food_id' => 1,
        ];

        $response = $this->postJson('/api/user_like_food', $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 200,
                'message' => 'Data uploaded',
                'data' => true
            ]);
        $this->assertDatabaseHas('user_like_foods', $data);
    }

    public function test_delete_user_like_food()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $food = UserLikeFood::factory()->create(['user_id' => $user->id, 'food_id' => 1]);

        $response = $this->deleteJson('/api/user_like_food/' . $food->food_id);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Food deleted',
            ]);

        $this->assertDatabaseMissing('user_like_foods', ['food_id' => $food->food_id, 'user_id' => $user->id]);

        $response = $this->deleteJson('/api/user_like_food/' . $food->food_id);
        $response->assertStatus(404)
            ->assertJson([
                'message' => 'Food not found',
            ]);
    }
}
